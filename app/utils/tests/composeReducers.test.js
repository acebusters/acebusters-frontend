import { composeReducers } from '../composeReducers';

describe('composeReducers', () => {
  it('should return identity function when calling without args', () => {
    expect(composeReducers()(1)).toEqual(1);
    expect(composeReducers()('String')).toEqual('String');
  });

  it('should return first argument if called with only one argument', () => {
    const add = (a, b) => a + b;
    const mul = (a, b) => a * b;
    expect(composeReducers(add)(1, 2)).toEqual(3);
    expect(composeReducers(add)(5, 2)).toEqual(7);
    expect(composeReducers(mul)(1, 2)).toEqual(2);
    expect(composeReducers(mul)(2, 2)).toEqual(4);
  });

  it('should return new reducer that composes passed reducers and call it from right to left', () => {
    const add = (a, b) => a + b;
    const mul = (a, b) => a * b;
    expect(composeReducers(add, mul)(1, 2)).toEqual(4);
    expect(composeReducers(mul, add)(1, 2)).toEqual(6);
    expect(composeReducers(mul, mul)(1, 2)).toEqual(4);
    expect(composeReducers(add, add)(1, 2)).toEqual(5);
  });
});
