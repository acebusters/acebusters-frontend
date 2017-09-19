import React from 'react';
import PropTypes from 'prop-types';
import Tour from 'reactour';

import {
  OVERVIEW,
  WALLET,
  EXCHANGE,
  INVEST,
} from '../../containers/Dashboard/actions';

import A from '../A';
import Alert from '../Alert';

const InvestTour = ({
  setActiveTab,
  setAmountUnit,
  setInvestType,
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
      <i>For each step, ensure that MetaMask uses the &#39;Ethereum Main Net&#39;!</i>
    </Alert>
  );
  const confirmationNote = (
    <Alert theme="info">
      Transaction confirmations are shown in &#39;Overview&#39; tab.
    </Alert>
  );
  const STEPS = [
    {
      selector: '[data-tour="tour-begin"]',
      content: (
        <div>
          To invest in Acebusters, follow these easy steps:
          <ol>
            <li>Unlock your account</li>
            <li>Deposit ether</li>
            <li>Exchange ether for nutz</li>
            <li>Power Up!</li>
          </ol>
        </div>
      ),
      style: stepStyle,
    },
    {
      selector: '[data-tour="wallet"]',
      content: <div>Goto the &#39;Wallet&#39; tab</div>,
      action: () => setActiveTab(WALLET),
      style: stepStyle,
    },
    {
      selector: '[data-tour="wallet"]',
      content: (
        <div>
          Unlock your account:<span style={{ float: 'right' }}>[1/2]</span>
          <ol>
            <li>Install the <A href="https://metamask.io/" target="_blank">MetaMask</A> plugin</li>
            <li>Fund your MetaMask wallet with ether</li>
          </ol>
          {metaMaskWarning}
        </div>
      ),
      position: 'bottom',
      style: stepStyle,
    },
    {
      selector: '[data-tour="wallet-unlock"]',
      content: (
        <div>
          Unlock your account:<span style={{ float: 'right' }}>[2/2]</span>
          <ol>
            <li>Click the &#39;Unlock your Account&#39; button</li>
            <li>Confirm the MetaMask transaction pop-up</li>
            <li>Wait for the transaction to confirm</li>
          </ol>
          After these steps, the &#39;Account Limit Warning&#39; will disappear.
        </div>
      ),
      position: 'top',
      style: stepStyle,
    },
    {
      selector: '[data-tour="wallet-address"]',
      content: (
        <div>
          <p>Deposit ether to your account address (in green).</p>
          <Alert theme="info">You can deposit from any wallet, but make sure to leave at least 0.05ETH in MetaMask for future transactions.</Alert>
          {confirmationNote}
        </div>
      ),
      style: stepStyle,
    },
    {
      selector: '[data-tour="exchange"]',
      content: <div>Goto the &#39;Exchange&#39; tab</div>,
      action: () => {
        setActiveTab(EXCHANGE);
        setAmountUnit('eth');
      },
      style: stepStyle,
    },
    {
      selector: '[data-tour="exchange-eth-form"]',
      content: (
        <div>
          <p>Select the &#39;Ethereum&#39; from the dropdown, and use the form to exchange ETH for NTZ.</p>
        </div>
      ),
      style: stepStyle,
    },
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
  ];
  return (
    <Tour
      steps={STEPS}
      isOpen={investTour}
      onRequestClose={toggleInvestTour}
      onBeforeClose={() => {
        setActiveTab(OVERVIEW);
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
  setActiveTab: PropTypes.func,
  setAmountUnit: PropTypes.func,
  setInvestType: PropTypes.func,
  investTour: PropTypes.bool.isRequired,
  toggleInvestTour: PropTypes.func.isRequired,
};

export default InvestTour;
