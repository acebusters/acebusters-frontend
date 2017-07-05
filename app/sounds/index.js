/* eslint-disable global-require */
const isPlayerTurn = new Audio(require('./assets/33788__jobro__5-beep-b.wav'));

export function playIsPlayerTurn() {
  isPlayerTurn.play();
}
