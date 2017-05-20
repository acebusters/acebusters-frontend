import React from 'react';

import H2 from '../../components/H2';
import H3 from '../../components/H3';
import SeatComponent from '../../components/Seat2';

const colStyle = {
  marginRight: '3em',
};

const colWidth = {
  height: '50px',
  minWidth: '128px',
};

// temp constants
const signerAddr = 'Username123';
const stackSize = 1000;

const CardExamples = () => (
  <div>
    <div style={{ display: 'flex' }}>
      <div style={colStyle}>
        <H2>Card States</H2>

        <H3>None</H3>
        <div style={{ position: 'relative' }}>
          <div style={colWidth} />
          <SeatComponent
            holeCards={[null, null]}
            stackSize={stackSize}
            signerAddr={signerAddr}
          />
        </div>

        <H3>Hidden</H3>
        <div style={{ position: 'relative' }}>
          <div style={colWidth} />
          <SeatComponent
            holeCards={[-1, -1]}
            stackSize={stackSize}
            signerAddr={signerAddr}
          />
        </div>

        <H3>Folded</H3>
        <div style={{ position: 'relative' }}>
          <div style={colWidth} />
          <SeatComponent
            holeCards={[4, 8]}
            stackSize={stackSize}
            signerAddr={signerAddr}
          />
        </div>

        <H3>Reveal</H3>
        <div style={{ position: 'relative' }}>
          <div style={colWidth} />
          <SeatComponent
            holeCards={[4, 8]}
            stackSize={stackSize}
            signerAddr={signerAddr}
          />
        </div>

      </div>
    </div>
  </div>
);

export default CardExamples;
