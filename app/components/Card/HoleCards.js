import React from 'react';
import PropTypes from 'prop-types';

import Card from '../Card';
import FlipCard from './FlipCard';

import { HoleCardContainer, UpWrapper, DownWrapper } from './styles';

const cardHeight = 48;
const animDelay = '0ms';

const HoleCards = ({ holeCards, folded }) => (
  <HoleCardContainer
    className="card-container"
    empty={holeCards[0] === null || folded}
  >
    {holeCards.map((cardNumber, i) => {
      if (!folded && cardNumber === -1) {
        return (
          <DownWrapper key={i}>
            <Card {...{ cardNumber, cardHeight }} />
          </DownWrapper>
        );
      }
      if (!folded && cardNumber !== null) {
        return (
          <UpWrapper key={i}>
            <FlipCard {...{ animDelay, cardNumber, cardHeight }} />
          </UpWrapper>
        );
      }
      return null;
    })}
  </HoleCardContainer>
);
HoleCards.propTypes = {
  folded: PropTypes.bool,
  holeCards: PropTypes.array, // array of cards
};

export default HoleCards;
