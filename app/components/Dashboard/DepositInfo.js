import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import makeSelectAccountData from 'containers/AccountProvider/selectors';
import {
  DEPOSIT_DIALOG,
  FISH_WARNING_DIALOG,
} from 'containers/Modal/constants';
import { modalAdd } from 'containers/App/actions';
import { createIsFishWarnedSelector } from 'containers/Dashboard/selectors';
import Button from '../Button';

class DepositInfo extends React.Component {
  static propTypes = {
    account: PropTypes.shape({ isLocked: PropTypes.bool }),
    isFishWarned: PropTypes.bool.isRequired,
    modalAdd: PropTypes.func.isRequired,
  };
  static defaultProps = {
    account: { isLocked: true },
  }

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.showDepositDialog = this.showDepositDialog.bind(this);
  }

  handleClick() {
    const { isFishWarned, account: { isLocked } } = this.props;
    if (!isFishWarned && isLocked) {
      return this.props.modalAdd({
        modalType: FISH_WARNING_DIALOG,
        modalProps: {
          showDepositDialog: this.showDepositDialog,
        },
      });
    }
    return this.showDepositDialog();
  }

  showDepositDialog() {
    return this.props.modalAdd({
      modalType: DEPOSIT_DIALOG,
      modalProps: {
        account: this.props.account,
      },
    });
  }

  render() {
    return (
      <Button
        data-tour="wallet-address"
        onClick={this.handleClick}
        size="medium"
        style={{ width: '100%' }}
      >
        Address and QR Code
      </Button>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  account: makeSelectAccountData(),
  isFishWarned: createIsFishWarnedSelector(),
});

export default connect(mapStateToProps, {
  modalAdd,
})(DepositInfo);
