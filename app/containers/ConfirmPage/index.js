import React from 'react';
import PropTypes from 'prop-types';
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import * as storageService from '../../services/localStorage';
import * as accountService from '../../services/account';
import Container from '../../components/Container';
import H1 from '../../components/H1';
import WithLoading from '../../components/WithLoading';
import A from '../../components/A';

import { modalAdd } from '../../containers/App/actions';
import { CONFIRM_DIALOG } from '../../containers/Modal/constants';

import messages from './messages';

class ConfirmPage extends React.Component {

  static propTypes = {
    dispatch: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      sendTime: 0,
      sending: false,
    };

    this.handleResend = this.handleResend.bind(this);
  }

  get email() {
    return storageService.getItem('pendingEmail');
  }

  async handleResend() {
    if (this.state.sending) {
      return;
    }

    if (this.state.sendTime > (Date.now() - (5 * 60 * 1000))) {
      this.props.dispatch(modalAdd({
        modalType: CONFIRM_DIALOG,
        modalProps: {
          title: 'You can resend email only once per 5 minutes',
        },
      }));
    } else {
      this.setState({
        sending: true,
      });
      await accountService.resendEmail(this.email, window.location.origin);
      this.setState({
        sendTime: Date.now(),
        sending: false,
      });
      this.props.dispatch(modalAdd({
        modalType: CONFIRM_DIALOG,
        modalProps: {
          title: 'Confirmation link sent!',
          msg: 'Please check your email',
        },
      }));
    }
  }

  render() {
    const { sending } = this.state;

    return (
      <Container style={{ textAlign: 'center' }}>
        <H1>
          <FormattedHTMLMessage {...messages.header} />
        </H1>
        {this.email &&
          <p style={{ margin: '0 15%' }}>
            <FormattedMessage
              {...messages.resendInstruction}
              values={{
                resendLink: (
                  <A onClick={this.handleResend} style={{ whiteSpace: 'nowrap' }}>
                    <FormattedMessage {...messages.resendLinkText} />
                    {sending &&
                      <WithLoading
                        isLoading
                        type="inline"
                        styles={{ outer: { marginLeft: 5 } }}
                      />
                    }
                  </A>
                ),
              }}
            />
          </p>
        }
      </Container>
    );
  }
}

export default connect()(ConfirmPage);
