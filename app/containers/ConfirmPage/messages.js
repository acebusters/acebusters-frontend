/*
 * ConfirmPage Messages
 *
 * This contains all the text for the ConfirmPage component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  // messages without knowing the code
  header: {
    id: 'app.containers.ConfirmPage.header',
    defaultMessage: 'Confirmation code sent! Please check your email.',
  },
  label: {
    id: 'app.containers.ConfirmPage.label',
    defaultMessage: 'Please enter the code you received via email:',
  },
  placeholder: {
    id: 'app.containers.ConfirmPage.placeholder',
    defaultMessage: 'confirmation code',
  },
  button: {
    id: 'app.containers.ConfirmPage.button',
    defaultMessage: 'Submit',
  },

  // if code is for register
  registerHeader: {
    id: 'app.containers.ConfirmPage.registerHeader',
    defaultMessage: 'Email Confirmation.',
  },
  registerLabel: {
    id: 'app.containers.ConfirmPage.registerLabel',
    defaultMessage: 'confirmation code you received via email:',
  },
  registerPlaceholder: {
    id: 'app.containers.ConfirmPage.registerPlaceholder',
    defaultMessage: 'code',
  },
  registerButton: {
    id: 'app.containers.ConfirmPage.registerButton',
    defaultMessage: 'Continue to Signup',
  },

  // if code is for reset
  resetHeader: {
    id: 'app.containers.ConfirmPage.resetHeader',
    defaultMessage: 'Account Reset Verification.',
  },
  resetLabel: {
    id: 'app.containers.ConfirmPage.resetLabel',
    defaultMessage: 'verification code you received via email:',
  },
  resetPlaceholder: {
    id: 'app.containers.ConfirmPage.resetPlaceholder',
    defaultMessage: 'confirmation code',
  },
  resetButton: {
    id: 'app.containers.ConfirmPage.resetButton',
    defaultMessage: 'Continue to Account Recovery',
  },
});
