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
    defaultMessage: 'Confirmation link sent!<br />Please check your email',
  },
  resendInstruction: {
    id: 'app.containers.ConfirmPage.resendInstruction',
    defaultMessage: 'It can take a few minutes to send the email to your inbox. If nothing happens after 5 minutes, please check your spam folder or {resendLink}',
  },
  resendLinkText: {
    id: 'app.containers.ConfirmPage.resendLinkText',
    defaultMessage: 'click here to send it again',
  },
});
