import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';

import web3Connect from '../AccountProvider/web3Connect';
import Tabs from '../../components/Dashboard/Tabs';
import { Pane, Section } from '../../components/Dashboard/styles';
import makeSelectAccountData from '../AccountProvider/selectors';

import { POWERUP, POWERDOWN } from './actions';
import messages from './messages';

const TABS = [
  {
    name: POWERUP,
    title: <FormattedMessage {...messages.powerUpTitle} />,
    to: '/dashboard/invest',
    icon: 'fa fa-arrow-up',
    onlyActiveOnIndex: true,
  },
  {
    name: POWERDOWN,
    title: <FormattedMessage {...messages.powerDownTitle} />,
    to: '/dashboard/invest/powerDown',
    icon: 'fa fa-arrow-down',
  },
];

function Invest({ account, children }) {
  return (
    <Pane name="dashboard-invest">
      <Section>
        <Tabs
          tabs={TABS}
          disabledTabs={account.isLocked ? [POWERDOWN] : []}
        />
        {children}
      </Section>
    </Pane>
  );
}
Invest.propTypes = {
  account: PropTypes.object,
  children: PropTypes.any,
};

const mapStateToProps = createStructuredSelector({
  account: makeSelectAccountData(),
});

export default web3Connect(
  mapStateToProps,
  () => ({}),
)(Invest);
