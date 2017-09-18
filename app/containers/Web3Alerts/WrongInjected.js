import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Wrapper } from './styles';
import { makeSelectOwner } from '../../containers/AccountProvider/selectors';

const WrongInjectedAlert = ({ owner }) => (
  <Wrapper theme="warning">
    <h2>Wrong account</h2>
    <p>
      You can`t send transactions with this account. You should switch to <strong>{owner}</strong>.
    </p>
  </Wrapper>
);

WrongInjectedAlert.propTypes = {
  owner: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  owner: makeSelectOwner(),
});

export default connect(mapStateToProps)(WrongInjectedAlert);

