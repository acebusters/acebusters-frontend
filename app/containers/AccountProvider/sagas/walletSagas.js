import { call, put, select } from 'redux-saga/effects';
import ethers from 'ethers';

import { setAuthState, walletLoaded } from '../../AccountProvider/actions';
import { makeSelectWallet } from '../../AccountProvider/selectors';
import { getWeb3 } from '../../AccountProvider/utils';

import * as localStorage from '../../../services/localStorage';
import * as accountService from '../../../services/account';
import { modalDismiss, modalAdd } from '../../App/actions';
import { LOGOUT_DIALOG } from '../../Modal/constants';
import { promisifyWeb3Call } from '../../../utils/promisifyWeb3Call';
import { NTZ_DECIMALS, ETH_DECIMALS } from '../../../utils/amountFormatter';
import { ABI_TOKEN_CONTRACT, conf } from '../../../app.config';

const totalBits = 768;
const bitsToBytes = (bits) => bits / 8;

function getWallet() {
  const crypto = window.crypto || window.msCrypto;
  if (localStorage.getItem('wallet')) {
    const { mnemonic } = JSON.parse(localStorage.getItem('wallet'));
    return ethers.Wallet.fromMnemonic(mnemonic);
  }

  const wallet = ethers.Wallet.createRandom({
    extraEntropy: Array.from(crypto.getRandomValues(new Uint8Array(bitsToBytes(totalBits)))),
  });

  localStorage.setItem('wallet', JSON.stringify(wallet));

  return wallet;
}

export function* walletSaga() {
  const wallet = yield call(getWallet);
  yield put(walletLoaded(wallet));
  yield put(setAuthState({
    privKey: wallet.privateKey,
    loggedIn: true,
    generated: true,
  }));

  const web3 = yield call(getWeb3);
  const token = web3.eth.contract(ABI_TOKEN_CONTRACT).at(conf().ntzAddr);
  const balanceOf = yield call(promisifyWeb3Call, token.balanceOf.call);
  const getBalance = yield call(promisifyWeb3Call, web3.eth.getBalance);
  const babzBalance = yield call(balanceOf, wallet.address);
  const weiBalance = yield call(getBalance, wallet.address);

  if (
    babzBalance.lt(NTZ_DECIMALS.mul(200)) ||
    weiBalance.lt(ETH_DECIMALS.mul(0.03))
  ) {
    accountService.requestFunds(wallet.address);
  }
}

export function* logoutSaga({ newAuthState }) {
  if (!newAuthState.loggedIn) {
    const wallet = yield select(makeSelectWallet());
    if (wallet) {
      yield put(walletLoaded());
      yield put(modalAdd({
        modalType: LOGOUT_DIALOG,
        modalProps: { wallet },
      }));
    }
    localStorage.removeItem('wallet');
  }
}

export function* importSaga({ payload: mnemonic }) {
  const wallet = ethers.Wallet.fromMnemonic(mnemonic);
  yield put(walletLoaded(wallet));
  yield put(setAuthState({
    privKey: wallet.privateKey,
    loggedIn: true,
    generated: true,
  }));
  yield put(modalDismiss());
  localStorage.setItem('wallet', JSON.stringify(wallet));
}
