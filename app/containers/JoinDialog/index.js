import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Button from '../../components/Button';
import Slider from '../../components/Slider';
import {
  ABI_TOKEN_CONTRACT,
  tokenContractAddress,
} from '../../app.config';

import { makeSbSelector } from '../Table/selectors';
import {
  makeSelectProxyAddr,
} from '../AccountProvider/selectors';

class JoinDialog extends React.Component { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.web3 = this.props.web3Redux.web3;
    this.token = this.web3.eth.contract(ABI_TOKEN_CONTRACT).at(tokenContractAddress);
    this.token.balanceOf.call(this.props.proxyAddr);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  updateAmount(e) {
    const amount = e.target.value;
    this.setState({ amount });
  }

  handleSubmit() {
    const min = this.props.sb * 40;
    const amount = (this.state) ? this.state.amount : min;
    console.log(amount);
    this.props.handleJoin(this.props.pos, amount);
  }

  render() {
    const min = this.props.sb * 40;
    const tableMax = this.props.sb * 200;
    // const balance = this.token.balanceOf(this.props.proxyAddr);
    const max = tableMax;
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
  proxyAddr: PropTypes.string,
  web3Redux: React.PropTypes.any,
};

export default connect(mapStateToProps, mapDispatchToProps)(JoinDialog);
