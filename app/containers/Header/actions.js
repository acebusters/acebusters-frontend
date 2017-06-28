export const SET_COLLAPSED = 'acebusters/Header/SET_COLLAPSED';

export function setCollapsed(collapsed) {
  return {
    type: SET_COLLAPSED,
    collapsed,
  };
}
