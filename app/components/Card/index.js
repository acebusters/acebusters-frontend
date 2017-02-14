/**
 * Created by helge on 24.08.16.
 */
import React from 'react';
import { VectorCards } from 'ab-vector-cards';

const values = ['2', '3', '4', '5', '6', '7', '8', '9', 't', 'j', 'q', 'k', 'a'];
const suits = ['clubs', 'diamonds', 'hearts', 'spades'];

function Card(props) {
  const suit = suits[Math.floor(props.cardNumber / 13)];
  const value = values[props.cardNumber % 13];
  const link = vc.getCardData(60, suit, value);
  return (
    <img key={suit+value} src={link} className="card" alt="" />
  );
}

Card.propTypes = {
  cardNumber: React.PropTypes.number,
};


export default Card;
