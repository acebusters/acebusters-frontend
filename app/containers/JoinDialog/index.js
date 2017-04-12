import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css';
import { createStructuredSelector } from 'reselect';
import Button from '../../components/Button';

import { makeSbSelector } from '../Table/selectors';
import {
  makeSelectProxyAddr,
} from '../AccountProvider/selectors';

class JoinDialog extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.state = {
      amount: props.sb * 40,
    };
    this.updateAmount = this.updateAmount.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  updateAmount(value) {
    const amount = value;
    this.setState({ amount });
  }

  handleSubmit() {
    this.props.handleJoin(this.props.pos, this.state.amount);
  }

  render() {
    const min = this.props.sb * 40;
    const tableMax = this.props.sb * 200;
    const max = (this.props.balance < tableMax) ? this.props.balance : tableMax;
    return (
      <div style={{ minWidth: '20em' }}>
        <Slider
          data-orientation="vertical"
          value={this.state.amount}
          tooltip={false}
          min={min}
          max={max}
          step={1}
          onChange={this.updateAmount}
        >
        </Slider>
        <div> Max: {max}</div>
        <div>{ (this.state) ? this.state.amount : min }</div>
        <Button onClick={this.handleSubmit}>Join</Button>
      </div>
    );
  }
}


function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const mapStateToProps = createStructuredSelector({
  sb: makeSbSelector(),
  proxyAddr: makeSelectProxyAddr(),
});

JoinDialog.propTypes = {
  handleJoin: PropTypes.func,
  pos: PropTypes.any,
  sb: PropTypes.number,
  balance: React.PropTypes.string,
};

export default connect(mapStateToProps, mapDispatchToProps)(JoinDialog);
