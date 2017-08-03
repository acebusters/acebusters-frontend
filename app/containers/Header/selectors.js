import { createSelector } from 'reselect';

export const getHeaderCollapsed = () => createSelector(
  (state) => state.get('header'),
  (header) => header.get('collapsed'),
);
