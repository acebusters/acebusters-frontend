/**
 * Created by helge on 24.01.17.
 */

const storageFallback = {};

export function setItem(key, value) {
  const item = JSON.stringify(value);
  if (window && window.localStorage) {
    window.localStorage.setItem(key, item);
  } else {
    storageFallback[key] = item;
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
  } else {
    const val = storageFallback[key];
    if (val) {
      try {
        return JSON.parse(val);
      } catch (err) {
        delete storageFallback[key];
        return err;
      }
    }
  }
  return undefined;
}

export function removeItem(key) {
  if (window && window.localStorage) {
    window.localStorage.removeItem(key);
  } else {
    delete storageFallback[key];
  }
}
