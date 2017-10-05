import React from 'react';
import PropTypes from 'prop-types';
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
  coords: PropTypes.array,
  onClickHandler: PropTypes.func,
};

export default ButtonJoinSeat;
