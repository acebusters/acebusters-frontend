/**
* Created by jzobro 20170518
*/
import React from 'react';
import {
  ButtonIcon,
  ButtonText,
  ButtonWrapper,
  StyledWrapper,
} from './styles';

const ButtonJoinSeat = () => (
  <ButtonWrapper>
    <StyledWrapper>
      <ButtonIcon className="fa fa-plus" aria-hidden="true" />
      <ButtonText>Join</ButtonText>
    </StyledWrapper>
  </ButtonWrapper>
);

export default ButtonJoinSeat;
