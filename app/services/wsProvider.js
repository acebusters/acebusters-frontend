/*
 This file is part of web3.js.

 web3.js is free software: you can redistribute it and/or modify
 it under the terms of the GNU Lesser General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 web3.js is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Lesser General Public License for more details.

 You should have received a copy of the GNU Lesser General Public License
 along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
 */
/** @file WebsocketProvider.js
 * @authors:
 *   Fabian Vogelsteller <fabian@ethdev.com>
 * @date 2015
 */


const isFunction = require('lodash/isFunction');
const errors = require('./errors');
const WebSocket = require('websocket').w3cwebsocket;

const WebsocketProvider = function WebsocketProvider(path) {
  const self = this;
  this.responseCallbacks = {};
  this.notificationCallbacks = [];
  this.path = path;
  this.connection = new WebSocket(path);


  this.addDefaultEvents();


    // LISTEN FOR CONNECTION RESPONSES
  this.connection.onmessage = function onmessage(e) {
        /* jshint maxcomplexity: 6 */
    const data = (typeof e.data === 'string') ? e.data : '';

    self.parseResponse(data).forEach((result) => {
      let id = null;

            // get the id which matches the returned id
      if (Array.isArray(result)) {
        result.forEach((load) => {
          if (self.responseCallbacks[load.id]) {
            id = load.id;
          }
        });
      } else {
        id = result.id;
      }

            // notification
      if (!id && result.method.indexOf('_subscription') !== -1) {
        self.notificationCallbacks.forEach((callback) => {
          if (isFunction(callback)) { callback(null, result); }
        });

                // fire the callback
      } else if (self.responseCallbacks[id]) {
        self.responseCallbacks[id](null, result);
        delete self.responseCallbacks[id];
      }
    });
  };
};

/**
 Will add the error and end event to timeout existing calls

 @method addDefaultEvents
 */
WebsocketProvider.prototype.addDefaultEvents = function addDefaultEvents() {
  this.connection.onerror = this.defaultOnError.bind(this);
  this.connection.onclose = this.defaultOnClose.bind(this);
    // this.connection.on('timeout', function(){
    //     self.timeout();
    // });
};

WebsocketProvider.prototype.defaultOnError = function defaultOnError() {
  this.timeout();
};

WebsocketProvider.prototype.defaultOnClose = function defaultOnClose(e) {
  this.timeout();

  const noteCb = this.notificationCallbacks;
  // reset all requests and callbacks
  this.reset();

  // cancel subscriptions
  noteCb.forEach((callback) => {
    if (isFunction(callback)) {
      callback(e);
    }
  });
};

/**
 Will parse the response and make an array out of it.

 @method parseResponse
 @param {String} data
 */
WebsocketProvider.prototype.parseResponse = function parseResponse(dataChunked) {
  const self = this;
  const returnValues = [];

    // DE-CHUNKER
  const dechunkedData = dataChunked
        .replace(/\}[\n\r]?\{/g, '}|--|{') // }{
        .replace(/\}][\n\r]?\[\{/g, '}]|--|[{') // }][{
        .replace(/\}[\n\r]?\[\{/g, '}|--|[{') // }[{
        .replace(/\}][\n\r]?\{/g, '}]|--|{') // }]{
        .split('|--|');

  dechunkedData.forEach((dataParam) => {
    let data = dataParam;
    // prepend the last chunk
    if (self.lastChunk) {
      data = self.lastChunk + data;
    }

    let result = null;

    try {
      result = JSON.parse(data);
    } catch (e) {
      self.lastChunk = data;

            // start timeout to cancel all requests
      clearTimeout(self.lastChunkTimeout);
      self.lastChunkTimeout = setTimeout(() => {
        self.timeout();
        throw errors.InvalidResponse(data);
      }, 1000 * 15);

      return;
    }

        // cancel timeout and set chunk to null
    clearTimeout(self.lastChunkTimeout);
    self.lastChunk = null;

    if (result) {
      returnValues.push(result);
    }
  });

  return returnValues;
};


/**
 Get the adds a callback to the responseCallbacks object,
 which will be called if a response matching the response Id will arrive.

 @method addResponseCallback
 */
WebsocketProvider.prototype.addResponseCallback = function addResponseCallback(payload, callback) {
  if (!callback) return;

  const id = payload.id || payload[0].id;
  const method = payload.method || payload[0].method;

  this.responseCallbacks[id] = callback;
  this.responseCallbacks[id].method = method;
};

/**
 Timeout all requests when the end/error event is fired

 @method timeout
 */
WebsocketProvider.prototype.timeout = function timeout() {
  Object.keys(this.responseCallbacks).forEach((key) => {
    this.responseCallbacks[key](errors.InvalidConnection('on IPC'));
    delete this.responseCallbacks[key];
  });
};

WebsocketProvider.prototype.send = function send(payload, callback) {
  return this.sendAsync(payload, callback);
};

WebsocketProvider.prototype.sendAsync = function sendAsync(payload, callback) {
    // try reconnect, when connection is gone
    // if(!this.connection.writable)
    //     this.connection.connect({path: this.path});

  this.waitForConnection(200).then(() => {
    this.connection.send(JSON.stringify(payload));
    this.addResponseCallback(payload, callback);
  });
};

WebsocketProvider.prototype.waitForConnection = function waitForConnection(duration) {
  if (!this.connectionPromise) {
    this.connectionPromise = new Promise((resolve) => {
      if (this.connection.readyState === 1) {
        resolve();
        this.connectionPromise = null;
      } else {
        const interval = setInterval(() => {
          if (this.connection.readyState === 1) {
            clearInterval(interval);
            resolve();
            this.connectionPromise = null;
          }
        }, duration);
      }
    });
  }

  return this.connectionPromise;
};

/**
 Subscribes to provider events.provider

 @method on
 @param {String} type    'notifcation', 'connect', 'error', 'end' or 'data'
 @param {Function} callback   the callback to call
 */
WebsocketProvider.prototype.on = function on(type, callback) {
  if (typeof callback !== 'function') {
    throw new Error('The second parameter callback must be a function.');
  }

  switch (type) {
    case 'notification':
      this.notificationCallbacks.push(callback);
      break;

    case 'connect':
      this.connection.onopen = callback;
      break;

    case 'close':
      this.connection.onclose = (e) => {
        callback(e);
        this.defaultOnClose(e);
      };
      break;

    case 'error':
      this.connection.onerror = (e) => {
        callback(e);
        this.defaultOnError(e);
      };
      break;

    default:
      this.connection.on(type, callback);
      break;
  }
};

// TODO add once

/**
 Removes event listener

 @method removeListener
 @param {String} type    'notifcation', 'connect', 'error', 'end' or 'data'
 @param {Function} callback   the callback to call
 */
WebsocketProvider.prototype.removeListener = function removeListener(type, callback) {
  const self = this;

  switch (type) {
    case 'notification':
      this.notificationCallbacks.forEach((cb, index) => {
        if (cb === callback) {
          self.notificationCallbacks.splice(index, 1);
        }
      });
      break;

        // TODO remvoving connect missing

    default:
      this.connection.removeListener(type, callback);
      break;
  }
};

/**
 Removes all event listeners

 @method removeAllListeners
 @param {String} type    'notifcation', 'connect', 'error', 'end' or 'data'
 */
WebsocketProvider.prototype.removeAllListeners = function removeAllListeners(type) {
  switch (type) {
    case 'notification':
      this.notificationCallbacks = [];
      break;

        // TODO remvoving connect properly missing

    case 'connect':
      this.connection.onopen = null;
      break;

    case 'end':
      this.connection.onclose = null;
      break;

    case 'error':
      this.connection.onerror = null;
      break;

    default:
            // this.connection.removeAllListeners(type);
      break;
  }
};

/**
 Resets the providers, clears all callbacks

 @method reset
 */
WebsocketProvider.prototype.reset = function reset() {
  this.timeout();
  this.notificationCallbacks = [];

    // this.connection.removeAllListeners('error');
    // this.connection.removeAllListeners('end');
    // this.connection.removeAllListeners('timeout');

  this.addDefaultEvents();
};

module.exports = WebsocketProvider;
