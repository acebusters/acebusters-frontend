import { fromJS, is } from 'immutable';

import {
  ACCOUNT_LOADED,
  CONTRACT_EVENTS,
  PROXY_EVENTS,
  CONTRACT_TX_SENDED,
  CONTRACT_TX_ERROR,
} from '../AccountProvider/actions';

import { MODAL_DISMISS } from '../App/actions';

import {
  SET_ACTIVE_TAB,
  SET_AMOUNT_UNIT,
  SET_INVEST_TYPE,
  OVERVIEW,
  ETH,
  POWERUP,
} from './actions';

import { composeReducers } from '../../utils/composeReducers';

import { conf } from '../../app.config';
import { last } from '../../utils';

const confParams = conf();

/**
 * interface DashboardEvent {
 *   unit: 'eth' | 'ntz';
 *   value?: string;
 *   blockNumber?: number;
 *   address: string;
 *   type: 'income' | 'outcome';
 *   transactionHash: string;
 *   timestamp?: number;
 *   pending?: boolean;
 * }
 */
const initialState = fromJS({
  proxy: null,
  failedTx: null,
  events: null,
  activeTab: OVERVIEW,
  amountUnit: ETH,
  investType: POWERUP,
});

function formatTxErrorMessage(error) {
  if (typeof error === 'string' && error.indexOf('Error: MetaMask Tx Signature') > -1) {
    return 'Transaction denied';
  }

  return error;
}

function dashboardReducer(state = initialState, action) {
  const { payload, meta = {} } = action;

  switch (action.type) {
    case SET_ACTIVE_TAB:
      return state.set('activeTab', action.whichTab);

    case SET_AMOUNT_UNIT:
      return state.set('amountUnit', action.unit);

    case SET_INVEST_TYPE:
      return state.set('investType', action.which);

    case ACCOUNT_LOADED:
      return state.set('proxy', action.payload.proxy);

    case CONTRACT_TX_SENDED:
      return addPending(
        initEvents(state),
        payload
      );

    case CONTRACT_TX_ERROR:
      return state.set('failedTx', fromJS({
        ...payload,
        error: formatTxErrorMessage(payload.error),
      }));

    case MODAL_DISMISS:
      return state.set('failedTx', null);

    case PROXY_EVENTS:
      return payload.reduce(
        composeReducers(addProxyContractEvent, completePending),
        setProxy(initEvents(state), meta.proxy)
      );

    case CONTRACT_EVENTS:
      return payload.reduce(
        composeReducers(addNutzContractEvent, completePending),
        setProxy(initEvents(state), meta.proxy)
      );

    default:
      return state;
  }
}

export default dashboardReducer;

function initEvents(state) {
  if (state.get('events') === null) {
    return state.set('events', fromJS({}));
  }

  return state;
}

function setProxy(state, proxy) {
  if (proxy) {
    return state.set('proxy', proxy);
  }

  return state;
}

function completePending(state, event) {
  if (state.getIn(['events', event.transactionHash, 'pending'])) {
    return state.deleteIn(['events', event.transactionHash]);
  }

  return state;
}

function addPending(state, { methodName, args, txHash, address }) {
  if (address === confParams.pwrAddr) {
    return state;
  }

  if (methodName === 'forward' && args[2] === '') { // eth transfer
    const amount = args[1];
    return state.setIn(
      ['events', txHash],
      fromJS({
        address,
        value: amount.toString ? amount.toString() : amount,
        type: 'outcome',
        unit: 'eth',
        pending: true,
        transactionHash: txHash,
      }),
    );
  } else if (methodName === 'withdraw') {
    return state.setIn(
      ['events', txHash],
      fromJS({
        address: confParams.pullAddr,
        type: 'income',
        unit: 'eth',
        pending: true,
        transactionHash: txHash,
      }),
    );
  } else if (methodName === 'purchase') {
    const options = typeof last(args) === 'function' ? args[args.length - 2] : last(args);
    const amount = options.value;
    return state.setIn(
      ['events', txHash],
      fromJS({
        address,
        value: amount.toString ? amount.toString() : amount,
        type: 'outcome',
        unit: 'eth',
        pending: true,
        transactionHash: txHash,
      }),
    );
  } else if (methodName === 'powerUp') {
    return state.setIn(
      ['events', txHash],
      fromJS({
        address: conf().pwrAddr,
        value: args[0].toString ? args[0].toString() : args[0],
        type: 'outcome',
        unit: 'ntz',
        pending: true,
        transactionHash: txHash,
      }),
    );
  } else if (methodName === 'sell') {
    return state.setIn(
      ['events', txHash],
      fromJS({
        address: confParams.ntzAddr,
        value: args[1].toString ? args[1].toString() : args[1],
        type: 'outcome',
        unit: 'ntz',
        pending: true,
        transactionHash: txHash,
      }),
    );
  }

  return state;
}

function hasConflict(state, newEvent) {
  const event = state.getIn(['events', newEvent.get('transactionHash')]);
  return event && !is(event, newEvent);
}

function addProxyContractEvent(state, event) {
  const isDeposit = event.event === 'Deposit';
  const dashboardEvent = makeDashboardEvent(event, {
    address: isDeposit ? event.args.sender : event.args.to,
    unit: 'eth',
    type: isDeposit ? 'income' : 'outcome',
  });
  const path = hasConflict(state, dashboardEvent) ? ['events', `${event.transactionHash}-${event.event}`] : ['events', event.transactionHash];

  return state.setIn(path, dashboardEvent);
}

function transformNutzContractEvent(state, event) {
  if (event.event === 'Transfer') {
    const isIncome = event.args.to === state.get('proxy');

    if (event.address === conf().pwrAddr) {
      if (isIncome) { // power up
        return makeDashboardEvent(event, {
          address: conf().pwrAddr,
          unit: 'abp',
          type: 'income',
        });
      }

      return null;
    }

    return makeDashboardEvent(event, {
      address: isIncome ? event.args.from : event.args.to,
      unit: 'ntz',
      type: isIncome ? 'income' : 'outcome',
    });
  } else if (event.event === 'Sell') {
    return makeDashboardEvent(event, {
      address: confParams.ntzAddr,
      unit: 'ntz',
      type: 'outcome',
    });
  } else if (event.event === 'Purchase') {
    return makeDashboardEvent(event, {
      address: event.args.purchaser,
      unit: 'ntz',
      type: 'income',
    });
  }

  return null;
}

function addNutzContractEvent(state, event) {
  const dashboardEvent = transformNutzContractEvent(state, event);

  if (dashboardEvent) {
    const path = hasConflict(state, dashboardEvent) ? ['events', `${event.transactionHash}-${event.event}`] : ['events', event.transactionHash];
    return state.setIn(path, dashboardEvent);
  }

  return state;
}

function makeDashboardEvent(event, fields) {
  return fromJS({
    blockNumber: event.blockNumber,
    transactionHash: event.transactionHash,
    value: event.args.value,
    timestamp: event.timestamp,
    ...fields,
  });
}
