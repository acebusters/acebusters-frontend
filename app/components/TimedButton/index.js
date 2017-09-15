import React from 'react';
import PropTypes from 'prop-types';
import Button from '../Button';

export default class TimedButton extends React.Component {

  static propTypes = {
    until: PropTypes.number.isRequired,
    disabled: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.setupTimeout(props.until);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.until !== this.props.until) {
      this.setupTimeout(nextProps.until);
    }
  }

  componentWillUnmount() {
    clearInterval(this.timeout);
  }

  setupTimeout(until) {
    if (this.timeout) {
      clearInterval(this.timeout);
    }

    const delta = Math.ceil((until * 1000) - Date.now());

    if (delta > 0) {
      this.timeout = setTimeout(() => {
        this.forceUpdate();
      }, delta);
    }
  }

  render() {
    const { until, disabled, ...props } = this.props;
    return (
      <Button
        disabled={(until >= (Date.now() / 1000)) || disabled}
        {...props}
      />
    );
  }
}
