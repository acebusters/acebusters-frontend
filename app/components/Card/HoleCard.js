import React from 'react';
import PropTypes from 'prop-types';

import Card from './';
import { CardContainer, HoleFront, HoleBack } from './styles';

// eslint-disable-next-line react/prefer-stateless-function
class HoleCard extends React.Component {
  static propTypes = {
    cardNumber: PropTypes.number.isRequired,
    cardHeight: PropTypes.number.isRequired,
    cardWidth: PropTypes.number.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      leaving: false,
    };
  }

  componentWillLeave(callback) {
    this.setState({ leaving: true });
    setTimeout(callback, 400);
  }

  render() {
    const { cardHeight, cardWidth, cardNumber } = this.props;
    const wrapperProps = { ...this.state, cardHeight, cardWidth };

    return (
      <CardContainer cardWidth={cardWidth} cardHeight={cardHeight}>
        <HoleFront {...wrapperProps}>
          <Card cardNumber={cardNumber} cardHeight={cardHeight} />
        </HoleFront>
        <HoleBack {...wrapperProps}>
          <Card cardNumber={-1} cardHeight={cardHeight} />
        </HoleBack>
      </CardContainer>
    );
  }
}

export default HoleCard;
