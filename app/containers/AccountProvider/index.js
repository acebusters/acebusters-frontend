import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { CONFIRM_DIALOG } from 'containers/Modal/constants';

import {
  makeSelectIsWeb3Connected,
  makeSelectWeb3ErrMsg,
} from './selectors';

import { web3Connect, clearWeb3Error } from './actions';
import { modalAdd, modalDismiss } from '../App/actions';

export class AccountProvider extends React.PureComponent {
  componentDidMount() {
    this.props.web3Connect(); // initiate web3
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.web3ErrMsg !== null
        && nextProps.web3ErrMsg !== this.props.web3ErrMsg) {
      this.props.modalAdd({
        modalType: CONFIRM_DIALOG,
        modalProps: {
          msg: nextProps.web3ErrMsg,
          onSubmit: () => {
            this.props.clearWeb3Error();
            this.props.modalDismiss();
          },
          buttonText: 'OK!',
        },
      });
    } else if (!nextProps.isWeb3Connected
              && nextProps.isWeb3Connected !== this.props.isWeb3Connected) {
      this.props.modalAdd({
        modalType: CONFIRM_DIALOG,
        modalProps: {
          msg: 'Connection Lost. Please try to refresh the page.',
          onSubmit: this.props.modalDismiss,
          buttonText: 'OK!',
        },
      });
    }
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
  web3ErrMsg: PropTypes.string,
  isWeb3Connected: PropTypes.bool,
  clearWeb3Error: PropTypes.func,
  modalAdd: PropTypes.func,
  modalDismiss: PropTypes.func,
};

function mapDispatchToProps(dispatch) {
  return {
    web3Connect: () => dispatch(web3Connect()),
    clearWeb3Error: () => dispatch(clearWeb3Error()),
    modalAdd: (payload) => dispatch(modalAdd(payload)),
    modalDismiss: () => dispatch(modalDismiss()),
  };
}

// makeSelectIsWeb3Connected,
// makeSelectWeb3ErrMsg,
const mapStateToProps = createStructuredSelector({
  isWeb3Connected: makeSelectIsWeb3Connected(),
  web3ErrMsg: makeSelectWeb3ErrMsg(),
});

export default connect(mapStateToProps, mapDispatchToProps)(AccountProvider);
