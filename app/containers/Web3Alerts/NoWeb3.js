import React from 'react';
import { Wrapper } from './styles';

const NoWeb3Alert = () => (
  <Wrapper theme="warning">
    <h2>YOUR BROWSER DOES NOT SUPPORT SMART CONTRACTS</h2>
    <p>
      You read from the Ethereum blockchain,
      but in order to interact with it from your browser,
      download an Ethereum enabled browser like Mist,
      Parity or install the Metamask Chrome Extension.
    </p>
  </Wrapper>
);

export default NoWeb3Alert;

