import { createSelector } from 'reselect';
import sortBy from 'lodash/sortBy';

export const selectNotifications = () => createSelector(
  (state) => state.get('notifications'),
  (notifications) => sortBy(notifications.toJS(), ['dismissable', 'date']),
);
