/**
 * Created by helge on 24.01.17.
 */


export function setItem(key, value) {
  if (!localStorage) { return; }
  const item = JSON.stringify(value);
  localStorage.setItem(key, item);
}

export function getItem(key) {
  if (!localStorage) {
    return {};
  }
  const item = JSON.parse(localStorage.getItem(key));
  return item;
}

