import { bindActionCreators } from 'redux';
import BigNumber from 'bignumber.js';
import { contractMethodCall, contractTxSend } from './actions';
import { getWeb3 } from './sagas';
import { last } from '../../utils';
import { getMethodKey } from './utils';
import { promisifyWeb3Call } from '../../utils/promisifyWeb3Call';

import { ABI_PROXY } from '../../app.config';

function degrade(fn, fallback) {
  try {
    return fn();
  } catch (e) {
    return fallback;
  }
}

function isForward(methodName, contractInstance) {
  return methodName === 'forward' && contractInstance.abi === ABI_PROXY;
}

function proxyInstance(proxyAddr) {
  proxyInstance.cache = proxyInstance.cache || {};
  if (!proxyInstance.cache[proxyAddr]) {
    proxyInstance.cache[proxyAddr] = getWeb3().eth.contract(ABI_PROXY).at(proxyAddr);
  }

  return proxyInstance.cache[proxyAddr];
}

function generateContractInstanceApi({ abi, address, getState, dispatch }) {
  // cached version doesn't exist, create it
  const contractInstance = getWeb3().eth.contract(abi).at(address);

  // reduce the abi into the redux methods
  const api = abi.reduce((o, definition) => {
    // skip if we're not dealing with a function
    if (definition.type !== 'function') { return o; }
    const methodName = definition.name;
    // build the actions
    const actions = bindActionCreators({
      // dispatches action to read contract method results and write into store
      call: (...args) => contractMethodCall({
        args,
        address,
        key: getMethodKey({ methodName, args }),
        method: contractInstance[methodName].call,
      }),
      // creates receipt for to invoke contract
      sendTransaction: (...args) => contractTxSend({
        args,
        methodName,
        key: getMethodKey({ methodName, args }),
        dest: address,
        estimateGas: estimateGas(...args),
        data: (
          !isForward(methodName, contractInstance)
            ? contractInstance[methodName].getData(...args)
            : ''
        ),
        privKey: getState().get('privKey'),
        callback: typeof last(args) === 'function' ? last(args) : undefined,
      }),
    }, dispatch);
    // base getter
    // reads cached contract method call from state
    const contractMethod = (...args) => (
      degrade(() => {
        const methodKey = getMethodKey({ methodName, args });
        return getState().getIn([address, 'methods', methodKey, 'value']);
      })
    );
    // calls contract method without changing state
    const callPromise = (...args) => new Promise((resolve, reject) => {
      contractInstance[methodName].call(...args, (err, value) => {
        if (err) {
          return reject(err);
        }
        return resolve(value);
      });
    });
    const estimateGas = (...args) => {
      const options = typeof last(args) === 'function' ? args[args.length - 2] : last(args);
      const isForwardCall = isForward(methodName, contractInstance);
      const data = !isForwardCall ? contractInstance[methodName].getData(...args) : '';
      const txArgs = isForwardCall ? args.slice(0, 3) : [address, options.value || new BigNumber(0), data];
      const proxy = proxyInstance(getState().get('proxy'));

      return promisifyWeb3Call(proxy.forward.estimateGas)(...txArgs, {
        from: getState().get('injected'),
      }).then((gas) => Math.round((gas * 1.1) / 1000) * 1000);
    };
    // add actions to base getter
    contractMethod.call = actions.call;
    contractMethod.sendTransaction = actions.sendTransaction;
    contractMethod.estimateGas = estimateGas;
    contractMethod.callPromise = callPromise;
    // // reduce with added actions
    return { ...o, [methodName]: contractMethod };
  }, {});
  // decorate
  api.address = address;
  api.allEvents = contractInstance.allEvents;
  return api;
}

export default function generateContractAPI({ getState, dispatch, web3 }) {
  const cache = {};
  return (abi) => {
    const api = {
      at(address) {
        if (!cache[address]) {
          cache[address] = generateContractInstanceApi({ abi, address, getState, dispatch });
          cache[address].web3 = web3;
        }
        return cache[address];
      },
    };
    return api;
  };
}
