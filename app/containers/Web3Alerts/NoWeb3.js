import React from 'react';
import A from '../../components/A';
import { Wrapper } from './styles';

const NoWeb3Alert = () => (
  <Wrapper theme="warning">
    <h2>Please install MetaMask</h2>
    <p>
      In order to use our app you need to install the <A href="https://metamask.io/" target="_blank">MetaMask Extension</A> to make your browser smart contract enabled.
      Also, you can use Ethereum enabled browser like <A href="https://github.com/ethereum/mist#installation" target="_blank">Mist</A> or
      <A href="https://www.parity.io/" target="_blank">Parity</A>.
    </p>
  </Wrapper>
);

export default NoWeb3Alert;

