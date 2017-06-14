import { ETH_BALANCE_UPDATE } from './constants';

export const updateETHBalance = (balance) => ({
  type: ETH_BALANCE_UPDATE,
  payload: balance,
});

