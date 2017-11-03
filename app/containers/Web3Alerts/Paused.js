import React from 'react';
import { Wrapper } from './styles';

const Paused = () => (
  <Wrapper theme="warning">
    <h2>Contracts under maintenance</h2>
    <p>
      Currently we are unable to send transactions. Please try later
    </p>
  </Wrapper>
);

export default Paused;
