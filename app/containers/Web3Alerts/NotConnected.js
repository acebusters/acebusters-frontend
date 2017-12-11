import React from 'react';
import { Wrapper } from './styles';

const NotConnected = () => (
  <Wrapper theme="warning">
    <h2>Connection Lost</h2>
    <p>
      Please check your connection or try to refresh page
    </p>
  </Wrapper>
);

export default NotConnected;
