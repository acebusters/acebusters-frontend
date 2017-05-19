/**
* Created by jzobro 20170517
*/
import React from 'react';

import SeatTimer from './SeatTimer';

import {
  SeatWrapper,
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

const SeatComponent = ({ activePlayer, cards, stackSize, statusMsg, timerProgress, signerAddr }) => (
  <SeatWrapper activePlayer={activePlayer}>
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
  </SeatWrapper>
);
SeatComponent.propTypes = {
  activePlayer: React.PropTypes.bool,
  cards: React.PropTypes.array,
  stackSize: React.PropTypes.number,
  statusMsg: React.PropTypes.object,
  timerProgress: React.PropTypes.number,
  signerAddr: React.PropTypes.string,
};

export default SeatComponent;
