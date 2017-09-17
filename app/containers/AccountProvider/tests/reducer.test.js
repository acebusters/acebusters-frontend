import { fromJS } from 'immutable';
import accountProviderReducer from '../reducer';
import { contractEvent } from '../actions';
const BigNumber = require('bignumber.js');

describe('account reducer tests', () => {
  it('should return the default state.', () => {
    expect(accountProviderReducer(undefined, {}).toJS()).toEqual({
      privKey: undefined,
      email: undefined,
      blocky: null,
      nickName: null,
      onSupportedNetwork: false,
      signerAddr: null,
      loggedIn: false,
      web3ReadyState: 0,
      web3ErrMsg: null,
      refs: null,
    });
  });

  it('should add tx on event', () => {
    expect(accountProviderReducer(
      fromJS({}),
      contractEvent({
        address: '0x7c08ca8bef208ac8be8cd03ad15fbef643dd355c',
        blockNumber: 582975,
        transactionHash: '0x67ed561b9e1842016fda612d1940135465968cd3de0ea7008e7240347fe80bc1',
      })
    )).toEqual(fromJS({
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
      fromJS({}),
      contractEvent({
        address: '0x7c08ca8bef208ac8be8cd03ad15fbef643dd355c',
        args: {
          from: '0x6b569b17c684db05cdef8ab738b4be700138f70a',
          to: '0xc2a695393b52facb207918424733a5a1b1e80a50',
          value: new BigNumber(1000000),
        },
        blockNumber: 582975,
        event: 'Transfer',
        transactionHash: '0x67ed561b9e1842016fda612d1940135465968cd3de0ea7008e7240347fe80bc1',
      })
    )).toEqual(fromJS({
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
