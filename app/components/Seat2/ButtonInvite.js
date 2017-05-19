/**
* Created by jzobro 20170519
*/
import React from 'react';
import {
  ButtonIcon,
  ButtonStyle,
  ButtonText,
  ButtonWrapper,
} from './styles';

const ButtonJoinSeat = () => (
  <ButtonWrapper>
    <ButtonStyle>
      <ButtonIcon className="fa fa-envelope" aria-hidden="true" />
      <ButtonText>Invite</ButtonText>
    </ButtonStyle>
  </ButtonWrapper>
);

export default ButtonJoinSeat;
