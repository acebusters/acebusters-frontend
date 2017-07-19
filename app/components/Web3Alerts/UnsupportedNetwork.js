import React from 'react';
import { Wrapper } from './styles';

import { conf } from '../../app.config';

const UnsupportedNetworkAlert = () => (
  <Wrapper theme="warning">
    <h2>Unsupported network</h2>
    <p>
      You can`t send transactions on this network. You must be on <strong>{conf().networkName}</strong>.
    </p>
  </Wrapper>
);

export default UnsupportedNetworkAlert;

