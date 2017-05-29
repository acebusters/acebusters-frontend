/**
* Created by jzobro 20170524
*/
import React from 'react';

import Card from '../Card';

import { CardContainer } from './styles';

const cardSize = 48;

const CardsComponent = ({
  holeCards,
  folded,
}) => (
  <CardContainer>
    <Card
      cardNumber={holeCards[0]}
      folded={folded}
      size={cardSize}
    />
    <Card
      cardNumber={holeCards[1]}
      folded={folded}
      size={cardSize}
    />
  </CardContainer>
);
CardsComponent.propTypes = {
  folded: React.PropTypes.bool,
  holeCards: React.PropTypes.array, // array of cards
};

export default CardsComponent;
