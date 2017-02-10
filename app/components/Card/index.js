/**
 * Created by helge on 24.08.16.
 */
import React from 'react';
import { suits, values } from '../../app.config';

function Card(props) {
  const link = `../assets/img/cards/${values[props.cardNumber % 13]}_of_${suits[Math.floor(props.cardNumber / 13)]}.png`;
  return (
    <img key={link} src={link} className="card" alt="" />
  );
}

Card.propTypes = {
  cardNumber: React.PropTypes.number,
};


export default Card;
