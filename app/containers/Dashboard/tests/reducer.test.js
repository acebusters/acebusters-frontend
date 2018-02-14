import { fromJS } from 'immutable';
import dashboardReducer from '../reducer';
import { contractEvent } from '../../AccountProvider/actions';
import { OVERVIEW } from '../constants';

describe('dashboard reducer tests', () => {
  it('should return the default state.', () => {
    expect(dashboardReducer(undefined, {}).toJS()).toEqual({
      activeTab: OVERVIEW,
      events: null,
      userAddr: null,
    });
  });

  it('should complete pending tx on matching event', () => {
    const state = dashboardReducer(
      fromJS({
        events: {
          '0x67ed561b9e1842016fda612d1940135465968cd3de0ea7008e7240347fe80bc1': {
            pending: true,
          },
        },
      }),
      contractEvent({
        event: 'Transfer',
        args: {},
        address: '0x7c08ca8bef208ac8be8cd03ad15fbef643dd355c',
        blockNumber: 582975,
        transactionHash: '0x67ed561b9e1842016fda612d1940135465968cd3de0ea7008e7240347fe80bc1',
      }),
    );

    expect(state.getIn(['events', '0x67ed561b9e1842016fda612d1940135465968cd3de0ea7008e7240347fe80bc1', 'pending']))
      .toEqual(undefined);

    const state2 = dashboardReducer(
      fromJS({
        events: {
          '0x67ed561b9e1842016fda612d1940135465968cd3de0ea7008e7240347fe80bc1': {
            pending: true,
          },
        },
      }),
      contractEvent({
        blockNumber: 582975,
        transactionHash: '0x67ed561b9e1842016fda612d1940135465968cd3de0ea7008e7240347fe80bc1',
      }),
    );

    expect(state2.getIn(['events', '0x67ed561b9e1842016fda612d1940135465968cd3de0ea7008e7240347fe80bc1']))
      .toEqual(undefined);
  });

  it('should get user address from action meta', () => {
    expect(dashboardReducer(
      fromJS({ events: null }),
      contractEvent({
        event: 'Received',
        address: '0x7c08ca8bef208ac8be8cd03ad15fbef643dd355c',
        blockNumber: 582975,
        transactionHash: '0x67ed561b9e1842016fda612d1940135465968cd3de0ea7008e7240347fe80bc1',
        args: {
          sender: '0x7caaca8bef208ac8be8cd03ad15fbef643dd355c',
          value: '10000000',
        },
      }, '0x7caaca8bef208ac8be8cd03ad15fbef643dd355c')
    ).get('userAddr')).toEqual('0x7caaca8bef208ac8be8cd03ad15fbef643dd355c');
  });

  it('should handle nutz contract transfer event', () => {
    expect(dashboardReducer(
      fromJS({
        events: null,
        userAddr: '0x7c08ca8bef208ac8be8cd03ad15fbef643dd355c',
      }),
      contractEvent({
        event: 'Transfer',
        address: '0x7c08ca8bef208ac8be8cd03ad15fbef643dd355c',
        blockNumber: 582975,
        transactionHash: '0x67ed561b9e1842016fda612d1940135465968cd3de0ea7008e7240347fe80bc1',
        args: {
          to: '0x7c08ca8bef208ac8be8cd03ad15fbef643dd355c',
          from: '0x7aa8ca8bef208ac8be8cd03ad15fbef643dd355c',
          value: '10000000',
        },
      })
    )).toEqual(fromJS({
      events: {
        '0x67ed561b9e1842016fda612d1940135465968cd3de0ea7008e7240347fe80bc1': {
          blockNumber: 582975,
          transactionHash: '0x67ed561b9e1842016fda612d1940135465968cd3de0ea7008e7240347fe80bc1',
          value: '10000000',
          timestamp: undefined,
          event: 'Transfer',
          address: '0x7aa8ca8bef208ac8be8cd03ad15fbef643dd355c',
          unit: 'ntz',
          type: 'income',
        },
      },
      userAddr: '0x7c08ca8bef208ac8be8cd03ad15fbef643dd355c',
    }));
  });
});
