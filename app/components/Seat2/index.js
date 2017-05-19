/**
* Created by jzobro 20170517
*/
import React from 'react';

import SeatTimer from './SeatTimer';
import ButtonJoinSeat from './ButtonJoinSeat';

import {
  SeatWrapper,
  SeatContainer,
  CardContainer,
  Card,
  InfoWrapper,
  AvatarImage,
  DetailWrapper,
  NameBox,
  StackBox,
  StatusWrapper,
  Status,
} from './styles';

// const componentSize = 'small'; // small, medium, large
const avatarSize = [38, 38]; // x,y

const stackToString = (stackSize) => (
  stackSize.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
);

// temp to be replaced by imported function
const nickNameByAddress = (signerAddr) => signerAddr;
const coords = [0, 0];

const Seat = ({
  activePlayer,
  cards,
  stackSize,
  statusMsg,
  timerProgress,
  signerAddr,
}) => (
  <SeatContainer activePlayer={activePlayer}>
    {cards ?
      <CardContainer>
        <Card />
        <Card />
      </CardContainer>
      : null
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
        <Status type={statusMsg.type} recent={statusMsg.recent}>
          {statusMsg.text}
        </Status>
      </StatusWrapper>
      : null
    }
    {(timerProgress > 0) ?
      <SeatTimer timerProgress={timerProgress} />
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
  timerProgress: React.PropTypes.number,
};

const SeatComponent = (props) => {
  const { myPos, open, pending, pos, state, whosTurn } = props;
  let status = '';
  let seat = null;
  if (pending) {
    status = 'PENDING';
  } else if (myPos === undefined) {
    status = 'JOIN';
  } else {
    status = 'EMPTY';
  }
  if (open) {
    seat = (
      <SeatWrapper coords={coords}>
        <ButtonJoinSeat label={status} />
      </SeatWrapper>
    );
  } else if (pending) {
    seat = (
      <SeatWrapper coords={coords}>
        <Seat label={status} {...props} />
      </SeatWrapper>
    );
  } else {
    let color;
    if (['showdown', 'waiting', 'dealing'].indexOf(state) === -1
          && pos === whosTurn) {
      color = 'green';
    } else if (typeof props.sitout === 'number') {
      color = 'gray';
    } else {
      color = 'blue';
    }
    seat = (
      <SeatWrapper coords={coords}>
        <Seat strokeColor={color} {...props} />
      </SeatWrapper>
    );
  }
  return seat;
};
SeatComponent.propTypes = {
  cards: React.PropTypes.array,
  // coords: React.PropTypes.array,
  folded: React.PropTypes.bool,
  lastAction: React.PropTypes.string,
  lastAmount: React.PropTypes.number,
  myPos: React.PropTypes.array, // seat component position?
  pending: React.PropTypes.bool,
  pos: React.PropTypes.number, // dealer button position?
};


export default SeatComponent;
