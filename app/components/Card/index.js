/**
 * Created by helge on 24.08.16.
 */
import React from 'react';
import { VectorCards } from 'ab-vector-cards';

import { CardBack, CardFront, CardStyle } from '../Seat/styles';

const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'j', 'q', 'k', 'a'];
const suits = ['clubs', 'diamonds', 'hearts', 'spades'];

function Card(props) {
  const vc = new VectorCards();
  let link;
  const suit = suits[Math.floor(props.cardNumber / 13)];
  const value = values[props.cardNumber % 13];

  // Note: meaning of card numbers
  //  * -1 stands for back side of cards,
  //  * null stands for no card
  //  * > 0  stands for normal cards
  if (!props.folded && props.cardNumber === -1) {
    link = vc.getBackData(props.size, '#32B7D3', '#217C8F');
    return (
      // TODO: remove offset prop and from CardShared style?
      <CardBack>
        <CardStyle
          key={suit + value}
          src={link}
          alt=""
        />
      </CardBack>
    );
  }
  if (!props.folded && props.cardNumber !== null) {
    link = vc.getCardData(props.size, suit, value);
    return (
      // TODO: remove offset prop and from CardShared style?
      <CardFront>
        <CardStyle
          key={suit + value}
          src={link}
          alt=""
        />
      </CardFront>
    );
  }
  return null;
}

Card.propTypes = {
  cardNumber: React.PropTypes.number,
  size: React.PropTypes.number,
  folded: React.PropTypes.bool,
};

export default Card;
