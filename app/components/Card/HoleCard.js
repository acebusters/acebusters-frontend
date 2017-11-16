import React from 'react';
import PropTypes from 'prop-types';
import { TweenMax, TimelineLite } from 'gsap';
import Card from 'components/Card';

// eslint-disable-next-line react/prefer-stateless-function
class HoleCard extends React.Component {
  static propTypes = {
    cardNumber: PropTypes.number.isRequired,
    cardHeight: PropTypes.number.isRequired,
    cardWidth: PropTypes.number.isRequired,
  }

  componentDidMount() {
    TweenMax.set(this.front, { rotationY: 180 });
    this.tl = new TimelineLite();
    this.timeline();
  }

  timeline() {
    this.tl.to(this.front, 1, { rotationY: 0 }, 'flip');
    this.tl.to(this.back, 1, { rotationY: 180 }, 'flip');
    this.tl.addPause('leave');
    this.tl.to(this.front, 1, { rotationY: 180 }, 'flop');
    this.tl.to(this.back, 1, { rotationY: 0 }, 'flop');
  }

  componentWillEnter(callback) {
    this.tl.play();
    setTimeout(() => {
      callback();
    }, 1000);
  }

  componentWillLeave(callback) {
    this.tl.resume('leave');
    setTimeout(() => {
      callback();
    }, 1000);
  }

  render() {
    const { cardHeight, cardWidth, cardNumber } = this.props;
    const styles = {
      cont: {
        marginLeft: '0.5em',
        height: cardHeight,
        width: cardWidth,
        position: 'relative',
      },
      wrapper: {
        position: 'absolute',
        height: cardHeight,
        width: cardWidth,
        backfaceVisibility: 'hidden',
      },
    };
    return (
      <div style={styles.cont} ref={(c) => { this.wrap = c; }}>
        <div style={styles.wrapper} ref={(c) => { this.front = c; }}>
          <Card {...{ cardNumber, cardHeight }} />
        </div>
        <div style={styles.wrapper} ref={(c) => { this.back = c; }}>
          <Card {...{ cardNumber: -1, cardHeight }} />
        </div>
      </div>
    );
  }
}

export default HoleCard;
