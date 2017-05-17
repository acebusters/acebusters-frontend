/**
* Created by jzobro 20170517
*/
import React from 'react';

import {
  SeatWrapper,
  CardWrapper,
  Card,
  InfoWrapper,
  AvatarImage,
  DetailWrapper,
  Username,
  ChipCount,
  StatusWrapper,
  Status,
} from './styles';

// const componentSize = 'small'; // small, medium, large
const avatarSize = [38, 38]; // x,y

const SeatComponent = ({ activePlayer, cards, chipCount, statusMsg, username }) => (
  <SeatWrapper activePlayer={activePlayer}>
    {cards ?
      <CardWrapper>
        <Card />
        <Card />
      </CardWrapper>
      : null
    }
    <InfoWrapper>
      <AvatarImage src={`https://baconmockup.com/${avatarSize[0]}/${avatarSize[1]}`} />
      <DetailWrapper>
        <Username>{username}</Username>
        <ChipCount>{chipCount}</ChipCount>
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
  </SeatWrapper>
);
SeatComponent.propTypes = {
  activePlayer: React.PropTypes.bool,
  cards: React.PropTypes.array,
  chipCount: React.PropTypes.string,
  statusMsg: React.PropTypes.object,
  username: React.PropTypes.string,
};

export default SeatComponent;
