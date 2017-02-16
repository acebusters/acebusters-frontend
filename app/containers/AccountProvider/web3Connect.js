import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { web3MethodCall } from './actions';
import { SUPPORTED_WEB3_METHODS } from './constants';
import { selectAccount } from './selectors';
import { getWeb3 } from './sagas';
// import generateContractApi from './generateContractApi';

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

// returns the value of the gotten web3 method
function generateWeb3Getter({ state, methodName, groupName }) {
  if (methodName.indexOf('get') !== 0) {
    return null;
  }
  const getterFragment = methodName.split('get')[1];
  const getterName = `${getterFragment[0].toLowerCase()}${getterFragment.slice(1)}`;
  // TODO add other statuses (fetching, created, error, etc.)
  const getter = {
    [getterName]: (...args) => {
      if (getterName.indexOf('transaction') === 0) {
        return degrade(() => state.web3.transactions[args[0]].value);
      }
      return degrade(() => {
        const methodKey = getMethodKey({ groupName, methodName, args });
        return state.getIn(['methods', methodKey, 'value']);
      });
    },
  };
  return getter;
}

function generateWeb3ActionCreator({ groupName, methodName, dispatch }) {
  // use the defined action creator, or fallback to regular web3 method
  const web3 = getWeb3();
  const method = web3[groupName][methodName];
  const acOverride = SUPPORTED_WEB3_METHODS[groupName][methodName].actionCreator;
  const actionCreator = acOverride || web3MethodCall;
  return bindActionCreators({
    [methodName]: (...args) => actionCreator({ method, args, key: !acOverride && getMethodKey({ groupName, methodName, args }) }),
  }, dispatch);
}

function generateWeb3Methods(params) {
  return {
    ...generateWeb3Getter(params),
    ...generateWeb3ActionCreator(params),
  };
}

function generateNetworkApi(state, dispatch) {
  // reduce the supported api into action creators and getters
  const web3 = Object.keys(SUPPORTED_WEB3_METHODS).reduce((o, groupName) => ({
    ...o,
    [groupName]: Object.keys(SUPPORTED_WEB3_METHODS[groupName]).reduce((o2, methodName) => ({
      ...o2,
      ...generateWeb3Methods({ methodName, state, dispatch, groupName }),
    }),
    {}),
  }),
  {});
  // nice little helper function
  web3.eth.waitForMined = (tx, pollTime = 5 * 1000) => (
    new Promise((resolve, reject) => {
      function poll() {
        return web3.eth.getTransactionReceipt(tx).then((res) => {
          if (res) {
            resolve(res);
          } else {
            setTimeout(poll, pollTime);
          }
        }).catch(reject);
      }
      setTimeout(poll, 10); // timeout for testrpc
    })
  );
  // custom contract creation api
  // web3.eth.contract = generateContractApi({ web3, getState, dispatch, networkApi: networkApis[networkId] });

  return { web3 };
}

export default function web3Connect(passedMapStateToProps, passedActions) {
  // allow user to map custom map
  function mapStateToProps(state) {
    return { ...passedMapStateToProps(state), web3Redux: selectAccount(state).get('web3') };
  }

  function mapDispatchToProps(dispatch) {
    return { dispatch, ...bindActionCreators(passedActions, dispatch) };
  }

  function mergeProps(stateProps, dispatchProps, ownProps) {
    const { dispatch, ...customActions } = dispatchProps;
    return {
      ...stateProps,
      ...ownProps,
      ...customActions,
      web3Redux: generateNetworkApi(stateProps.web3Redux, dispatch),
    };
  }

  return connect(mapStateToProps, mapDispatchToProps, mergeProps);
}
