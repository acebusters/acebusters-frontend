import * as storageService from './localStorage';

const storageKey = 'exp';
let storage = {};
let loaded = false;

function check() {
  const now = Date.now();
  const keys = Object.keys(storage);
  for (let i = 0, il = keys.length; i < il; i += 1) {
    const key = keys[i];
    const value = storage[key];
    if (value.exp <= now) {
      delete storage[key];
    }
  }
}

function firstCall() {
  if (loaded) {
    return;
  }

  loaded = true;
  Object.assign(storage, storageService.getItem(storageKey));
  check();
}

export function setItem(key, value, seconds) {
  firstCall();
  storage[key] = { value, exp: Date.now() + (seconds * 1000) };
  check();
  storageService.setItem(storageKey, storage);
}

export function getItem(key) {
  firstCall();
  check();
  return storage[key] ? storage[key].value : undefined;
}

export function removeItem(key) {
  firstCall();
  check();
  delete storage[key];
  storageService.setItem(storageKey, storage);
}

export function clearExpiringStorage() {
  loaded = false;
  storage = {};
  storageService.removeItem(storageKey);
}
