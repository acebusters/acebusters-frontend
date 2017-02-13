import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import makeSelectAccountData from './selectors';
import { web3Connect } from './actions';

export class AccountProvider extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

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
  children: React.PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.node),
    React.PropTypes.node,
  ]),
  web3Connect: React.PropTypes.func,
};

function mapDispatchToProps(dispatch) {
  return {
    web3Connect: () => dispatch(web3Connect()),
  };
}

const mapStateToProps = createSelector(
  makeSelectAccountData(),
  (formState) => ({ formState })
);

export default connect(mapStateToProps, mapDispatchToProps)(AccountProvider);
