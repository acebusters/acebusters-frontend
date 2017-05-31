export function setItem(key, value) {
  if (window && window.sessionStorage) {
    const item = JSON.stringify(value);
    window.sessionStorage.setItem(key, item);
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
  }
  return undefined;
}

export function removeItem(key) {
  if (window && window.sessionStorage) {
    window.sessionStorage.removeItem(key);
  }
}
