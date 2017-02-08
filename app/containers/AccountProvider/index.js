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
  children: React.PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.node),
    React.PropTypes.node,
  ]),
};

const mapStateToProps = createSelector(
  makeSelectAccountData(),
  (formState) => ({ formState })
);

export default connect(mapStateToProps)(AccountProvider);
