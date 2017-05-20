/**
* Created by jzobro 20170520
*/
import React from 'react';

import Card from '../Card2';
import SeatTimer from './SeatTimer';
import StatusAction from './StatusAction';
import {
  SeatContainer,
  CardContainer,
  InfoWrapper,
  AvatarImage,
  DetailWrapper,
  NameBox,
  StackBox,
  StatusSeat,
  StatusSeatWrapper,
} from './styles';

// const componentSize = 'small'; // small, medium, large
const avatarSize = [38, 38]; // x,y
const cardSize = 48;

const stackToString = (stackSize) => {
  if (!stackSize) return '0';
  return stackSize.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// temp to be replaced by imported function
const nickNameByAddress = (signerAddr) => signerAddr;

const Seat = (props) => {
  const {
    activePlayer,
    holeCards,
    folded,
    seatStatus,
    signerAddr,
    sitout,
    stackSize,
    lastAction,
    timeLeft,
  } = props;
  return (
    <SeatContainer activePlayer={activePlayer}>

      {/* <DealerButton dealer={dealer} pos={pos} /> */}

      {/* <AmountBox amountCoords={amountCoords}>
        { (lastAmount > 0) &&
        <div>
          <Pot potSize={lastAmount} left="0%" top="0%" />
        </div>
        }
      </AmountBox> */}

      {seatStatus !== 'EMPTY' ?
        <StatusSeatWrapper>
          <StatusSeat>{seatStatus}</StatusSeat>
        </StatusSeatWrapper>
        :
        <CardContainer>
          <Card
            cardNumber={holeCards[0]}
            folded={folded}
            size={cardSize}
            offset={[0, 0]}
          />
          <Card
            cardNumber={holeCards[1]}
            folded={folded}
            size={cardSize}
            offset={[-100, -133]}
          />
        </CardContainer>
      }

      <InfoWrapper>
        <AvatarImage src={`https://baconmockup.com/${avatarSize[0]}/${avatarSize[1]}`} />
        <DetailWrapper>
          <NameBox>{nickNameByAddress(signerAddr)}</NameBox>
          <StackBox>{stackToString(stackSize)}</StackBox>
        </DetailWrapper>
      </InfoWrapper>

      {lastAction ? <StatusAction {...props} /> : null }

      {(timeLeft > 0) || (sitout > 0) ?
        <SeatTimer
          timerProgress={sitout || timeLeft}
          timerType={(sitout > 0) ? 'sitout' : 'action'}
        />
        : null
      }
    </SeatContainer>
  );
};
Seat.propTypes = {
  activePlayer: React.PropTypes.bool,
  folded: React.PropTypes.bool,
  holeCards: React.PropTypes.array, // array of cards
  seatStatus: React.PropTypes.string,
  signerAddr: React.PropTypes.string,
  sitout: React.PropTypes.number,
  stackSize: React.PropTypes.number,
  lastAction: React.PropTypes.string,
  timeLeft: React.PropTypes.number, // progress 0 - 1
};

export default Seat;
