/*
 * Invest Tour Messages
 *
 * This contains all the text for the InvestTour component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  metaMaskWarn: {
    id: 'app.containers.InvestTour.metaMaskWarn',
    defaultMessage: 'For each step, ensure that MetaMask uses the \'Ethereum Main Net\'!',
  },
  confirmationNote: {
    id: 'app.containers.InvestTour.confirmationNote',
    defaultMessage: 'Transaction confirmations are shown in \'Overview\' tab.',
  },
  step1: {
    id: 'app.containers.InvestTour.step1',
    defaultMessage: `
      <div>
        To invest in Acebusters, follow these easy steps:
        <ol>
          <li>Unlock your account</li>
          <li>Deposit ether</li>
          <li>Exchange ether for nutz</li>
          <li>Wait for the crowdsale to finish</li>
          <li>Power Up!</li>
        </ol>
      </div>
    `,
  },
  step1_link: {
    id: 'app.containers.InvestTour.step1_link',
    defaultMessage: 'Read the FAQ for more info.',
  },
  step2: {
    id: 'app.containers.InvestTour.step2',
    defaultMessage: 'Goto the \'Wallet\' tab',
  },
  step3_title: {
    id: 'app.containers.InvestTour.step3_title',
    defaultMessage: 'Unlock your account [1/2]:',
  },
  step3_li1_a: {
    id: 'app.containers.InvestTour.step3_li1_a',
    defaultMessage: 'Install the ',
  },
  step3_li1_b: {
    id: 'app.containers.InvestTour.step3_li1_b',
    defaultMessage: ' plugin',
  },
  step3_li2: {
    id: 'app.containers.InvestTour.step3_li1',
    defaultMessage: 'Fund your MetaMask wallet with ether',
  },
  step4: {
    id: 'app.containers.InvestTour.step4',
    defaultMessage: `
      <div>
        Unlock your account [2/2]:</span>
        <ol>
          <li>Click the &#39;Unlock your Account&#39; button</li>
          <li>Confirm the MetaMask transaction pop-up</li>
          <li>Wait for the transaction to confirm</li>
        </ol>
        After these steps, the &#39;Account Limit Warning&#39; will disappear.
      </div>
    `,
  },
  step5: {
    id: 'app.containers.InvestTour.step5',
    defaultMessage: `
      <div>
        <p>Deposit ether to your account address (in green).</p>
        <Alert theme="info">You can deposit from any wallet, but make sure to leave at least 0.05ETH in MetaMask for future transactions.</Alert>
      </div>
    `,
  },
  step6: {
    id: 'app.containers.InvestTour.step6',
    defaultMessage: 'Goto the \'Exchange\' tab',
  },
  step7: {
    id: 'app.containers.InvestTour.step7',
    defaultMessage: `
      <div>
        <p>Select the &#39;Ethereum&#39; from the dropdown, and use the form to exchange ETH for NTZ.</p>
      </div>
    `,
  },
  step8: {
    id: 'app.containers.InvestTour.step8',
    defaultMessage: `
      <div>
        <p>Wait for the crowdsale to finish. You will be notified by email.</p>
        <p>Once notified you can Power Up and become and investor!</p>
      </div>
    `,
  },
});
