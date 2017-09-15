import React from 'react';
import PropTypes from 'prop-types';

import { ETH } from '../../containers/Dashboard/actions';
import { conf } from '../../app.config';
import TransferDialog from '../../containers/TransferDialog';

import H2 from '../H2';

import {
  Pane,
  Section,
  SendContainer,
  TabIcon as ModeIcon,
} from './styles';
import { AccountIsLocked, AccountNotLocked } from './SectionReceive';

class Wallet extends React.Component {

  constructor(props) {
    super(props);

    this.handleChangelyClick = this.handleChangellyClick.bind(this);
  }

  handleChangellyClick(e) {
    e.preventDefault();
    window.open(e.currentTarget.href, 'Changelly', 'width=600,height=470,toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=0,left=0,top=0');
  }

  render() {
    const {
      account,
      // babzBalance,
      ethBalance,
      nutzBalance,
      handleNTZTransfer,
      handleETHTransfer,
      amountUnit,
      // weiBalance,
    } = this.props;

    return (
      <Pane name="dashboard-wallet">
        <Section
          style={{ alignSelf: 'center', maxWidth: 480 }}
          name="wallet-receive"
        >
          <H2><ModeIcon className="fa fa-inbox" />Deposit</H2>
          {account.isLocked ?
            <AccountIsLocked {...this.props} />
            :
            <AccountNotLocked {...this.props} />
          }

          <a
            onClick={this.handleChangellyClick}
            href={`https://changelly.com/widget/v1?auth=email&from=BTC&to=ETH&merchant_id=${conf().changellyMerchantId}&address=${account.proxy}&amount=1&ref_id=${conf().changellyMerchantId}&color=cf0000`}
          >
            <img src="https://changelly.com/pay_button.png" alt="Changelly" />
          </a>
        </Section>

        <Section name="wallet-send">
          <H2><ModeIcon className="fa fa-send" />Transfer</H2>
          <SendContainer>
            {amountUnit === ETH ?
              <TransferDialog
                handleTransfer={handleETHTransfer}
                maxAmount={ethBalance}
                type="token"
                placeholder="0.00"
                {...this.props}
              />
              :
              <TransferDialog
                handleTransfer={handleNTZTransfer}
                maxAmount={nutzBalance}
                type="token"
                placeholder="0"
                {...this.props}
              />
            }
          </SendContainer>
        </Section>
      </Pane>
    );
  }

}

Wallet.propTypes = {
  account: PropTypes.object,
  ethBalance: PropTypes.object,
  nutzBalance: PropTypes.object,
  handleNTZTransfer: PropTypes.func,
  handleETHTransfer: PropTypes.func,
  amountUnit: PropTypes.string,
};

export default Wallet;
