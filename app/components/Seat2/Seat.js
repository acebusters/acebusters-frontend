/**
* Created by jzobro 20170520
*/
import React from 'react';

import SeatTimer from './SeatTimer';
import {
  SeatContainer,
  CardContainer,
  Card,
  InfoWrapper,
  AvatarImage,
  DetailWrapper,
  NameBox,
  StackBox,
  StatusWrapper,
  StatusHand,
  StatusSeat,
  StatusSeatWrapper,
} from './styles';

// const componentSize = 'small'; // small, medium, large
const avatarSize = [38, 38]; // x,y

const stackToString = (stackSize) => (
  stackSize.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
);

// temp to be replaced by imported function
const nickNameByAddress = (signerAddr) => signerAddr;

const Seat = ({
  activePlayer,
  cards,
  stackSize,
  statusMsg,
  timeLeft,
  signerAddr,
}) => (
  <SeatContainer activePlayer={activePlayer}>
    {cards ?
      <CardContainer>
        <Card />
        <Card />
      </CardContainer>
    :
      <StatusSeatWrapper>
        <StatusSeat>Sit-out</StatusSeat>
      </StatusSeatWrapper>
    }
    <InfoWrapper>
      <AvatarImage src={`https://baconmockup.com/${avatarSize[0]}/${avatarSize[1]}`} />
      <DetailWrapper>
        <NameBox>{nickNameByAddress(signerAddr)}</NameBox>
        <StackBox>{stackToString(stackSize)}</StackBox>
      </DetailWrapper>
    </InfoWrapper>
    {statusMsg ?
      <StatusWrapper>
        <StatusHand type={statusMsg.type} recent={statusMsg.recent}>
          {statusMsg.text}
        </StatusHand>
      </StatusWrapper>
      : null
    }
    {(timeLeft > 0) ?
      <SeatTimer timerProgress={timeLeft} />
      : null
    }
  </SeatContainer>
);
Seat.propTypes = {
  activePlayer: React.PropTypes.bool,
  cards: React.PropTypes.array,
  signerAddr: React.PropTypes.string,
  stackSize: React.PropTypes.number,
  statusMsg: React.PropTypes.object,
  timeLeft: React.PropTypes.number, // progress 0 - 1
};

export default Seat;
