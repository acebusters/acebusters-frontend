/**
 * Created by jzobro on 20170606
 */
// const
export const ACTIONBAR_SET_ACTIVE = 'acebusters/ActionBar/SET_ACTIVE';
export const ACTIONBAR_SET_MODE = 'acebusters/ActionBar/SET_MODE';
export const ACTIONBAR_TOGGLE_VISIBLE = 'acebusters/ActionBar/TOGGLE_VISIBLE';
export const ACTIONBAR_SET_BET_SLIDER = 'acebusters/ActionBar/SET_BET_SLIDER';

// actions
export function setActionBarActive(active) {
  return {
    type: ACTIONBAR_SET_ACTIVE,
    active,
  };
}

export function setActionBarMode(mode) {
  return {
    type: ACTIONBAR_SET_MODE,
    mode,
  };
}

export function setActionBarBetSlider(sliderOpen) {
  return {
    type: ACTIONBAR_SET_BET_SLIDER,
    sliderOpen,
  };
}

export function toggleActionBarVisible() {
  return { type: ACTIONBAR_TOGGLE_VISIBLE };
}
