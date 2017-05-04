import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import {
  makeSelectIsWeb3Connected,
  makeSelectWeb3ErrMsg,
} from './selectors';

import { web3Connect, clearWeb3Error } from './actions';
import { modalAdd, modalDismiss } from '../App/actions';
import Button from '../../components/Button';

export class AccountProvider extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
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
          <Button onClick={() => { this.props.clearWeb3Error(); this.props.modalDismiss(); }}>
            OK!
          </Button>
        </div>
      ));
    } else if (!nextProps.isWeb3Connected
              && nextProps.isWeb3Connected !== this.props.isWeb3Connected) {
      this.props.modalAdd((
        <div>
          <p>
            Connection Lost. Please try to refresh the page.
          </p>
          <Button onClick={this.props.modalDismiss}>OK!</Button>
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
  children: React.PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.node),
    React.PropTypes.node,
  ]),
  web3Connect: React.PropTypes.func,
  web3ErrMsg: React.PropTypes.string,
  isWeb3Connected: React.PropTypes.bool,
  clearWeb3Error: React.PropTypes.func,
  modalAdd: React.PropTypes.func,
  modalDismiss: React.PropTypes.func,
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
