import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Button from '../../components/Button';
import Slider from '../../components/Slider';

import { makeSbSelector } from '../Table/selectors';
import {
  makeSelectProxyAddr,
} from '../AccountProvider/selectors';

class JoinDialog extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  updateAmount(e) {
    const amount = e.target.value;
    this.setState({ amount });
  }

  handleSubmit() {
    const min = this.props.sb * 40;
    const amount = (this.state) ? this.state.amount : min;
    this.props.handleJoin(this.props.pos, amount);
  }

  render() {
    const min = this.props.sb * 40;
    const tableMax = this.props.sb * 200;
    const max = (this.props.balance < tableMax) ? this.props.balance : tableMax;
    return (
      <div>
        <Slider max={max} min={min} step={1} onChange={(e) => this.updateAmount(e)}></Slider>
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
