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

const ButtonJoinSeat = ({ onClickHandler }) => (
  <ButtonWrapper onClick={onClickHandler}>
    <ButtonStyle>
      <ButtonIcon className="fa fa-plus" aria-hidden="true" />
      <ButtonText>Join</ButtonText>
    </ButtonStyle>
  </ButtonWrapper>
);
ButtonJoinSeat.propTypes = {
  onClickHandler: React.PropTypes.func,
};

export default ButtonJoinSeat;
