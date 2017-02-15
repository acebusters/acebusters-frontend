/**
 * Created by helge on 15.02.17.
 */

import React from 'react';
import Card from '../Card'; // eslint-disable-line
import { SeatWrapper, ImageContainer, InfoContainer, CardContainer } from './SeatWrapper';
import { InfoBox } from './Info';

function SeatComponent(props) {
  return (
    <SeatWrapper>
      <ImageContainer {...props}></ImageContainer>
      <InfoContainer>
        <InfoBox>alias: </InfoBox>
        <InfoBox>stack: {props.lastAmount}</InfoBox>
      </InfoContainer>
      <CardContainer>
        <Card cardNumber={props.cards[0]}></Card>
        <Card cardNumber={props.cards[1]}></Card>
      </CardContainer>
    </SeatWrapper>
  );
}

SeatComponent.propTypes = {
  cards: React.PropTypes.array,
  lastAmount: React.PropTypes.number,
};

export default SeatComponent;
