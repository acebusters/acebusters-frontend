import React from 'react';
import { Wrapper } from './styles';

const NoInjected = () => (
  <Wrapper theme="warning">
    <h2>Account doesn´t exists or locked</h2>
    <p>
      Please, create or unlock MetaMask account
    </p>
  </Wrapper>
);

export default NoInjected;
