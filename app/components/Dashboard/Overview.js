import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { formatEth } from '../../utils/amountFormatter';
import { conf } from '../../app.config';

import A from '../A';
import H2 from '../H2';
import List from '../List';
import Button from '../Button';

import Economy from './Economy';
import ETHPayout from './ETHPayout';
import ABPPayout from './ABPPayout';
import { Pane, SectionOverview, Subtitle } from './styles';

const Overview = (props) => {
  const {
    account, listTxns, messages,
    downs, handleABPPayout, downtime, abpPayoutPending,
    ethAllowance, ethPayoutDate, ethPayoutPending, handleETHPayout,
  } = props;
  const emptyColumnStyle = { width: 20 };
  const ethAmount = formatEth(ethAllowance);

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
        <Button
          size="medium"
          onClick={props.toggleInvestTour}
          data-tour="tour-begin"
        >
          <i className="fa fa-graduation-cap" />&nbsp;
          <FormattedMessage {...messages.investTutButton} />
        </Button>
      </SectionOverview>

      {account.refs && account.refs.length &&
        <SectionOverview
          name="refs"
          style={{
            alignItems: 'center',
          }}
        >
          <H2><FormattedMessage {...messages.refs} /></H2>
          <List
            items={account.refs.map((ref) => [ref.id, ref.allowance])}
            headers={[
              'Code',
              'Invitations left',
            ]}
            columnsStyle={{
              0: { width: 20, textAlign: 'left', whiteSpace: 'nowrap', paddingLeft: '20px', paddingRight: '20px' },
              1: { textAlign: 'right', whiteSpace: 'nowrap', paddingRight: '20px' },
            }}
          />
        </SectionOverview>
      }

      {ethAllowance && ethAllowance.toNumber() > 0 && ethPayoutDate &&
        <ETHPayout
          payoutDate={ethPayoutDate}
          pending={ethPayoutPending}
          handlePayout={handleETHPayout}
          amount={ethAmount}
          messages={messages}
        />
      }

      {!account.isLocked && downs && downtime && downs[0].toNumber() > 0 &&
        <ABPPayout
          downs={downs}
          downtime={downtime}
          pending={abpPayoutPending}
          handlePayout={handleABPPayout}
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
  ethAllowance: PropTypes.object,
  ethPayoutPending: PropTypes.bool,
  abpPayoutPending: PropTypes.bool,
  ethPayoutDate: PropTypes.object,
  handleETHPayout: PropTypes.func,
  handleABPPayout: PropTypes.func,
  messages: PropTypes.object,
  toggleInvestTour: PropTypes.func.isRequired,
};

export default Overview;
