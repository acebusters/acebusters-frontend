/**
 * Created by helge on 26.01.17.
 */

import SagaTester from 'redux-saga-tester';


describe('Saga Tests', () => {
  const someInitialValue = 'SOME_INITIAL_VALUE';
  const someInitialState = { someKey: someInitialValue };

  it('should return falsy when its sb turn and i am not sb', () => {
    const sagaTester = new SagaTester({ initialState: someInitialState });
    console.log(sagaTester.getState());
    expect(sagaTester.getState()).toEqual(someInitialState);
  });

  it('should return the sb amount when i am sb and its my turn', () => {

  });

  it('should return the bb amount when i am bb and its my turn', () => {

  });

  it('should pay 0 receipt when not sb or bb', () => {

  });

  it('should not dispatch dealing action for SB when global error', () => {

  });

  it('should not dispatch dealing action for BB when global error', () => {

  });

  it('should dispatch NEXT_HAND action when completed is true', () => {

  });
});

