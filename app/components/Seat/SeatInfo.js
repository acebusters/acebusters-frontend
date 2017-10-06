import React from 'react';
import PropTypes from 'prop-types';

import Pot from '../Pot';
import { nickNameByAddress } from '../../services/nicknames';
import { formatNtz } from '../../utils/amountFormatter';
import {
  AvatarImage,
  ChipButtonContainer,
  DealerButton,
  DetailWrapper,
  InfoWrapper,
  NameBox,
  StackBox,
} from './styles';
import { STATUS_MSG } from '../../app.config';

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
    {seatStatus && seatStatus === STATUS_MSG.active &&
      <ChipButtonContainer className="chip-button-container">
        <DealerButton dealer={dealer} pos={pos}>
          D
        </DealerButton>
        {lastAmount > 0 &&
          <Pot
            className="pot"
            potSize={lastAmount}
            left={`${amountCoords[0]}em`}
            top={`${amountCoords[1]}em `}
            short
          />
        }
      </ChipButtonContainer>
    }

    <AvatarImage className="avatar-image" bgImg={blocky} />
    <DetailWrapper>
      <NameBox className="name-box">{nickNameByAddress(signerAddr)}</NameBox>
      <StackBox className="stack-box">
        {formatNtz(stackSize)} NTZ
      </StackBox>
    </DetailWrapper>
  </InfoWrapper>
);

SeatInfo.propTypes = {
  amountCoords: PropTypes.array,
  blocky: PropTypes.string,
  dealer: PropTypes.number, // which seat is dealer
  lastAmount: PropTypes.number,
  pos: PropTypes.number, // which position is THIS seat
  signerAddr: PropTypes.string,
  seatStatus: PropTypes.object,
  stackSize: PropTypes.number,
};

export default SeatInfo;
