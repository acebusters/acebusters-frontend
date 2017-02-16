import { bindActionCreators } from 'redux';
import { contractMethodCall, contractTransactionCreate } from './actions';
import { getWeb3 } from './sagas';

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
    // // buid the actions
    const actions = bindActionCreators({
      call: (...args) => contractMethodCall({
        args, address, key: getMethodKey({ methodName, args }), method: contractInstance[methodName].call,
      }),
      sendTransaction: (...args) => contractTransactionCreate({
        args, address, key: getMethodKey({ methodName, args }), method: contractInstance[methodName].sendTransaction,
      }),
    }, dispatch);
    // base getter
    const contractMethod = (...args) => (
      degrade(() => {
        const methodKey = getMethodKey({ methodName, args });
        return getState().getIn([address, methodKey, 'value']);
      })
    );
    // add actions to base getter
    contractMethod.call = actions.call;
    contractMethod.sendTransaction = actions.sendTransaction;
    // // reduce with added actions
    return { ...o, [methodName]: contractMethod };
  }, {});
  // decorate
  api.address = address;
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
