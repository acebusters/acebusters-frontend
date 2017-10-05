import React from 'react';
import PropTypes from 'prop-types';

import Card from '../Card';

import { CardContainer } from './styles';

const cardSize = 48;

const CardsComponent = ({
  holeCards,
  folded,
}) => (
  <CardContainer
    className="card-container"
    empty={holeCards[0] === null || folded}
  >
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
  folded: PropTypes.bool,
  holeCards: PropTypes.array, // array of cards
};

export default CardsComponent;
