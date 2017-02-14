import {
  TRANSFER_TOGGLE,
  SIDEBAR_TOGGLE,
} from './constants';


export function transferToggle() {
  return { type: TRANSFER_TOGGLE };
}

export function sidebarToggle() {
  return { type: SIDEBAR_TOGGLE };
}
