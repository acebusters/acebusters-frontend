import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { formatEth } from '../../utils/amountFormatter';
import { conf } from '../../app.config';

import A from '../A';
import H2 from '../H2';
import List from '../List';

import Economy from './Economy';
import ETHPayout from './ETHPayout';
import ABPPayout from './ABPPayout';
import Refs from './Refs';
import { Pane, SectionOverview, Subtitle } from './styles';

const Overview = (props) => {
  const {
    account, listTxns, messages,
    downs, downtime, abpPayoutPending, handleABPPayout, estimateABPPayout,
    ethAllowance, ethPayoutDate, ethPayoutPending, handleETHPayout, estimateETHPayout,
  } = props;
  const emptyColumnStyle = { width: 20 };

  return (
    <Pane name="dashboard-overview">
      <SectionOverview
        name="account-info"
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div style={{ margin: '1em' }}>
          <strong>Account email:</strong>&nbsp;{account.email}
        </div>
      </SectionOverview>

      {account.refs && account.refs.length &&
        <Refs
          refs={account.refs}
          messages={messages}
        />
      }

      {ethAllowance && ethAllowance.toNumber() > 0 && ethPayoutDate &&
        <ETHPayout
          payoutDate={ethPayoutDate}
          pending={ethPayoutPending}
          handlePayout={handleETHPayout}
          estimatePayout={estimateETHPayout}
          amount={formatEth(ethAllowance)}
          messages={messages}
        />
      }

      {!account.isLocked && downs && downtime && downs[0].toNumber() > 0 &&
        <ABPPayout
          downs={downs}
          downtime={downtime}
          pending={abpPayoutPending}
          handlePayout={handleABPPayout}
          estimatePayout={estimateABPPayout}
          messages={messages}
        />
      }

      <SectionOverview name="economy">
        <H2><FormattedMessage {...messages.economyTitle} /></H2>
        <Economy {...props} />
      </SectionOverview>

      <SectionOverview name="transaction-history">
        <H2><FormattedMessage {...messages.included} /></H2>
        <Subtitle>
          <A href={`${conf().etherscanUrl}address/${conf().ntzAddr}`} target="_blank">
            Nutz contract on etherscan
          </A>
        </Subtitle>
        <List
          items={listTxns}
          headers={[
            '',
            'Address',
            'Date',
            '',
            'Amount',
            '',
          ]}
          columnsStyle={{
            0: emptyColumnStyle,
            1: { textAlign: 'left', width: 10, whiteSpace: 'nowrap' },
            2: emptyColumnStyle,
            3: { textAlign: 'left', whiteSpace: 'nowrap' },
            4: { textAlign: 'right', whiteSpace: 'nowrap' },
            5: { width: '100%', textAlign: 'left' },
          }}
          noDataMsg="No Transactions Yet"
        />
      </SectionOverview>
    </Pane>
  );
};
Overview.propTypes = {
  account: PropTypes.object,
  listTxns: PropTypes.array,
  downs: PropTypes.array,
  downtime: PropTypes.object,
  ethPayoutPending: PropTypes.bool,
  ethAllowance: PropTypes.object,
  ethPayoutDate: PropTypes.object,
  handleETHPayout: PropTypes.func,
  estimateETHPayout: PropTypes.func,
  abpPayoutPending: PropTypes.bool,
  handleABPPayout: PropTypes.func,
  estimateABPPayout: PropTypes.func,
  messages: PropTypes.object,
};

export default Overview;
