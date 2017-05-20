import React from 'react';

import H2 from '../../components/H2';
import H3 from '../../components/H3';
import SeatComponent from '../../components/Seat2';

// temp constants
const signerAddr = 'Username123';
const stackSize = 1000;
const blocky = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAADeklEQVR4Xu3dUXUjMRAFURlCuASCQQVCQC0EY9lAcEDcj3d0UvvfK03pubo9mUwe7+d5H/j38/2C6kqVwMfXJ/0XjwJA/ObFBWB+BNsNFIAt//nqBWB+BNsNFIAt//nqBWB+BNsNFIAt//nqBWB+BNsNFIAt//nqBWB+BNsNFIAt//nqBWB+BNsNFIAt//nqBWB+BNsNFIAt//nq8wCsCayfR9ADWPPj5wHWF1AA7AQKgPE7GQABankGMIIZwPhlAOTH5RnAEGYA45cBkB+XZwBDmAGMXwZAflyeAQxhBjB+GQD5cXkGMIQZwPhlAOTH5RnAEGYA45cBkB+XZwBD+Pj/etH7AWx5r17/NG4dQCVYAJBgAUCAWp4BjGAGMH4nAyBALc8ARjADGL8MgPy4PAMYwgxg/DIA8uPyDGAIM4DxywDIj8szgCHMAMYvAyA/Ls8AhjADGL8MgPy4PAMYwgxg/DKAfgJv/2EK5oefKFJ+bIACYBFY8ysAdn5cXQD++J+cKQAFgCzSDED49sUZIANQCjMA4dsXZ4AMQCnMAIRvX5wBMgClMAMQvn1xBsgAlMIMQPj2xRkgA1AKMwDh2xfPDXD7n49XgBoB/QTq+nr9/IqY2wHoAdx+/QUAE1AAxkOcKhDPf/5MoF5/BsAEZIAMgBGy8gzw9WkEsToDZACMkJVngAxACWoIJHynbwG390A8/wJQAF6aIapvBmgGoAA1AxC+ZoDreyCe//XXnwEwAbfPQPPfDn78sxN4P61eq9f71wAWAExAAcApfA0Qz/+s958BagGU4VoA4TsZgO9ENQRSBGsBtQAKUC2A8NUC+D136ykaz78ZoBnAIqQ3spoBmgEogc0AhK8ZoBlg/DW2FlALIIfVAghfLaAW8NdbAH6A5gHS/a+/xun+uQXoBtb3EXT/BQAJFoDtY+UZAAOcARBgBsgAFCH9YRItfs7JAEgwA2QAilAGIHynIdD41QKQXzeCxm9YyQCY4IZABNgQ2BBIEWoIJHwNgYav+wDKryGwIdBe9FgLsM9gL4gwfr0hRB9KRP7cQnT9268/A2ACCsB4iNH7CHj+tYDbPwEF4HneAqEAbO/kqQGbAST9pxdFXt8D8fyvv/4MgAm4vQUWgALQECgZyADdB5D8cG3fAvBNpXoCGSADaIaoPgNkAApQ3wII3/03gn4BzbPibuW5WaQAAAAASUVORK5CYII=';

const colStyle = {
  marginRight: '3em',
};

const colWidth = {
  height: '50px',
  minWidth: '128px',
};

const SeatExamples = () => (
  <div>
    <div style={{ display: 'flex' }}>
      <div style={colStyle}>
        <H2>Paused</H2>

        <H3>Open</H3>
        <div style={{ position: 'relative' }}>
          <div style={colWidth} />
          <SeatComponent
            activePlayer
            open
          />
        </div>

        <H3>Pending</H3>
        <div style={{ position: 'relative' }}>
          <div style={colWidth} />
          <SeatComponent
            activePlayer={false}
            blocky={blocky}
            pending
            stackSize={0}
            signerAddr="Username123"
          />
        </div>

        <H3>Sitting-in</H3>
        <div style={{ position: 'relative' }}>
          <div style={colWidth} />
          <SeatComponent
            activePlayer={false}
            blocky={blocky}
            stackSize={0}
            signerAddr="Username123"
          />
        </div>

        <H3>Standing-up</H3>
        <div style={{ position: 'relative' }}>
          <div style={colWidth} />
          <SeatComponent
            blocky={blocky}
            stackSize={0}
            signerAddr="Username123"
          />
        </div>

        <H3>Sit-out</H3>
        <div style={{ position: 'relative' }}>
          <div style={colWidth} />
          <SeatComponent
            blocky={blocky}
            myPos={0}
            sitout={0.6}
            stackSize={0}
            signerAddr="Username123"
          />
        </div>

      </div>
      <div style={colStyle}>
        <H2>Timer</H2>

        <H3>Normal</H3>
        <div style={{ position: 'relative' }}>
          <div style={colWidth} />
          <SeatComponent
            activePlayer
            blocky={blocky}
            dealer={1}
            holeCards={[-1, -1]}
            myPos={0}
            pos={0}
            stackSize={0}
            signerAddr="Username123"
            timeLeft={0.9}
          />
        </div>

        <H3>Warning</H3>
        <div style={{ position: 'relative' }}>
          <div style={colWidth} />
          <SeatComponent
            activePlayer
            blocky={blocky}
            dealer={1}
            holeCards={[-1, -1]}
            myPos={0}
            pos={0}
            stackSize={0}
            signerAddr="Username123"
            timeLeft={0.5}
          />
        </div>

        <H3>Danger</H3>
        <div style={{ position: 'relative' }}>
          <div style={colWidth} />
          <SeatComponent
            activePlayer
            blocky={blocky}
            dealer={1}
            holeCards={[-1, -1]}
            myPos={0}
            pos={0}
            stackSize={0}
            signerAddr="Username123"
            timeLeft={0.2}
          />
        </div>

        <H3>Before Hole Cards</H3>
        <div style={{ position: 'relative' }}>
          <div style={colWidth} />
          <SeatComponent
            activePlayer
            blocky={blocky}
            dealer={1}
            holeCards={[null, null]}
            myPos={0}
            pos={0}
            stackSize={0}
            signerAddr="Username123"
            timeLeft={0.4}
          />
        </div>

      </div>

      <div style={colStyle}>
        <H2>Recent Action</H2>

        <h3>Call, Check</h3>
        <div style={{ position: 'relative' }}>
          <div style={colWidth} />
          <SeatComponent
            activePlayer
            blocky={blocky}
            dealer={1}
            holeCards={[-1, -1]}
            myPos={0}
            pos={0}
            pending={false}
            stackSize={10000}
            signerAddr="123456789012"
            lastAction="call"
            showStatus
          />
        </div>

        <h3>Raise, Bet</h3>
        <div style={{ position: 'relative' }}>
          <div style={colWidth} />
          <SeatComponent
            activePlayer
            blocky={blocky}
            dealer={1}
            holeCards={[-1, -1]}
            myPos={0}
            pos={0}
            pending={false}
            stackSize={10000}
            signerAddr="123456789012"
            lastAction="raise"
            showStatus
          />
        </div>

        <h3>All-in, Winner</h3>
        <div style={{ position: 'relative' }}>
          <div style={colWidth} />
          <SeatComponent
            activePlayer
            blocky={blocky}
            dealer={1}
            holeCards={[-1, -1]}
            myPos={0}
            pos={0}
            pending={false}
            stackSize={999}
            signerAddr="Edith"
            lastAction="all-in"
            showStatus
          />
        </div>

        <H3>Folded</H3>
        <div style={{ position: 'relative' }}>
          <div style={colWidth} />
          <SeatComponent
            activePlayer
            blocky={blocky}
            dealer={1}
            folded
            holeCards={[4, 8]}
            myPos={0}
            pos={0}
            stackSize={stackSize}
            signerAddr={signerAddr}
          />
        </div>

      </div>

      <div style={colStyle}>
        <H2>Past Action</H2>

        <h3>Call, Check</h3>
        <div style={{ position: 'relative' }}>
          <div style={colWidth} />
          <SeatComponent
            activePlayer
            blocky={blocky}
            dealer={1}
            holeCards={[-1, -1]}
            myPos={0}
            pos={0}
            pending={false}
            stackSize={10000}
            signerAddr="123456789012"
            lastAction="call"
          />
        </div>

        <h3>Raise, Bet</h3>
        <div style={{ position: 'relative' }}>
          <div style={colWidth} />
          <SeatComponent
            activePlayer
            blocky={blocky}
            dealer={1}
            holeCards={[-1, -1]}
            myPos={0}
            pos={0}
            pending={false}
            stackSize={10000}
            signerAddr="123456789012"
            lastAction="raise"
          />
        </div>

        <h3>All-in, Winner</h3>
        <div style={{ position: 'relative' }}>
          <div style={colWidth} />
          <SeatComponent
            activePlayer
            blocky={blocky}
            dealer={1}
            holeCards={[-1, -1]}
            myPos={0}
            pos={0}
            pending={false}
            stackSize={999}
            signerAddr="Edith"
            lastAction="all-in"
          />
        </div>

        <H3>Folded</H3>
        <div style={{ position: 'relative' }}>
          <div style={colWidth} />
          <SeatComponent
            blocky={blocky}
            dealer={1}
            folded
            holeCards={[4, 8]}
            myPos={0}
            pos={0}
            stackSize={stackSize}
            signerAddr={signerAddr}
          />
        </div>

      </div>
    </div>
  </div>
);

export default SeatExamples;
