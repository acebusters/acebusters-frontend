// constants
export const OVERVIEW = 'overview';
export const WALLET = 'wallet';
export const EXCHANGE = 'exchange';

// actions
export const SET_ACTIVE_TAB = 'acebusters/Dashboard/SET_ACTIVE_TAB';

export const setActiveTab = (whichTab) => ({
  type: SET_ACTIVE_TAB,
  whichTab,
});
