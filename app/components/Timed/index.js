import React from 'react';
import PropTypes from 'prop-types';

export default class Timed extends React.Component {

  static propTypes = {
    until: PropTypes.number.isRequired,
    children: PropTypes.any,
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
    if (this.props.until >= (Date.now() / 1000)) {
      return null;
    }

    return this.props.children;
  }
}
