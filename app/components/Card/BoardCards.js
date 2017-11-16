import React from 'react';
import PropTypes from 'prop-types';
import TransitionGroup from 'react-addons-transition-group';
import BoardCard from './BoardCard';
import { BoardContainer } from './styles';

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
        <TransitionGroup style={{ display: 'flex' }}>
          {this.props.board.map((cardNumber, i) => (
            <BoardCard
              {...{
                key: i,
                animNum: i,
                cardNumber,
                cardHeight,
                cardWidth,
              }}
            />
          ))}
        </TransitionGroup>
      </BoardContainer>
    );
  }
}

export default BoardCards;
