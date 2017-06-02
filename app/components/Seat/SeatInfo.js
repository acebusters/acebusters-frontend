import React from 'react';

import Pot from '../Pot';
import { nickNameByAddress } from '../../services/nicknames';

import {
  AvatarImage,
  AmountBox,
  ChipButtonContainer,
  DealerButton,
  DetailWrapper,
  InfoWrapper,
  NameBox,
  StackBox,
} from './styles';
import { STATUS_MSG } from '../../app.config';

const stackToString = (stackSize) => {
  if (!stackSize) return '0';
  return stackSize.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const SeatInfo = ({
  amountCoords,
  blocky,
  dealer,
  lastAmount,
  pos,
  signerAddr,
  seatStatus,
  stackSize,
}) => (
  <InfoWrapper>
    {seatStatus && seatStatus === STATUS_MSG.active ?
      <ChipButtonContainer className="chip-button-container">
        <DealerButton dealer={dealer} pos={pos}>D</DealerButton>

        <AmountBox amountCoords={amountCoords}>
          { (lastAmount > 0) &&
            <Pot className="pot" potSize={lastAmount} left="0%" top="0%" />
          }
        </AmountBox>
      </ChipButtonContainer>
      : null
    }

    <AvatarImage className="avatar-image" bgImg={blocky} />

    <DetailWrapper>
      <NameBox className="name-box">{nickNameByAddress(signerAddr)}</NameBox>
      <StackBox className="stack-box">{stackToString(stackSize)}</StackBox>
    </DetailWrapper>
  </InfoWrapper>
);
SeatInfo.propTypes = {
  amountCoords: React.PropTypes.array,
  blocky: React.PropTypes.string,
  dealer: React.PropTypes.number, // which seat is dealer
  lastAmount: React.PropTypes.number,
  pos: React.PropTypes.number, // which position is THIS seat
  signerAddr: React.PropTypes.string,
  seatStatus: React.PropTypes.object,
  stackSize: React.PropTypes.number,
};

export default SeatInfo;
