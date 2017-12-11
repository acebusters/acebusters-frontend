import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { makeSelectWeb3ErrMsg } from './selectors';
import { web3Connect } from './actions';

export class AccountProvider extends React.PureComponent {
  componentDidMount() {
    this.props.web3Connect(); // initiate web3
  }

  render() {
    return (
      <div>
        {React.Children.only(this.props.children)}
      </div>
    );
  }
}

AccountProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  web3Connect: PropTypes.func,
};

function mapDispatchToProps(dispatch) {
  return {
    web3Connect: () => dispatch(web3Connect()),
  };
}

const mapStateToProps = createStructuredSelector({
  web3ErrMsg: makeSelectWeb3ErrMsg(),
});

export default connect(mapStateToProps, mapDispatchToProps)(AccountProvider);
