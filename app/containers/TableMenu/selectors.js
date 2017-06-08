import { createSelector } from 'reselect';

/**
 * Direct selector to the state domain
 */
const selectTableMenu = (state) => state.get('tableMenu');

/**
 * Other specific selectors
 */
export const makeSelectOpen = () => createSelector(
  selectTableMenu,
  (tableMenu) => tableMenu.get('open'),
);

export const makeSelectActive = () => createSelector(
  selectTableMenu,
  (tableMenu) => tableMenu.get('active'),
);
