/**
* Created by jzobro 20170517
*/
import React from 'react';
import styled from 'styled-components';

// components
import ContainerBase from '../../components/Container';
import H1 from '../../components/H1';
import H2 from '../../components/H2';
import SeatComponent from '../../components/Seat2';

const Container = styled(ContainerBase)`
  background-color: darkgray;
  background: radial-gradient(50% 49%, #B4B3B3 50%, #353535 100%);
`;

export default () => (
  <Container>
    <div>
      <H1>UI Test Page</H1>
      <H2>SeatComponent</H2>
      <SeatComponent />
      <SeatComponent />
      <SeatComponent />
      <SeatComponent />
    </div>
  </Container>
);
