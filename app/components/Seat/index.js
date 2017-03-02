/**
 * Created by helge on 15.02.17.
 */

import React from 'react';
import Card from '../Card'; // eslint-disable-line
import { SeatWrapper, ImageContainer, InfoContainer, CardContainer, DealerButton } from './SeatWrapper';
import { InfoBox, ActionBox } from './Info';

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
        <InfoContainer>
          <InfoBox> { props.hand.lineup[props.pos].address.substring(0, 8) }</InfoBox>
          <InfoBox> { props.hand.lineup[props.pos].amount } </InfoBox>
          <ActionBox {...props}> { (props.lastAmount > 0) ? props.lastAmount : '' }</ActionBox>
        </InfoContainer>
        <CardContainer>
          <Card cardNumber={props.cards[0]} folded={props.folded}></Card>
          <Card cardNumber={props.cards[1]} folded={props.folded}></Card>
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
