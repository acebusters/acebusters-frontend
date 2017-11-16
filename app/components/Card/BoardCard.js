import React from 'react';
import PropTypes from 'prop-types';
import { TweenMax, TimelineLite } from 'gsap';
import Card from 'components/Card';

// eslint-disable-next-line react/prefer-stateless-function
class BoardCard extends React.Component {
  static propTypes = {
    animNum: PropTypes.number.isRequired,
    cardNumber: PropTypes.number.isRequired,
    cardHeight: PropTypes.number.isRequired,
    cardWidth: PropTypes.number.isRequired,
  }

  componentDidMount() {
    TweenMax.set(this.front, { rotationY: 180 });
    this.tl = new TimelineLite();
    this.timeline();
  }

  animDelay(animNum) {
    let delay = 0.3;
    if (animNum <= 2) {
      delay += (animNum * 0.3);
    }
    return delay;
  }

  timeline() {
    const delay = this.animDelay(this.props.animNum);
    this.tl.fromTo(
      this.wrap,
      delay,
      { y: -400, opacity: 0.3 },
      { y: 0, opacity: 1 },
    );
    this.tl.to(this.front, 0.6, { rotationY: 0 }, 'flip');
    this.tl.to(this.back, 0.6, { rotationY: 180 }, 'flip');
    this.tl.addPause('leave');
    this.tl.to(this.front, 0.6, { rotationY: 180 }, 'flop');
    this.tl.to(this.back, 0.6, { rotationY: 0 }, 'flop');
    this.tl.fromTo(
      this.wrap,
      0.6,
      { y: 0, opacity: 1 },
      { y: -400, opacity: 0, immediateRender: false },
    );
  }

  componentWillEnter(callback) {
    const timeout = (this.animDelay(this.props.animNum) + 0.6) * 1000;
    this.tl.play();
    setTimeout(() => {
      callback();
    }, timeout);
  }

  componentWillLeave(callback) {
    const timeout = 1200;
    this.tl.resume('leave');
    setTimeout(() => {
      callback();
    }, timeout);
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

export default BoardCard;
