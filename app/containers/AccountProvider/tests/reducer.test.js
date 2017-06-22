import { fromJS } from 'immutable';
import accountProviderReducer from '../reducer';
import { CONTRACT_EVENT } from '../actions';
const BigNumber = require('bignumber.js');

describe('account reducer tests', () => {
  it('should return the default state.', () => {
    expect(accountProviderReducer(undefined, {}).toJS()).toEqual({
      privKey: undefined,
      email: undefined,
      blocky: null,
      nickName: null,
      signerAddr: null,
      loggedIn: false,
      web3ReadyState: 0,
      web3ErrMsg: null,
      pending: {},
      pendingSell: [],
    });
  });

  it('should complete pending tx on matching event', () => {
    expect(accountProviderReducer(
      fromJS({
        pending: {
          1: { txHash: '0x67ed561b9e1842016fda612d1940135465968cd3de0ea7008e7240347fe80bc1' },
          2: { txHash: '0x51fda47ac9113cdd7068e9bb7dec55cb170d1ca694afd442f77a56add4b3c86b' },
        },
      }),
      {
        type: CONTRACT_EVENT,
        event: {
          address: '0x7c08ca8bef208ac8be8cd03ad15fbef643dd355c',
          blockNumber: 582975,
          transactionHash: '0x67ed561b9e1842016fda612d1940135465968cd3de0ea7008e7240347fe80bc1',
        },
      }
    )).toEqual(fromJS({
      pending: {
        2: { txHash: '0x51fda47ac9113cdd7068e9bb7dec55cb170d1ca694afd442f77a56add4b3c86b' },
      },
      '0x7c08ca8bef208ac8be8cd03ad15fbef643dd355c': {
        transactions: {
          '0x67ed561b9e1842016fda612d1940135465968cd3de0ea7008e7240347fe80bc1': {
            blockNumber: 582975,
          },
        },
      },
    }));
  });

  it('should handle tx that was not pending', () => {
    expect(accountProviderReducer(
      fromJS({
        pending: {
          2: { txHash: '0x51fda47ac9113cdd7068e9bb7dec55cb170d1ca694afd442f77a56add4b3c86b' },
        },
      }),
      {
        type: CONTRACT_EVENT,
        event: {
          address: '0x7c08ca8bef208ac8be8cd03ad15fbef643dd355c',
          blockNumber: 582975,
          transactionHash: '0x67ed561b9e1842016fda612d1940135465968cd3de0ea7008e7240347fe80bc1',
        },
      }
    )).toEqual(fromJS({
      pending: {
        2: { txHash: '0x51fda47ac9113cdd7068e9bb7dec55cb170d1ca694afd442f77a56add4b3c86b' },
      },
      '0x7c08ca8bef208ac8be8cd03ad15fbef643dd355c': {
        transactions: {
          '0x67ed561b9e1842016fda612d1940135465968cd3de0ea7008e7240347fe80bc1': {
            blockNumber: 582975,
          },
        },
      },
    }));
  });

  it('should handle Transfer Event', () => {
    expect(accountProviderReducer(
      fromJS({
        pending: {
          2: { txHash: '0x67ed561b9e1842016fda612d1940135465968cd3de0ea7008e7240347fe80bc1' },
        },
      }),
      {
        type: CONTRACT_EVENT,
        event: {
          address: '0x7c08ca8bef208ac8be8cd03ad15fbef643dd355c',
          args: {
            from: '0x6b569b17c684db05cdef8ab738b4be700138f70a',
            to: '0xc2a695393b52facb207918424733a5a1b1e80a50',
            value: new BigNumber(1000000),
          },
          blockNumber: 582975,
          event: 'Transfer',
          transactionHash: '0x67ed561b9e1842016fda612d1940135465968cd3de0ea7008e7240347fe80bc1',
        },
      }
    )).toEqual(fromJS({
      pending: {},
      '0x7c08ca8bef208ac8be8cd03ad15fbef643dd355c': {
        transactions: {
          '0x67ed561b9e1842016fda612d1940135465968cd3de0ea7008e7240347fe80bc1': {
            blockNumber: 582975,
            from: '0x6b569b17c684db05cdef8ab738b4be700138f70a',
            to: '0xc2a695393b52facb207918424733a5a1b1e80a50',
            value: '1000000',
          },
        },
      },
    }));
  });
});
