import React from 'react';
import PropTypes from 'prop-types';
import Card from 'components/Card';

import { CardFront, CardBack, FlipCardWrapper, FlipCardContainer } from './styles';

// front of card shows suit and number
// back of card shows commom design
// eslint-disable-next-line react/prefer-stateless-function
class FlipCard extends React.Component {
  static propTypes = {
    cardNumber: PropTypes.number.isRequired,
    cardHeight: PropTypes.number.isRequired,
    animDelay: PropTypes.string.isRequired,
  }

  render() {
    const { animDelay, cardHeight, cardNumber } = this.props;
    return (
      <FlipCardContainer>
        <FlipCardWrapper animDelay={animDelay}>
          <CardFront>
            <Card {...{ cardNumber, cardHeight }} />
          </CardFront>
          <CardBack>
            <Card {...{ cardNumber: -1, cardHeight }} />
          </CardBack>
        </FlipCardWrapper>
      </FlipCardContainer>
    );
  }
}

export default FlipCard;
