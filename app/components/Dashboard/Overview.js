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
  const { account, listTxns } = props;
  return (
    <Pane name="dashboard-overview">
      <Section name="wallet-receive">
        <H2>Deposit</H2>
        {account.isLocked ?
          <AccountIsLocked {...props} />
          :
          <AccountNotLocked {...props} />
        }
      </Section>

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
};

export default Overview;
