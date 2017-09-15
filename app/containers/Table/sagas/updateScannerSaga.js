import { put, select, take } from 'redux-saga/effects';

import { makeSelectPrivKey, makeSignerAddrSelector } from '../../AccountProvider/selectors';
import { makeMyCardsSelector } from '../../Seat/selectors';
import { nickNameByAddress } from '../../../services/nicknames';
import { formatNtz } from '../../../utils/amountFormatter';
import * as storageService from '../../../services/sessionStorage';

import { addMessage, bet, show, net, UPDATE_RECEIVED } from '../actions';
import {
  lastAmountByAction,
  isSbTurnByAction,
  isBbTurnByAction,
  is0rTurnByAction,
  isShowTurnByAction,
  hasNettingInAction,
  makeSbSelector,
  makeSelectWinners,
} from '../selectors';


export function* updateScanner(pokerHelper) {
  // toggle variables to avoid duplicate requests
  const payedBlind = {};
  const showed = {};
  const netted = {};

  while (true) { //eslint-disable-line
    const action = yield take(UPDATE_RECEIVED);
    // fetch state if not existing
    const myAddr = yield select(makeSignerAddrSelector());
    const privKey = yield select(makeSelectPrivKey());
    const sb = yield select(makeSbSelector(), { params: { tableAddr: action.tableAddr } });

    const toggleKey = action.tableAddr + action.hand.handId;

    // do nothing if hand data missing
    if (!action.hand || !action.hand.lineup) {
      continue; // eslint-disable-line no-continue
    }

    let complete;

    try {
      complete = pokerHelper.isHandComplete(action.hand.lineup, action.hand.dealer, action.hand.state);
    } catch (e) {
      continue; // eslint-disable-line no-continue
    }

    // check if turn to pay small blind
    if (!complete) {
      if (isSbTurnByAction(action, { address: myAddr, sb }) && !payedBlind[toggleKey]) {
        payedBlind[toggleKey] = true;
        yield put(bet(action.tableAddr, action.hand.handId, sb, privKey));
        continue; // eslint-disable-line no-continue
      }
      // check if turn to pay big blind
      if (isBbTurnByAction(action, { address: myAddr, sb }) && !payedBlind[toggleKey]) {
        payedBlind[toggleKey] = true;
        yield put(bet(action.tableAddr, action.hand.handId, sb * 2, privKey));
        continue; // eslint-disable-line no-continue
      }

      // check if turn to pay 0 receipt
      if (is0rTurnByAction(action, { address: myAddr, sb }) && !payedBlind[toggleKey]) {
        payedBlind[toggleKey] = true;
        yield put(bet(action.tableAddr, action.hand.handId, 0, privKey));
        continue; // eslint-disable-line no-continue
      }

      // check if's showtime!
      const isShow = isShowTurnByAction(action, { address: myAddr, sb });
      if (isShow && !showed[toggleKey]) {
        showed[toggleKey] = true;
        const amount = lastAmountByAction(action, { address: myAddr });
        const holeCards = yield select(makeMyCardsSelector(), { params: { tableAddr: action.tableAddr, handId: action.hand.handId } });
        yield put(show(action.tableAddr, action.hand.handId, holeCards, amount, privKey));
        continue; // eslint-disable-line no-continue
      }
    }
    // check if netting exists that we need to sign
    if (hasNettingInAction(action, { address: myAddr })
      && !netted[toggleKey]) {
      netted[toggleKey] = true;
      const balances = action.hand.netting.newBalances;
      yield put(net(action.tableAddr, action.hand.handId, balances, privKey));
      continue; // eslint-disable-line no-continue
    }
    if (!storageService.getItem(`won[${toggleKey}]`)) {
      const winners = yield select(makeSelectWinners(), { params: { tableAddr: action.tableAddr, handId: action.hand.handId } });
      if (winners && winners.length) {
        storageService.setItem(`won[${toggleKey}]`, true);
        const winnerMessages = winners.map((winner) => {
          const handString = (winner.hand) ? `with ${winner.hand}` : '';
          return `player ${nickNameByAddress(winner.addr)} won ${formatNtz(winner.amount - winner.maxBet)} NTZ ${handString}`;
        });
        yield put(addMessage(winnerMessages.join(', '), action.tableAddr, null, Date.now()));
        continue; // eslint-disable-line no-continue
      }
    }
  }
}
