import React from 'react';
import PropTypes from 'prop-types';
import TransitionGroup from 'react-addons-transition-group';

import Card from '../Card';
import HoleCard from './HoleCard';

import { HoleCardContainer, UpWrapper, DownWrapper } from './styles';

const cardHeight = 48;
const cardWidth = 36;

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
            <TransitionGroup>
              <HoleCard {...{ cardNumber, cardHeight, cardWidth }} />
            </TransitionGroup>
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
