import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { formatNtz } from '../../utils/amountFormatter';

import WithLoading from '../WithLoading';
import List from '../List';

const Economy = (props) => {
  const {
    activeSupplyBabz,
    babzBalance,
    messages,
  } = props;
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
    ],
    [
      <FormattedMessage {...messages.economyListTotal} />,
      null,
    ],
  ];
  const COL_STYLE = {
    0: { width: 120 },
    1: { textAlign: 'left', width: 10, whiteSpace: 'nowrap' },
  };
  return (
    <List
      items={ECONOMY_LIST}
      headers={['', 'Nutz']}
      columnsStyle={COL_STYLE}
    />
  );
};
Economy.propTypes = {
  activeSupplyBabz: PropTypes.object,
  babzBalance: PropTypes.object,
  messages: PropTypes.object,
};

export default Economy;
