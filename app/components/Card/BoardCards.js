import React from 'react';
import PropTypes from 'prop-types';
import FlipCard from './FlipCard';
import { BoardContainer, BoardCardWrapper } from './styles';

import { boardCardFall } from './constants';
// eslint-disable-next-line react/prefer-stateless-function
class BoardCards extends React.Component {
  static propTypes = {
    board: PropTypes.array.isRequired,
  };

  render() {
    const cardHeight = 50;
    const cardWidth = 37;
    return (
      <BoardContainer id="board">
        {this.props.board.map((cardNumber, i) => (
          <BoardCardWrapper
            key={i}
            animNumber={i}
            height={cardHeight}
            width={cardWidth}
          >
            <FlipCard {...{ animDelay: boardCardFall, cardNumber, cardHeight }} />
          </BoardCardWrapper>
        ))}
      </BoardContainer>
    );
  }
}

export default BoardCards;
