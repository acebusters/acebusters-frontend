import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import messages from '../../containers/Dashboard/messages';
import WithLoading from '../../components/WithLoading';
import { formatEth } from '../../utils/amountFormatter';

import H2 from '../H2';
import List from '../List';
import TimedButton from '../TimedButton';

import { Pane, SectionOverview } from './styles';

const Overview = (props) => {
  const { account, listTxns, downRequests, ethAllowance, ethPayoutDate, ethPayoutPending, handleETHPayout } = props;
  const requestColumnStyle = { width: 20, textAlign: 'left', whiteSpace: 'nowrap' };
  const ethAmount = formatEth(ethAllowance);

  return (
    <Pane name="dashboard-overview">
      {ethAllowance && ethAllowance.toNumber() > 0 && ethPayoutDate &&
        <SectionOverview
          name="eth-payout"
          style={{
            alignItems: 'center',
          }}
        >
          <H2><FormattedMessage {...messages.ethPayout} /></H2>
          <p style={{ fontSize: 18, margin: '-5px 0 10px' }}>
            {ethAmount} ETH
          </p>
          <TimedButton
            until={ethPayoutDate.toNumber()}
            onClick={() => handleETHPayout(ethAmount)}
            disabled={ethPayoutPending}
          >
            Execute Pay-out
            {ethPayoutPending &&
              <WithLoading
                isLoading
                loadingSize="14px"
                type="inline"
                styles={{ outer: { marginLeft: 5 } }}
              />
            }
          </TimedButton>
        </SectionOverview>
      }

      {!account.isLocked && downRequests && downRequests.length > 0 &&
        <SectionOverview name="power-down-requests">
          <H2><FormattedMessage {...messages.powerDownRequests} /></H2>
          <List
            items={downRequests}
            headers={[
              'Total',
              'Payed-Out',
              'Request date',
              'Next Pay-Out',
              '',
            ]}
            columnsStyle={{
              0: requestColumnStyle,
              1: requestColumnStyle,
              2: requestColumnStyle,
              3: requestColumnStyle,
            }}
            noDataMsg="No Requests Yet"
          />
        </SectionOverview>
      }

      <SectionOverview name="transaction-history">
        <H2><FormattedMessage {...messages.included} /></H2>
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
            0: { width: 20 },
            1: { textAlign: 'left', width: 10, whiteSpace: 'nowrap' },
            2: { width: 20 },
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
  downRequests: PropTypes.array,
  ethAllowance: PropTypes.object,
  ethPayoutPending: PropTypes.bool,
  ethPayoutDate: PropTypes.object,
  handleETHPayout: PropTypes.func,
};

export default Overview;
