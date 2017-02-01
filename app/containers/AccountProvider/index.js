/*
 *
 * AccountProvider
 *
 * this component an account object for the whole app
 */

import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import makeSelectAccountData from './selectors';

export class AccountProvider extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        {React.Children.only(this.props.children)}
      </div>
    );
  }
}

AccountProvider.propTypes = {
  privKey: React.PropTypes.string,
};

const mapStateToProps = createSelector(
  makeSelectAccountData(),
  (accountState) => ({ accountState })
);

export default connect(mapStateToProps)(AccountProvider);
