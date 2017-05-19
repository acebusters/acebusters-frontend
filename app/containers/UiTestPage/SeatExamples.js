import React from 'react';

import H2 from '../../components/H2';
import H3 from '../../components/H3';
import SeatComponent from '../../components/Seat2';

const SeatExamples = () => (
  <div>
    <H2>SeatComponent</H2>
    <div style={{ display: 'flex' }}>
      <div>
        <H2>Transitions</H2>
        <H3>Empty</H3>
        <SeatComponent />
        <H3>Paused</H3>
        <SeatComponent
          activePlayer={false}
          chipCount="0"
          username="Username123"
          statusMsg={{
            type: 'info',
            text: 'sitting-in',
            recent: true,
          }}
        />
      </div>
      <div style={{ marginLeft: '4em' }}>
        <H2>Recent Move</H2>
        <h3>Call, Check</h3>
        <SeatComponent
          activePlayer
          cards={['d2', 's2']}
          chipCount="10,000"
          username="123456789012"
          statusMsg={{
            type: 'success',
            text: 'Call',
            recent: true,
          }}
        />
        <h3>Raise, Bet</h3>
        <SeatComponent
          activePlayer
          cards={['d2', 's2']}
          chipCount="10,000"
          username="123456789012"
          statusMsg={{
            type: 'danger',
            text: 'Raise',
            recent: true,
          }}
        />
        <h3>All-in, Winner</h3>
        <SeatComponent
          activePlayer
          cards={['d2', 's2']}
          chipCount="999"
          username="Edith"
          statusMsg={{
            type: 'warning',
            text: 'All-in',
            recent: true,
          }}
        />
      </div>
      <div style={{ marginLeft: '4em' }}>
        <H2>Old Move</H2>
        <h3>Call, Check</h3>
        <SeatComponent
          activePlayer
          cards={['d2', 's2']}
          chipCount="10,000"
          username="123456789012"
          statusMsg={{
            type: 'success',
            text: 'Call',
            recent: false,
          }}
        />
        <h3>Raise, Bet</h3>
        <SeatComponent
          activePlayer
          cards={['d2', 's2']}
          chipCount="10,000"
          username="123456789012"
          statusMsg={{
            type: 'danger',
            text: 'Raise',
            recent: false,
          }}
        />
        <h3>All-in, Winner</h3>
        <SeatComponent
          activePlayer
          cards={['d2', 's2']}
          chipCount="999"
          username="Edith"
          statusMsg={{
            type: 'warning',
            text: 'All-in',
            recent: false,
          }}
        />
      </div>
    </div>
  </div>
);

export default SeatExamples;
