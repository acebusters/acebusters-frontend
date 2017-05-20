/**
 * Created by helge on 24.08.16.
 */
import React from 'react';
import { VectorCards } from 'ab-vector-cards';
import styled from 'styled-components';

const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'j', 'q', 'k', 'a'];
const suits = ['clubs', 'diamonds', 'hearts', 'spades'];

const CardWrapper = styled.div`
  position: relative;
  margin-left: ${(props) => props.offset[0]}%;
  margin-top: ${(props) => props.offset[1]}%;
  max-width: 100%;
  height: auto;
`;

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
        <img
          key={suit + value}
          src={link}
          className="card"
          alt=""
          style={{ maxWidth: '100%', height: 'auto' }}
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
