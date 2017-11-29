import React from 'react';
import PropTypes from 'prop-types';
import Tour from 'reactour';
import { browserHistory } from 'react-router';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';

import A from '../A';
import Alert from '../Alert';

import messages from './investTourMessages';

const InvestTour = ({
  setAmountUnit,
  investTour,
  toggleInvestTour,
}) => {
  const stepStyle = {
    borderRadius: 10,
    maxWidth: 480,
    minWidth: 320,
  };
  const metaMaskWarning = (
    <Alert theme="danger">
      <i><FormattedMessage {...messages.metaMaskWarn} /></i>
    </Alert>
  );
  const confirmationNote = (
    <Alert theme="info">
      <FormattedMessage {...messages.confirmationNote} />
    </Alert>
  );
  const STEPS = [
    {
      selector: '[data-tour="tour-begin"]',
      action: () => browserHistory.replace('/dashboard'),
      content: (
        <div>
          <FormattedHTMLMessage {...messages.step1} />
          <A href="http://help.acebusters.com/how-to-participate-in-the-crowdsale/invest-using-the-acebusters-dapp-recommended" target="_blank">
            <FormattedMessage {...messages.step1_link} />
          </A>
        </div>
        ),
      style: stepStyle,
    },
    {
      selector: '[data-tour="wallet"]',
      content: <div><FormattedMessage {...messages.step2} /></div>,
      action: () => browserHistory.replace('/dashboard/wallet'),
      style: stepStyle,
    },
    {
      selector: '[data-tour="wallet"]',
      content: (
        <div>
          <FormattedMessage {...messages.step3_title} />
          <ol>
            <li>
              <FormattedMessage {...messages.step3_li1_a} />
              <A href="https://metamask.io/" target="_blank">MetaMask</A>
              <FormattedMessage {...messages.step3_li1_b} />
            </li>
            <li><FormattedMessage {...messages.step3_li2} /></li>
          </ol>
          {metaMaskWarning}
        </div>
      ),
      position: 'bottom',
      style: stepStyle,
    },
    {
      selector: '[data-tour="wallet-unlock"]',
      content: <FormattedHTMLMessage {...messages.step4} />,
      position: 'top',
      style: stepStyle,
    },
    {
      selector: '[data-tour="wallet-address"]',
      action: () => browserHistory.replace('/dashboard/wallet'),
      content: (
        <div>
          <FormattedHTMLMessage {...messages.step5} />
          {confirmationNote}
        </div>
      ),
      style: stepStyle,
    },
    {
      selector: '[data-tour="exchange"]',
      content: <div><FormattedMessage {...messages.step6} /></div>,
      action: () => {
        browserHistory.replace('/dashboard/exchange');
        setAmountUnit('eth');
      },
      style: stepStyle,
    },
    {
      selector: '[data-tour="exchange-eth-form"]',
      content: <FormattedHTMLMessage {...messages.step7} />,
      style: stepStyle,
    },
    {
      selector: '[data-tour="exchange-eth-form"]',
      content: (
        <div>
          <i style={{ margin: '10px auto 10px 40%' }} className="fa fa-4x fa-clock-o" />
          <FormattedHTMLMessage {...messages.step8} />
        </div>
      ),
      style: stepStyle,
    },
    /* commented-out until end of ICO
    {
      selector: '[data-tour="invest"]',
      content: <div>Goto the &#39;Invest&#39; tab</div>,
      action: () => {
        setActiveTab(INVEST);
        setInvestType('powerUp');
      },
      style: stepStyle,
    },
    {
      selector: '[data-tour="powerUp"]',
      content: (
        <div>
          <p>Using the Power Up form, Power Up your NTZ, and receive ABP.</p>
        </div>
      ),
      style: stepStyle,
    },
    {
      selector: '[data-tour="powerUp"]',
      content: (
        <div>
          <Alert theme="success">
            <span role="img" aria-label="party">🎉</span>Congratuations! You are now part of the Acebusters economy
          </Alert>
          <Alert theme="info">
            <A href="https://etherscan.io/token/tokenholderchart/0x14b233a46cd4bdfdb7ca29aa0fd2406f667f8ff6" target="_blank">Acebusters Power Token Holders</A>
          </Alert>
        </div>
      ),
      style: stepStyle,
    },
    */
  ];
  return (
    <Tour
      steps={STEPS}
      isOpen={investTour}
      onRequestClose={toggleInvestTour}
      onBeforeClose={() => {
        browserHistory.replace('/dashboard');
        document.body.style.overflowY = 'auto';
      }}
      scrollDuration={20}
      showNavigationNumber={false}
      showNavigation
      showNumber={false}
      startAt={0}
      lastStepNextButton="Done"
    />
  );
};
InvestTour.propTypes = {
  setAmountUnit: PropTypes.func,
  investTour: PropTypes.bool.isRequired,
  toggleInvestTour: PropTypes.func.isRequired,
};

export default InvestTour;
