import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import H2 from '../../components/H2';
import SubmitButton from '../../components/SubmitButton';

import { modalDismiss } from './actions';

function UnsupportedBrowser({ onClose }) {
  return (
    <div>
      <H2>Your browser is not supported</H2>
      <p>Some features may not work as intended, and you will not be able to upgrade and secure your account. For an optimal experience, please change to a supported browser.</p>
      <p>Supported browsers: Chrome (Desktop), Opera (Desktop), Edge, Firefox (Desktop and Android) and Mist</p>
      <SubmitButton onClick={onClose}>
        Got it
      </SubmitButton>
    </div>
  );
}

UnsupportedBrowser.propTypes = {
  onClose: PropTypes.func,
};

export default connect(null, {
  onClose: modalDismiss,
})(UnsupportedBrowser);
