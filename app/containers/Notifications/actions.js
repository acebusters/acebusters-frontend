export const NOTIFY_ADD = 'acebusters/Notify/ADD';
export const NOTIFY_DELETE = 'acebusters/Notify/DELETE';
export const NOTIFY_REMOVE = 'acebusters/Notify/REMOVE';
export const NOTIFY_REMOVING = 'acebusters/Notify/REMOVING';

export const notifyAdd = (notification) => ({
  type: NOTIFY_ADD,
  notification,
});

export const notifyDelete = (txId) => ({
  type: NOTIFY_DELETE,
  txId,
});

export const notifyRemove = (txId) => ({
  type: NOTIFY_REMOVE,
  txId,
});

export const notifyRemoving = (txId) => ({
  type: NOTIFY_REMOVING,
  txId,
});
