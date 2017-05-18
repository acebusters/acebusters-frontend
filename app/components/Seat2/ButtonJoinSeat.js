/**
* Created by jzobro 20170518
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
      <ButtonIcon className="fa fa-plus" aria-hidden="true" />
      <ButtonText>Join</ButtonText>
    </ButtonStyle>
  </ButtonWrapper>
);

export default ButtonJoinSeat;
