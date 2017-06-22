import { bindActionCreators } from 'redux';
import { contractMethodCall, contractTxSend } from './actions';
import { getWeb3 } from './sagas';
import { last } from '../../utils/last';

function degrade(fn, fallback) {
  try {
    return fn();
  } catch (e) {
    return fallback;
  }
}

function getMethodKey({ groupName, methodName, args }) {
  return `${groupName || ''}.${methodName}(${JSON.stringify(args)})`;
}

function generateContractInstanceApi({ abi, address, getState, dispatch }) {
  // cached version doesn't exist, create it
  const contractInstance = getWeb3().eth.contract(abi).at(address);
  // // reduce the abi into the redux methods
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
      // creates receipt for to invoke contract through account controller
      sendTransaction: (...args) => contractTxSend({
        args,
        methodName,
        key: getMethodKey({ methodName, args }),
        dest: address,
        data: contractInstance[methodName].getData(...args),
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
    // add actions to base getter
    contractMethod.call = actions.call;
    contractMethod.sendTransaction = actions.sendTransaction;
    contractMethod.callPromise = callPromise;
    // // reduce with added actions
    return { ...o, [methodName]: contractMethod };
  }, {});
  // decorate
  api.address = address;
  api.allEvents = contractInstance.allEvents;
  return api;
}

export default function generateContractAPI({ getState, dispatch }) {
  const cache = {};
  return (abi) => {
    const api = {
      at(address) {
        if (!cache[address]) {
          cache[address] = generateContractInstanceApi({ abi, address, getState, dispatch });
        }
        return cache[address];
      },
    };
    return api;
  };
}
