import Web3 from 'web3';
import WebsocketProvider from '../../services/wsProvider';
import { conf } from '../../app.config';

const confParams = conf();

let web3Instance;

export function getWeb3() {
  if (typeof web3Instance === 'undefined') {
    web3Instance = new Web3(new WebsocketProvider(confParams.gethUrl));
  }
  return web3Instance;
}

export function addEventsDate(events) {
  const web3 = getWeb3();
  const batch = web3.createBatch();
  const result = Promise.all(events.map((event) => (
    new Promise((resolve) => {
      batch.add(web3.eth.getBlock.request(event.blockNumber, (blErr, block) => {
        resolve({
          ...event,
          timestamp: block.timestamp,
        });
      }));
    })
  )));
  batch.execute();

  return result;
}
export const isUserEvent = (proxyAddr) => (event) => {
  const { args = {}, address } = event;
  return (
    args.from === proxyAddr ||
    args.purchaser === proxyAddr ||
    args.seller === proxyAddr ||
    args.sender === proxyAddr ||
    args.owner === proxyAddr ||
    args.spender === proxyAddr ||
    args.to === proxyAddr ||
    address === proxyAddr
  );
};
