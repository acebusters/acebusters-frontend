export const SIDEBAR_TOGGLE = 'boilerplate/App/SIDEBAR_TOGGLE';
export const DEFAULT_LOCALE = 'en';
export const MODAL_ADD = 'acebusters/App/MODAL_ADD';
export const MODAL_DISMISS = 'acebusters/App/MODAL_DISMISS';

export function sidebarToggle() {
  return { type: SIDEBAR_TOGGLE };
}

export function modalAdd(node) {
  console.dir(node);
  return { type: MODAL_ADD, node };
}

export function modalDismiss() {
  return { type: MODAL_DISMISS };
}
