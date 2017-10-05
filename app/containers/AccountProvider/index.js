import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import {
  makeSelectIsWeb3Connected,
  makeSelectWeb3ErrMsg,
} from './selectors';

import { web3Connect, clearWeb3Error } from './actions';
import { modalAdd, modalDismiss } from '../App/actions';
import SubmitButton from '../../components/SubmitButton';

export class AccountProvider extends React.PureComponent {
  componentDidMount() {
    this.props.web3Connect(); // initiate web3
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.web3ErrMsg !== null
        && nextProps.web3ErrMsg !== this.props.web3ErrMsg) {
      this.props.modalAdd((
        <div>
          <p>
            {nextProps.web3ErrMsg}
          </p>
          <SubmitButton onClick={() => { this.props.clearWeb3Error(); this.props.modalDismiss(); }}>
            OK!
          </SubmitButton>
        </div>
      ));
    } else if (!nextProps.isWeb3Connected
              && nextProps.isWeb3Connected !== this.props.isWeb3Connected) {
      this.props.modalAdd((
        <div>
          <p>
            Connection Lost. Please try to refresh the page.
          </p>
          <SubmitButton onClick={this.props.modalDismiss}>OK!</SubmitButton>
        </div>
      ));
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
    modalAdd: (node) => dispatch(modalAdd(node)),
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
