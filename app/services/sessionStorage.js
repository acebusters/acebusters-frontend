const storageFallback = {};

export function setItem(key, value) {
  const item = JSON.stringify(value);
  if (window && window.sessionStorage) {
    window.sessionStorage.setItem(key, item);
  } else {
    storageFallback[key] = item;
  }
}

export function getItem(key) {
  if (window && window.sessionStorage) {
    const val = window.sessionStorage.getItem(key);
    if (val) {
      try {
        return JSON.parse(val);
      } catch (err) {
        window.sessionStorage.removeItem(key);
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
  if (window && window.sessionStorage) {
    window.sessionStorage.removeItem(key);
  } else {
    delete storageFallback[key];
  }
}
