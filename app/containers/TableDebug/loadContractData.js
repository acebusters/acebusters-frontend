import { promisifyContractCall } from '../../utils/promisifyContractCall';

const EMPTY_ADDR = '0x0000000000000000000000000000000000000000';

function getLineup(contract) {
  return promisifyContractCall(contract.getLineup.call)().then((lineup) => {
    const rv = [];
    for (let i = 0; i < lineup[1].length; i += 1) {
      rv.push({
        address: lineup[1][i],
        amount: lineup[2][i],
      });
      if (lineup[3][i] > 0) {
        rv[i].exitHand = lineup[3][i];
      }
    }
    return {
      lastHandNetted: lineup[0],
      lineup: rv,
    };
  });
}

function getIns(contract, handId, lineup) {
  const getIn = promisifyContractCall(contract.getIn.call);
  return Promise.all(lineup.map(({ address }) => {
    if (address === EMPTY_ADDR) {
      return Promise.resolve(null);
    }

    return getIn(handId, address);
  }));
}

function getOuts(contract, handId, lineup) {
  const getOut = promisifyContractCall(contract.getOut.call);
  return Promise.all(lineup.map(({ address }) => {
    if (address === EMPTY_ADDR) {
      return Promise.resolve(null);
    }

    return getOut(handId, address).then(([out, claimCount]) => ({ claimCount, out }));
  }));
}

function getLastNettingRequestHandId(contract) {
  return promisifyContractCall(contract.lastNettingRequestHandId.call)();
}

function getLastNettingRequestTime(contract) {
  return promisifyContractCall(contract.lastNettingRequestTime.call)();
}

function handsRange(handA, handB) {
  const start = Math.min(handA, handB);
  const end = Math.max(handA, handB);
  const range = [];

  for (let i = start; i <= end; i += 1) {
    range.push(i);
  }

  return range;
}

export function loadContractData(contract) {
  return Promise.all([
    getLineup(contract),
    getLastNettingRequestHandId(contract),
    getLastNettingRequestTime(contract),
  ]).then(([
    { lineup, lastHandNetted },
    lastNettingRequestHandId,
    lastNettingRequestTime,
  ]) => {
    const hands = handsRange(lastHandNetted, lastNettingRequestHandId);
    const promises = hands.reduce((memo, handId) => [
      ...memo,
      getIns(contract, handId, lineup),
      getOuts(contract, handId, lineup),
    ], []);

    return Promise.all(promises)
      .then((results) => ({
        lineup,
        hands: hands.reduce((memo, handId, i) => ({
          ...memo,
          [handId]: { ins: results[i * 2], outs: results[(i * 2) + 1] },
        }), {}),
        lastHandNetted,
        lastNettingRequestHandId,
        lastNettingRequestTime,
      }));
  });
}
