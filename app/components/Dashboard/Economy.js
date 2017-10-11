import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { formatAbp, formatNtz } from '../../utils/amountFormatter';

import WithLoading from '../WithLoading';
import List from '../List';

const Economy = (props) => {
  const {
    totalSupplyPwr,
    activeSupplyPwr,
    activeSupplyBabz,
    pwrBalance,
    babzBalance,
    messages,
  } = props;
  const pwrPercentage = pwrBalance && totalSupplyPwr && pwrBalance.div(totalSupplyPwr).mul(100).toFormat(6);
  const nutzPercentage = babzBalance && activeSupplyBabz && babzBalance.div(activeSupplyBabz).mul(100).toFormat(6);
  const ECONOMY_LIST = [
    [
      <FormattedMessage {...messages.economyListOwnership} />,
      <WithLoading
        isLoading={!babzBalance && !activeSupplyBabz}
        loadingSize="14px"
        type="inline"
      >
        <FormattedMessage values={{ amount: nutzPercentage }} {...messages.percentUnit} />
      </WithLoading>,
      <WithLoading
        isLoading={!pwrBalance && !totalSupplyPwr}
        loadingSize="14px"
        type="inline"
      >
        <FormattedMessage values={{ amount: pwrPercentage }} {...messages.percentUnit} />
      </WithLoading>,
    ],
    [
      <FormattedMessage {...messages.economyListActive} />,
      <WithLoading
        isLoading={!activeSupplyBabz}
        loadingSize="14px"
        type="inline"
      >
        <FormattedMessage
          values={{ amount: formatNtz(activeSupplyBabz) }}
          {...messages.ntzUnit}
        />
      </WithLoading>,
      <WithLoading
        isLoading={!activeSupplyPwr}
        loadingSize="14px"
        type="inline"
      >
        <FormattedMessage values={{ amount: formatAbp(activeSupplyPwr) }} {...messages.abpUnit} />
      </WithLoading>,
    ],
    [
      <FormattedMessage {...messages.economyListTotal} />,
      null,
      <WithLoading
        isLoading={!totalSupplyPwr}
        loadingSize="14px"
        type="inline"
      >
        <FormattedMessage values={{ amount: formatAbp(totalSupplyPwr) }} {...messages.abpUnit} />
      </WithLoading>,
    ],
  ];
  const COL_STYLE = {
    0: { width: 120 },
    1: { textAlign: 'left', width: 10, whiteSpace: 'nowrap' },
    2: { textAlign: 'left', width: 10, whiteSpace: 'nowrap' },
  };
  return (
    <List
      items={ECONOMY_LIST}
      headers={['', 'Nutz', 'Power']}
      columnsStyle={COL_STYLE}
    />
  );
};
Economy.propTypes = {
  totalSupplyPwr: PropTypes.object,
  activeSupplyPwr: PropTypes.object,
  activeSupplyBabz: PropTypes.object,
  pwrBalance: PropTypes.object,
  babzBalance: PropTypes.object,
  messages: PropTypes.object,
};

export default Economy;
