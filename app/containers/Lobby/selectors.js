/**
 * Created by helge on 08.02.17.
 */
import { createSelector } from 'reselect';

const selectLobby = (state) => state.get('lobby');

const makeSelectLobbyData = () => createSelector(
  selectLobby,
  (lobby) => lobby
);

export {
    makeSelectLobbyData,
};
