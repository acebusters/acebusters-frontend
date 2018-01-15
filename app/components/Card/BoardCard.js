import React from 'react';
import PropTypes from 'prop-types';

import Card from './';
import { CardContainer, BoardFront, BoardBack } from './styles';

// eslint-disable-next-line react/prefer-stateless-function
class BoardCard extends React.Component {
  static propTypes = {
    animNum: PropTypes.number.isRequired,
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
    this.setState({ leaving: true, entered: false });
    setTimeout(callback, 1500);
  }

  render() {
    const { cardHeight, cardWidth, cardNumber, animNum } = this.props;
    const wrapperProps = { ...this.state, cardHeight, cardWidth, animNum };

    return (
      <CardContainer cardWidth={cardWidth} cardHeight={cardHeight}>
        <BoardFront {...wrapperProps}>
          <Card cardNumber={cardNumber} cardHeight={cardHeight} />
        </BoardFront>
        <BoardBack {...wrapperProps}>
          <Card cardNumber={-1} cardHeight={cardHeight} />
        </BoardBack>
      </CardContainer>
    );
  }
}

export default BoardCard;
