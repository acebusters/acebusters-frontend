import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { conf } from '../../app.config';

import A from '../A';
import H2 from '../H2';
import List from '../List';

import Refs from './Refs';
import { Pane, SectionOverview, Subtitle } from './styles';

const Overview = (props) => {
  const { account, listTxns, messages } = props;
  const emptyColumnStyle = { width: 20 };

  return (
    <Pane name="dashboard-overview">
      {account.email &&
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
      }

      {account.refs && account.refs.length &&
        <Refs
          refs={account.refs}
          messages={messages}
        />
      }

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
  messages: PropTypes.object,
};

export default Overview;
