/**
 * Created by jzobro on 20170606
 */
// actions
export const ACTIONBAR_SET_TURN_COMPLETE = 'acebusters/ActionBar/SET_TURN_COMPLETE';
export const ACTIONBAR_SET_MODE = 'acebusters/ActionBar/SET_MODE';
export const ACTIONBAR_SET_BUTTON_ACTIVE = 'acebusters/ActionBar/SET_BUTTON_ACTIVE';
export const HANDLE_CLICK_BUTTON = 'acebusters/ActionBar/HANDLE_CLICK_BUTTON';
export const UPDATE = 'acebusters/ActionBar/UPDATE';

// constants
export const FOLD = 'fold';
export const CHECK = 'check';
export const CALL = 'call';
export const BET = 'bet';
export const ALL_IN = 'all-in';
// bet related
export const BET_SET = 'bet-set';

// actionBar
export function setActionBarTurnComplete(complete) {
  return {
    type: ACTIONBAR_SET_TURN_COMPLETE,
    complete,
  };
}

export function setActionBarButtonActive(whichBtn) {
  return {
    type: ACTIONBAR_SET_BUTTON_ACTIVE,
    whichBtn,
  };
}

export const handleClickButton = (type) => ({
  type: HANDLE_CLICK_BUTTON,
  buttonType: type,
});

export const updateActionBar = (payload) => ({
  type: UPDATE,
  payload,
});
