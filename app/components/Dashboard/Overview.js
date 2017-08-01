import React from 'react'; import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import messages from '../../containers/Dashboard/messages';
import H2 from '../H2';
import List from '../List';

import { AccountIsLocked, AccountNotLocked } from './SectionReceive';
import {
  Pane,
  Section,
} from './styles';

const Overview = (props) => {
  const { account, listTxns, downRequests } = props;
  const requestColumnStyle = { width: 20, textAlign: 'left', whiteSpace: 'nowrap' };

  return (
    <Pane name="dashboard-overview">
      <Section name="wallet-receive">
        <H2>Deposit</H2>
        {account.isLocked
          ? <AccountIsLocked {...props} />
          : <AccountNotLocked {...props} />
        }
      </Section>

      {!account.isLocked && downRequests && downRequests.length > 0 &&
        <Section name="power-down-requests">
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
        </Section>
      }

      <Section name="transaction-history">
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
      </Section>
    </Pane>
  );
};
Overview.propTypes = {
  account: PropTypes.object,
  listTxns: PropTypes.array,
  downRequests: PropTypes.array,
};

export default Overview;
