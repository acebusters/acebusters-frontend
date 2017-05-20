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
const blocky = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAADeklEQVR4Xu3dUXUjMRAFURlCuASCQQVCQC0EY9lAcEDcj3d0UvvfK03pubo9mUwe7+d5H/j38/2C6kqVwMfXJ/0XjwJA/ObFBWB+BNsNFIAt//nqBWB+BNsNFIAt//nqBWB+BNsNFIAt//nqBWB+BNsNFIAt//nqBWB+BNsNFIAt//nqBWB+BNsNFIAt//nqBWB+BNsNFIAt//nq8wCsCayfR9ADWPPj5wHWF1AA7AQKgPE7GQABankGMIIZwPhlAOTH5RnAEGYA45cBkB+XZwBDmAGMXwZAflyeAQxhBjB+GQD5cXkGMIQZwPhlAOTH5RnAEGYA45cBkB+XZwBD+Pj/etH7AWx5r17/NG4dQCVYAJBgAUCAWp4BjGAGMH4nAyBALc8ARjADGL8MgPy4PAMYwgxg/DIA8uPyDGAIM4DxywDIj8szgCHMAMYvAyA/Ls8AhjADGL8MgPy4PAMYwgxg/DKAfgJv/2EK5oefKFJ+bIACYBFY8ysAdn5cXQD++J+cKQAFgCzSDED49sUZIANQCjMA4dsXZ4AMQCnMAIRvX5wBMgClMAMQvn1xBsgAlMIMQPj2xRkgA1AKMwDh2xfPDXD7n49XgBoB/QTq+nr9/IqY2wHoAdx+/QUAE1AAxkOcKhDPf/5MoF5/BsAEZIAMgBGy8gzw9WkEsToDZACMkJVngAxACWoIJHynbwG390A8/wJQAF6aIapvBmgGoAA1AxC+ZoDreyCe//XXnwEwAbfPQPPfDn78sxN4P61eq9f71wAWAExAAcApfA0Qz/+s958BagGU4VoA4TsZgO9ENQRSBGsBtQAKUC2A8NUC+D136ykaz78ZoBnAIqQ3spoBmgEogc0AhK8ZoBlg/DW2FlALIIfVAghfLaAW8NdbAH6A5gHS/a+/xun+uQXoBtb3EXT/BQAJFoDtY+UZAAOcARBgBsgAFCH9YRItfs7JAEgwA2QAilAGIHynIdD41QKQXzeCxm9YyQCY4IZABNgQ2BBIEWoIJHwNgYav+wDKryGwIdBe9FgLsM9gL4gwfr0hRB9KRP7cQnT9268/A2ACCsB4iNH7CHj+tYDbPwEF4HneAqEAbO/kqQGbAST9pxdFXt8D8fyvv/4MgAm4vQUWgALQECgZyADdB5D8cG3fAvBNpXoCGSADaIaoPgNkAApQ3wII3/03gn4BzbPibuW5WaQAAAAASUVORK5CYII=';
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
            activePlayer
            blocky={blocky}
            dealer={1}
            holeCards={[null, null]}
            myPos={0}
            pos={0}
            stackSize={stackSize}
            signerAddr={signerAddr}
          />
        </div>

        <H3>Hidden</H3>
        <div style={{ position: 'relative' }}>
          <div style={colWidth} />
          <SeatComponent
            activePlayer
            blocky={blocky}
            dealer={1}
            holeCards={[-1, -1]}
            myPos={0}
            pos={0}
            stackSize={stackSize}
            signerAddr={signerAddr}
          />
        </div>

        <H3>Reveal</H3>
        <div style={{ position: 'relative' }}>
          <div style={colWidth} />
          <SeatComponent
            activePlayer
            blocky={blocky}
            dealer={1}
            holeCards={[4, 8]}
            myPos={0}
            pos={0}
            stackSize={stackSize}
            signerAddr={signerAddr}
          />
        </div>

      </div>
      <div style={colStyle}>
        <H2>Dealer Button</H2>

        <H3>None</H3>
        <div style={{ position: 'relative' }}>
          <div style={colWidth} />
          <SeatComponent
            activePlayer
            blocky={blocky}
            dealer={0}
            holeCards={[null, null]}
            myPos={0}
            pos={0}
            stackSize={stackSize}
            signerAddr={signerAddr}
          />
        </div>

        <H3>Hidden</H3>
        <div style={{ position: 'relative' }}>
          <div style={colWidth} />
          <SeatComponent
            activePlayer
            blocky={blocky}
            dealer={0}
            holeCards={[-1, -1]}
            myPos={0}
            pos={0}
            stackSize={stackSize}
            signerAddr={signerAddr}
          />
        </div>

        <H3>Reveal</H3>
        <div style={{ position: 'relative' }}>
          <div style={colWidth} />
          <SeatComponent
            activePlayer
            blocky={blocky}
            dealer={0}
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

export default CardExamples;
