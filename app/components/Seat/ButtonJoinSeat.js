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

const ButtonJoinSeat = ({ coords, onClickHandler, pending }) => {
  const iconType = pending ? 'fa fa-refresh fa-spin' : 'fa fa-plus';
  const message = pending ? 'Pending' : 'Join';
  return (
    <SeatWrapper coords={coords}>
      <ButtonWrapper onClick={onClickHandler}>
        <ButtonStyle pending={pending}>
          <ButtonIcon className={iconType} aria-hidden="true" />
          <ButtonText>{message}</ButtonText>
        </ButtonStyle>
      </ButtonWrapper>
    </SeatWrapper>
  );
};
ButtonJoinSeat.propTypes = {
  coords: React.PropTypes.array,
  onClickHandler: React.PropTypes.func,
  pending: React.PropTypes.bool,
};

export default ButtonJoinSeat;
