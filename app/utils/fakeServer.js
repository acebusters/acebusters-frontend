
let users;
// If we're testing, use a local storage polyfill
// If not, use the browser one
const localStorage = (global.process && process.env.NODE_ENV === 'test') ? require('localStorage') : global.window.localStorage;

const server = {
  /**
  * Populates the users, similar to seeding a database in the real world
  */
  init() {
    if (localStorage.users === undefined) {
      // Set default user
      const user = 'johannbarbie@me.com';
      const wallet = {
        address: '0x0735a7a806ac6fffe26318f83102d50675c95dfa',
        Crypto: {
          cipher: 'aes-128-ctr',
          cipherparams: {
            iv: '5784b4a88be20fd573c53394430efca3',
          },
          ciphertext: '44041ee0a07bf1a16f56ea8003ef3a6866a8e988971e43054f9c2ecfe2a6fb0b',
          kdf: 'scrypt',
          kdfparams: {
            dklen: 32,
            n: 65536,
            r: 1,
            p: 8,
            salt: '0aef851300d3ce8081d11a3f7004a7d11e4792a012c6afd22511f860aaf2a9b3',
          },
          mac: 'bfd0ff9e753e00b778b8044a13d0592c514c4171f5c43b40857e882c54e26ace',
        },
        version: 3,
      };

      users = {
        [user]: wallet,
      };

      localStorage.users = JSON.stringify(users);
    } else {
      users = JSON.parse(localStorage.users);
    }
  },
 /**
 * Pretends to log a user in
 *
 * @param  {string} email The email of the user
 */
  login(email) {
    const userExists = this.doesUserExist(email);

    return new Promise((resolve, reject) => {
      // If the user exists, resolve
      if (userExists) {
        resolve({
          authenticated: true,
          wallet: users[email],
        });
      } else {
        reject('User doesn\'t exist');
      }
    });
  },

 /**
 * Pretends to register a user
 *
 * @param  {string} email The email of the user
 * @param  {string} wallet The encrypted wallet of the user
 */
  register(email, wallet) {
    return new Promise((resolve, reject) => {
      // If the email isn't used, store the wallet in localStorage
      if (!this.doesUserExist(email)) {
        users[email] = wallet;
        localStorage.users = JSON.stringify(users);

        // Resolve when done
        resolve({ registered: true });
      } else {
        // Reject with appropiate error
        reject(new Error('Username already in use'));
      }
    });
  },
 /**
 * Pretends to log a user out and resolves
 */
  logout() {
    return new Promise((resolve) => {
      resolve(true);
    });
  },
 /**
 * Checks if a username exists in the db
 * @param  {string} username The username that should be checked
 */
  doesUserExist(username) {
    return !(users[username] === undefined);
  },
};

server.init();

export default server;
