import request from './fakeRequest';

// If we're testing, use a local storage polyfill
// If not, use the browser one
const localStorage = (global.process && process.env.NODE_ENV === 'test') ? require('localStorage') : global.window.localStorage;

const auth = {
  /**
  * Logs a user in, returning a promise with `true` when done
  * @param  {string} email The username of the user
  */
  login(email) {
    if (auth.loggedIn()) return Promise.resolve(true);

    // Post a fake request
    return request.post('/login', { email })
      .then((response) => {
        // Save wallet to local storage
        localStorage.wallet = response.wallet;
        return Promise.resolve(true);
      });
  },
  /**
  * Logs the current user out
  */
  logout() {
    return request.post('/logout');
  },
  /**
  * Checks if a user is logged in
  */
  loggedIn() {
    return !!localStorage.token;
  },
  /**
  * Registers a user and then logs them in
  * @param  {string} email The email of the user
  * @param  {object} wallet The exported wallet of the user
  */
  register(email, wallet) {
    // Post a fake request
    return request.post('/register', { email, wallet })
      // Log user in after registering
      .then(() => auth.login(email));
  },
  onChange() {},
};

export default auth;
