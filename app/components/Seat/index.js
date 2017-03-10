/**
 * Created by helge on 15.02.17.
 */

import React from 'react';
import Card from '../Card'; // eslint-disable-line
import { SeatWrapper, ImageContainer, CardContainer, DealerButton } from './SeatWrapper';
import { ActionBox, StackBox } from './Info';

function SeatComponent(props) {
  let seat = null;
  if (props.open) {
    seat = (
      <SeatWrapper coords={props.coords}>
        <ImageContainer whosTurn={props.whosTurn} open={props.open} onClick={props.onClick} >
          { !props.myPos ? 'JOIN' : 'EMPTY' }
        </ImageContainer>
      </SeatWrapper>
      );
  } else {
    seat = (
      <SeatWrapper {...props}>
        <ImageContainer {...props}>
          <DealerButton {...props}></DealerButton>
          <div>{ props.lastAction } </div>
        </ImageContainer>
        <CardContainer>
          <Card cardNumber={props.cards[0]} folded={props.folded}></Card>
          <Card cardNumber={props.cards[1]} folded={props.folded}></Card>
          <ActionBox {...props}> { (props.lastAmount > 0) ? props.lastAmount : '' }</ActionBox>
          <StackBox {...props}> { (props.stackSize > 0) ? props.stackSize : '' }</StackBox>
        </CardContainer>
      </SeatWrapper>
    );
  }
  return seat;
}

SeatComponent.propTypes = {
  pos: React.PropTypes.number,
  hand: React.PropTypes.object,
  cards: React.PropTypes.array,
  lastAction: React.PropTypes.string,
  lastAmount: React.PropTypes.number,
  folded: React.PropTypes.bool,
};

export default SeatComponent;
