/**
* Created by jzobro 20170517
*/
import React from 'react';

// components
import Container from '../../components/Container';
import H1 from '../../components/H1';
import H2 from '../../components/H2';
import SeatComponent from '../../components/Seat2';

export default () => (
  <Container>
    <div>
      <H1>UI Test Page</H1>
      <H2>SeatComponent</H2>
      <SeatComponent />
    </div>
  </Container>
);
