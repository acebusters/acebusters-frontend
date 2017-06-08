/**
 * Created by jzobro on 20170606
 */
export const MENU_TOGGLE_OPEN = 'acebusters/TableMenu/MENU_TOGGLE_OPEN';
export const MENU_TOGGLE_ACTIVE = 'acebusters/TableMenu/MENU_TOGGLE_ACTIVE';

export function toggleMenuOpen() {
  return { type: MENU_TOGGLE_OPEN };
}

export function toggleMenuActive() {
  return { type: MENU_TOGGLE_ACTIVE };
}
