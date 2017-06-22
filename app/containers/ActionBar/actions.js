/**
 * Created by jzobro on 20170606
 */
// const
export const ACTIONBAR_SET_TURN_COMPLETE = 'acebusters/ActionBar/SET_TURN_COMPLETE';
export const ACTIONBAR_SET_MODE = 'acebusters/ActionBar/SET_MODE';
export const ACTIONBAR_SET_BET_SLIDER = 'acebusters/ActionBar/SET_BET_SLIDER';
export const ACTIONBAR_SET_BUTTON_ACTIVE = 'acebusters/ActionBar/SET_BUTTON_ACTIVE';

// actionBar
export function setActionBarTurnComplete(complete) {
  return {
    type: ACTIONBAR_SET_TURN_COMPLETE,
    complete,
  };
}

export function setActionBarMode(mode) {
  return {
    type: ACTIONBAR_SET_MODE,
    mode,
  };
}

export function setActionBarButtonActive(whichBtn) {
  return {
    type: ACTIONBAR_SET_BUTTON_ACTIVE,
    whichBtn,
  };
}

// slider
export function setActionBarBetSlider(sliderOpen) {
  return {
    type: ACTIONBAR_SET_BET_SLIDER,
    sliderOpen,
  };
}
