/**
 * Created by helge on 24.08.16.
 */
import React from 'react';
import { VectorCards } from 'ab-vector-cards';

const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'j', 'q', 'k', 'a'];
const suits = ['clubs', 'diamonds', 'hearts', 'spades'];

function Card(props) {
  const vc = new VectorCards();
  let link;
  const suit = suits[Math.floor(props.cardNumber / 13)];
  const value = values[props.cardNumber % 13];
  if (props.cardNumber >= 0) {
    link = vc.getCardData(60, suit, value);
  } else {
    link = vc.getBackData(60, '#7A7BB8', '#2E319C');
  }

  return (
    <img key={suit + value} src={link} className="card" alt="" />
  );
}

Card.propTypes = {
  cardNumber: React.PropTypes.number,
};


export default Card;
