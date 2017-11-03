import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedNumber } from 'react-intl';

import { makeSelectIsLocked } from '../AccountProvider/selectors';

import Alert from '../../components/Alert';

class EstimateWarning extends React.Component {
  static propTypes = {
    estimate: PropTypes.func.isRequired,
    args: PropTypes.array.isRequired,
    isLocked: PropTypes.bool,
  };

  static defaultProps = {
    args: [],
  };

  constructor(props) {
    super(props);

    this.state = {
      gas: null,
    };

    this.runEstimate(props.estimate, props.args);
  }

  componentWillReceiveProps(props) {
    if (props.estimate !== this.props.estimate || props.args !== this.props.args) {
      this.runEstimate(props.estimate, props.args);
    }
  }

  runEstimate(estimate, args) {
    if (!this.props.isLocked) {
      estimate(...args).then((gas) => this.setState({ gas }));
    }
  }

  render() {
    const { isLocked } = this.props;
    const { gas } = this.state;

    if (isLocked || !gas) {
      return null;
    }

    return (
      <Alert>
        Be sure to give at least <FormattedNumber value={gas} /> gas limit for your transaction.
        Otherwise&nbsp;transaction can fail
      </Alert>
    );
  }
}

export default connect((state) => ({
  isLocked: makeSelectIsLocked()(state),
}))(EstimateWarning);
