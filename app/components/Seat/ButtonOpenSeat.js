/**
* Created by jzobro 20170518
*/
import React from 'react';
import PropTypes from 'prop-types';
import {
  ButtonIcon,
  ButtonStyle,
  ButtonText,
  SeatWrapper,
} from './styles';

const styles = {
  width: '66px',
  height: '44px',
  opacity: 0.5,
  marginTop: '20px',
};

const ButtonOpenSeat = ({ coords }) => (
  <SeatWrapper coords={coords}>
    <ButtonStyle style={styles}>
      <ButtonIcon />
      <ButtonText />
    </ButtonStyle>
  </SeatWrapper>
);
ButtonOpenSeat.propTypes = {
  coords: PropTypes.array,
};

export default ButtonOpenSeat;
