import React from 'react';
import PropTypes from 'prop-types';
import { VectorCards } from 'ab-vector-cards';

import { CardStyle } from './styles';

const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'j', 'q', 'k', 'a'];
const suits = ['clubs', 'diamonds', 'hearts', 'spades'];

const Card = ({ cardNumber, cardHeight }) => {
  const vc = new VectorCards();
  const suit = suits[Math.floor(cardNumber / 13)];
  const value = values[cardNumber % 13];
  const link = cardNumber === null || cardNumber < 0
    ? vc.getBackData(cardHeight, '#32B7D3', '#217C8F')
    : vc.getCardData(cardHeight, suit, value);
  // Note: meaning of card numbers
  //  * -1 stands for back side of cards,
  //  * null stands for no card
  //  * > 0  stands for normal cards
  return <CardStyle key={suit + value} src={link} alt="" />;
};
Card.propTypes = {
  cardNumber: PropTypes.number.isRequired,
  cardHeight: PropTypes.number.isRequired,
};

export default Card;
