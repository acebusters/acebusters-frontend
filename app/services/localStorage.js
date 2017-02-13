/**
 * Created by helge on 24.01.17.
 */


export function setItem(key, value) {
  if (window && window.localStorage) {
    const item = JSON.stringify(value);
    window.localStorage.setItem(key, item);
  }
}

export function getItem(key) {
  if (window && window.localStorage) {
    const val = window.localStorage.getItem(key);
    if (val) {
      try {
        return JSON.parse(val);
      } catch (err) {
        window.localStorage.removeItem(key);
        return err;
      }
    }
  }
  return undefined;
}

export function removeItem(key) {
  if (window && window.localStorage) {
    window.localStorage.removeItem(key);
  }
}
