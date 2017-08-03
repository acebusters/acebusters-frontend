/**
* Created by jzobro 20170518
*/
import React from 'react';
import {
  ButtonIcon,
  ButtonStyle,
  ButtonText,
  ButtonWrapper,
  SeatWrapper,
} from './styles';

const ButtonJoinSeat = ({ coords, onClickHandler }) => (
  <SeatWrapper coords={coords}>
    <ButtonWrapper onClick={onClickHandler}>
      <ButtonStyle>
        <ButtonIcon className="fa fa-plus" aria-hidden="true" />
        <ButtonText>Join</ButtonText>
      </ButtonStyle>
    </ButtonWrapper>
  </SeatWrapper>
);

ButtonJoinSeat.propTypes = {
  coords: React.PropTypes.array,
  onClickHandler: React.PropTypes.func,
};

export default ButtonJoinSeat;
