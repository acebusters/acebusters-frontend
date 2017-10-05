import React from 'react';
import PropTypes from 'prop-types';
import Wrapper from './Wrapper';
import Percent from './Percent';


class ProgressBar extends React.Component {

  static defaultProps = {
    progress: 0,
  };

  constructor(props) {
    super(props);
    this.state = {
      progress: 0,
      timer: null,
    };
  }

  componentDidMount() {
    this.setProgressFromProp(this.props.progress);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.progress !== this.props.progress) {
      this.setProgressFromProp(newProps.progress);
    }
  }

  componentWillUnmount() {
    this.stopTimer();
  }

  setProgressFromProp(_progress) {
    // Note: always stop the old timer before we set any value to progress.
    this.stopTimer();

    let progress = _progress;
    let timer = null;
    const AUTO_STEP = 15;

    // Note: when progress is negative, take its abs as the interval of random increment.
    // And only support negative number less than -10
    // auto increment progress should be at most 99 percent.
    if (progress < -10) {
      // Note: totalTime is in milliseconds
      const totalTime = Math.abs(progress);
      const interval = (AUTO_STEP * totalTime) / 100;

      timer = setInterval(() => {
        const newProgress = this.state.progress + (AUTO_STEP * Math.random());

        this.setState({
          progress: Math.min(99, newProgress),
        });

        // Note: If the auto progress already hits the upper bound,
        // no more need for the timer
        if (newProgress >= 99) {
          clearInterval(timer);
        }
      }, interval);

      progress = 0;
    } else {
      progress = Math.max(0, progress);

      if (progress === 100) {
        timer = setTimeout(() => {
          this.setState({ progress: 0 });
        }, 300);
      }
    }

    // Note: after each all, progress is at least 0.
    this.setState({ progress, timer });
  }

  stopTimer() {
    const { timer } = this.state;

    if (timer) {
      // Note: try both
      clearInterval(timer);
      clearTimeout(timer);
    }
  }

  render() {
    const { progress } = this.state;
    const isHidden = progress === 0 || progress > 100;
    const style = { width: `${Math.max(0, progress)}%` };

    return (
      <Wrapper hidden={isHidden}>
        <Percent style={style} />
      </Wrapper>
    );
  }
}

ProgressBar.propTypes = {
  progress: PropTypes.number,
};

export default ProgressBar;
