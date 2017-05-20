/**
 * Created by helge on 24.08.16.
 */
import React from 'react';
import { VectorCards } from 'ab-vector-cards';

import { CardWrapper, CardStyle } from '../Seat2/styles';

const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'j', 'q', 'k', 'a'];
const suits = ['clubs', 'diamonds', 'hearts', 'spades'];

function Card(props) {
  const vc = new VectorCards();
  let link;
  const suit = suits[Math.floor(props.cardNumber / 13)];
  const value = values[props.cardNumber % 13];

  if (props.cardNumber >= 0) {
    link = vc.getCardData(props.size, suit, value);
  } else {
    link = vc.getBackData(props.size, '#7A7BB8', '#2E319C');
  }

  // Note: meaning of card numbers
  //  * -1 stands for back side of cards,
  //  * null stands for no card
  //  * > 0  stands for normal cards
  if (!props.folded && props.cardNumber !== null) {
    return (
      <CardWrapper offset={props.offset}>
        <CardStyle
          key={suit + value}
          src={link}
          alt=""
        />
      </CardWrapper>
    );
  }
  return null;
}

Card.propTypes = {
  cardNumber: React.PropTypes.number,
  offset: React.PropTypes.array,
  size: React.PropTypes.number,
  folded: React.PropTypes.bool,
};


export default Card;
