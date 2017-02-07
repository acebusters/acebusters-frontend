const Web3 = require('web3');
const wallet = require('eth-lightwallet');
const ZeroClientProvider = require('web3-provider-engine/dist/ZeroClientProvider');


const pwDerivedKey = new Uint8Array([215, 152, 86, 175, 5, 168, 43, 177, 135, 97, 218, 89, 136, 5, 110, 93, 193, 114, 94, 197, 247, 212, 127, 83, 200, 150, 255, 124, 17, 245, 91, 10]);
const tokenAbi = [{ constant: false, inputs: [{ name: '_spender', type: 'address' }, { name: '_value', type: 'uint256' }], name: 'approve', outputs: [{ name: 'success', type: 'bool' }], payable: false, type: 'function' }, { constant: true, inputs: [], name: 'totalSupply', outputs: [{ name: '', type: 'uint256' }], payable: false, type: 'function' }, { constant: false, inputs: [{ name: '_value', type: 'uint256' }], name: 'revoke', outputs: [{ name: 'success', type: 'bool' }], payable: false, type: 'function' }, { constant: false, inputs: [{ name: '_from', type: 'address' }, { name: '_to', type: 'address' }, { name: '_value', type: 'uint256' }], name: 'transferFrom', outputs: [{ name: 'success', type: 'bool' }], payable: false, type: 'function' }, { constant: true, inputs: [{ name: '_holder', type: 'address' }], name: 'balanceOf', outputs: [{ name: 'balance', type: 'uint256' }], payable: false, type: 'function' }, { constant: true, inputs: [], name: 'owner', outputs: [{ name: '', type: 'address' }], payable: false, type: 'function' }, { constant: false, inputs: [{ name: '_newOwner', type: 'address' }], name: 'changeOwner', outputs: [{ name: 'success', type: 'bool' }], payable: false, type: 'function' }, { constant: false, inputs: [{ name: '_to', type: 'address' }, { name: '_value', type: 'uint256' }], name: 'transfer', outputs: [{ name: 'success', type: 'bool' }], payable: false, type: 'function' }, { constant: true, inputs: [], name: 'baseUnit', outputs: [{ name: '', type: 'uint96' }], payable: false, type: 'function' }, { constant: false, inputs: [{ name: '_value', type: 'uint256' }], name: 'issue', outputs: [{ name: 'success', type: 'bool' }], payable: false, type: 'function' }, { constant: true, inputs: [{ name: '_holder', type: 'address' }, { name: '_spender', type: 'address' }], name: 'allowance', outputs: [{ name: 'remaining', type: 'uint256' }], payable: false, type: 'function' }, { inputs: [{ name: '_owner', type: 'address' }, { name: '_baseUnit', type: 'uint96' }], type: 'constructor' }, { anonymous: false, inputs: [{ indexed: true, name: 'from', type: 'address' }, { indexed: true, name: 'to', type: 'address' }, { indexed: false, name: 'value', type: 'uint256' }], name: 'Transfer', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, name: 'to', type: 'address' }, { indexed: false, name: 'value', type: 'uint256' }], name: 'Issuance', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, name: 'from', type: 'address' }, { indexed: false, name: 'value', type: 'uint256' }], name: 'Revoke', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, name: 'owner', type: 'address' }, { indexed: true, name: 'spender', type: 'address' }, { indexed: false, name: 'value', type: 'uint256' }], name: 'Approval', type: 'event' }, { anonymous: false, inputs: [{ indexed: false, name: 'sender', type: 'address' }, { indexed: false, name: 'code', type: 'uint256' }], name: 'Error', type: 'event' }];
const tableAbi = [{ constant: false, inputs: [{ name: '_leaveReceipt', type: 'bytes' }], name: 'leave', outputs: [{ name: '', type: 'address' }], payable: false, type: 'function' }, { constant: true, inputs: [{ name: '_handId', type: 'uint256' }, { name: '_addr', type: 'address' }], name: 'getOut', outputs: [{ name: '', type: 'uint96' }, { name: '', type: 'uint256' }], payable: false, type: 'function' }, { constant: true, inputs: [{ name: '', type: 'uint256' }], name: 'seats', outputs: [{ name: 'addr', type: 'address' }, { name: 'amount', type: 'uint96' }, { name: 'lastHand', type: 'uint256' }, { name: 'conn', type: 'bytes32' }], payable: false, type: 'function' }, { constant: true, inputs: [], name: 'lastNettingRequestTime', outputs: [{ name: '', type: 'uint256' }], payable: false, type: 'function' }, { constant: true, inputs: [], name: 'lastHandNetted', outputs: [{ name: '', type: 'uint256' }], payable: false, type: 'function' }, { constant: false, inputs: [{ name: '_newBalances', type: 'bytes' }, { name: '_sigs', type: 'bytes' }], name: 'settle', outputs: [{ name: '', type: 'bool' }], payable: false, type: 'function' }, { constant: false, inputs: [], name: 'payout', outputs: [], payable: false, type: 'function' }, { constant: true, inputs: [], name: 'oracle', outputs: [{ name: '', type: 'address' }], payable: false, type: 'function' }, { constant: false, inputs: [{ name: '_buyIn', type: 'uint96' }, { name: '_conn', type: 'bytes32' }], name: 'join', outputs: [], payable: false, type: 'function' }, { constant: true, inputs: [{ name: '_handId', type: 'uint256' }, { name: '_addr', type: 'address' }], name: 'getIn', outputs: [{ name: '', type: 'uint96' }], payable: false, type: 'function' }, { constant: true, inputs: [], name: 'getLineup', outputs: [{ name: '', type: 'uint256' }, { name: 'addr', type: 'address[]' }, { name: 'amount', type: 'uint256[]' }, { name: 'lastHand', type: 'uint256[]' }], payable: false, type: 'function' }, { constant: false, inputs: [{ name: '_bets', type: 'bytes' }, { name: '_sigs', type: 'bytes' }], name: 'submitBets', outputs: [{ name: '', type: 'uint256' }], payable: false, type: 'function' }, { constant: true, inputs: [], name: 'lastNettingRequestHandId', outputs: [{ name: '', type: 'uint256' }], payable: false, type: 'function' }, { constant: true, inputs: [], name: 'smallBlind', outputs: [{ name: '', type: 'uint256' }], payable: false, type: 'function' }, { constant: false, inputs: [{ name: '_now', type: 'uint256' }], name: 'net', outputs: [], payable: false, type: 'function' }, { constant: false, inputs: [{ name: '_dists', type: 'bytes' }, { name: '_sigs', type: 'bytes' }], name: 'submitDists', outputs: [{ name: '', type: 'uint256' }], payable: false, type: 'function' }, { inputs: [{ name: '_token', type: 'address' }, { name: '_oracle', type: 'address' }, { name: '_smallBlind', type: 'uint256' }, { name: '_seats', type: 'uint256' }], type: 'constructor' }, { anonymous: false, inputs: [{ indexed: false, name: 'addr', type: 'address' }, { indexed: false, name: 'conn', type: 'bytes32' }, { indexed: false, name: 'amount', type: 'uint256' }], name: 'Join', type: 'event' }, { anonymous: false, inputs: [{ indexed: false, name: 'hand', type: 'uint256' }], name: 'NettingRequest', type: 'event' }, { anonymous: false, inputs: [{ indexed: false, name: 'hand', type: 'uint256' }], name: 'Netted', type: 'event' }];

function Provider(rpcUrl, secret) {
  let ks;
  let privKey;
  let encPrivKey;
  let addr;
  if (secret) {
    if (secret && secret.length > 70) {
      ks = new wallet.keystore(secret, pwDerivedKey); // eslint-disable-line
      ks.generateNewAddress(pwDerivedKey, 1);
    } else if (secret) {
      ks = new wallet.keystore(); // eslint-disable-line
      ks.addPriv = (privkeyHex) => {
        privKey = new Buffer(privkeyHex.replace('0x', ''), 'hex');
        encPrivKey = wallet.keystore._encryptKey(privKey, pwDerivedKey); // eslint-disable-line
        const address = wallet.keystore._computeAddressFromPrivKey(privKey); // eslint-disable-line
        this.ksData["m/0'/0'/0'"].encPrivKeys[address] = encPrivKey;
        this.ksData["m/0'/0'/0'"].addresses.push(address);
      };
      ks.isDerivedKeyCorrect = (pwDerivedKey) => { // eslint-disable-line
        if (!this.encSeed) {
          return true;
        }
        const paddedSeed = KeyStore._decryptString(this.encSeed, pwDerivedKey); // eslint-disable-line
        if (paddedSeed.length > 0) {
          return true;
        }
        return false;
      };
      ks.addPriv(secret);
    }

    addr = `0x${ks.getAddresses()[0]}`;
  }

  const approveTransaction = (txParams, cb) => {
    cb(null, true);
  };

  const signTransaction = (txData, cb) => {
    txData.gasPrice = parseInt(txData.gasPrice, 16); // eslint-disable-line
    txData.nonce = parseInt(txData.nonce, 16); // eslint-disable-line
    txData.gasLimit = txData.gas; // eslint-disable-line
    const tx = wallet.txutils.createContractTx(addr, txData); // eslint-disable-line
    const signed = wallet.signing.signTx(ks, pwDerivedKey, tx.tx, addr); // eslint-disable-line
    cb(null, signed);
  };

  const engine = ZeroClientProvider({
    rpcUrl,
    approveTransaction,
    signTransaction,
  });


  const web3 = new Web3(engine);


  engine.start();

  this.web3 = web3;
  this.address = addr;
}

Provider.prototype.getTable = (tableAddr) => this.web3.eth.contract(tableAbi).at(tableAddr);

Provider.prototype.getToken = (tokenAddr) => this.web3.eth.contract(tokenAbi).at(tokenAddr);

Provider.prototype.getWeb3 = () => this.web3;

Provider.prototype.getAddress = () => this.address;

module.exports = Provider;
