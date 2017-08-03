const identity = (a) => a;

/**
 * Composes given reducers into one
 *
 * @param {...Function} reducers
 * @returns {Function} composeReducers(a, b, c)(state, action) === a(b(c(state, action), action), action)
 */

export function composeReducers(...reducers) {
  if (reducers.length === 0) {
    return identity;
  }

  if (reducers.length === 1) {
    return reducers[0];
  }

  return reducers.reduce((a, b) => (state, action) => a(b(state, action), action));
}
