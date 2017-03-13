/**
 * Created by helge on 15.02.17.
 */

import React from 'react';
import Card from '../Card'; // eslint-disable-line
import { SeatWrapper, ImageContainer, CardContainer, DealerButton, SeatLabel } from './SeatWrapper';
import { ActionBox, StackBox } from './Info';

function SeatComponent(props) {
  const cardSize = (props.computedStyles && props.computedStyles.d < 600) ? 25 : 40;
  let seat = null;
  if (props.open) {
    seat = (
      <SeatWrapper coords={props.coords} comuptedStyles={props.computedStyles}>
        <ImageContainer {...props} >
          <SeatLabel computedStyles={props.computedStyles}>
            { !props.myPos ? 'JOIN' : 'EMPTY' }
          </SeatLabel>
        </ImageContainer>
      </SeatWrapper>
      );
  } else {
    seat = (
      <SeatWrapper coords={props.coords} {...props} comuptedStyles={props.computedStyles}>
        <ImageContainer {...props}>
          <DealerButton {...props}></DealerButton>
          <div>{ props.lastAction } </div>
        </ImageContainer>
        <CardContainer>
          <Card cardNumber={props.cards[0]} folded={props.folded} size={cardSize}></Card>
          <Card cardNumber={props.cards[1]} folded={props.folded} size={cardSize}></Card>
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
