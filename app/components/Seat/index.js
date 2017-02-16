/**
 * Created by helge on 15.02.17.
 */

import React from 'react';
import Card from '../Card'; // eslint-disable-line
import { SeatWrapper, ImageContainer, InfoContainer, CardContainer, DealerButton } from './SeatWrapper';
import { InfoBox } from './Info';

function SeatComponent(props) {
  return (
    <SeatWrapper>
      <ImageContainer {...props}>
        <DealerButton {...props}></DealerButton>
      </ImageContainer>
      <InfoContainer>
        <InfoBox> { props.hand.lineup[props.pos].address.substring(0, 8) }</InfoBox>
        <InfoBox> { props.lastAction } </InfoBox>
      </InfoContainer>
      <CardContainer>
        <Card cardNumber={props.cards[0]}></Card>
        <Card cardNumber={props.cards[1]}></Card>
      </CardContainer>
    </SeatWrapper>
  );
}

SeatComponent.propTypes = {
  pos: React.PropTypes.number,
  hand: React.PropTypes.object,
  cards: React.PropTypes.array,
  lastAction: React.PropTypes.string,
};

export default SeatComponent;
