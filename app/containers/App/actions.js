export const DEFAULT_LOCALE = 'en';
export const MODAL_ADD = 'acebusters/App/MODAL_ADD';
export const MODAL_DISMISS = 'acebusters/App/MODAL_DISMISS';

export function modalAdd(node) {
  return { type: MODAL_ADD, node };
}

export function modalDismiss() {
  return { type: MODAL_DISMISS };
}
