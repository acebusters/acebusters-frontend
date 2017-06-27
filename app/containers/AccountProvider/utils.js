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
