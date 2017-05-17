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

const username = 'Username12';
const chipcount = '1,000';
const cardShow = true;
const avatarSize = [38, 38]; // x,y
const statusShow = true;
const statusText = 'All-in';
const statusType = 'warning'; // success(green), info(grey), warning(yellow), danger(orange)

const SeatComponent = () => (
  <SeatWrapper>
    {cardShow ?
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
        <ChipCount>{chipcount}</ChipCount>
      </DetailWrapper>
    </InfoWrapper>
    {statusShow ?
      <StatusWrapper>
        <Status type={statusType}>{statusText}</Status>
      </StatusWrapper>
      : null
    }
  </SeatWrapper>
);

export default SeatComponent;
