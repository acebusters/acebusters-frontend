/* Replaced by ButtonOpenSeat until Invite process is complete */
import React from 'react';
import PropTypes from 'prop-types';
import {
  ButtonIcon,
  ButtonStyle,
  ButtonText,
  ButtonWrapper,
  SeatWrapper,
} from './styles';

const ButtonInvite = ({ coords, onClickHandler }) => (
  <SeatWrapper className="seat-wrapper" coords={coords}>
    <ButtonWrapper className="button-wrapper" onClick={onClickHandler}>
      <ButtonStyle>
        <ButtonIcon className="fa fa-envelope" aria-hidden="true" />
        <ButtonText>Invite</ButtonText>
      </ButtonStyle>
    </ButtonWrapper>
  </SeatWrapper>
);
ButtonInvite.propTypes = {
  onClickHandler: PropTypes.func,
  coords: PropTypes.array,
};

export default ButtonInvite;
