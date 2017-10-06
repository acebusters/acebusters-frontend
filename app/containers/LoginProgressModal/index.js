import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form/immutable';
import Radial from '../../components/RadialProgress';

export function LoginProgressWrapper(props) {
  return (
    <div>
      <h2>Waiting to login ... </h2>
      <Radial progress={props.progress}></Radial>
    </div>
  );
}

LoginProgressWrapper.propTypes = {
  progress: PropTypes.any,
};

const selector = formValueSelector('login');
const mapStateToProps = (state) => ({
  progress: selector(state, 'workerProgress'),
});

export default connect(mapStateToProps)(LoginProgressWrapper);
