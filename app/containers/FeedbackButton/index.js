import React from 'react';
import Raven from 'raven-js';

import styled from 'styled-components';

import { conf } from '../../app.config';

const Link = styled.a`
  cursor: pointer; 
  padding: 5px 10px;
  background-color: cornflowerblue;
  transform: rotate(90deg);
  display: inline-block;
  position: fixed;
  right: -36px;
  bottom: 150px;
  color: white;
  border-radius: 0 0 3px 3px;
`;

export class FeedbackButton extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  showReport() {
    Raven.captureMessage(`Feedback Button ${Date.now()}`);
    Raven.showReportDialog({
      eventId: Raven.lastEventId(),
      dsn: conf().sentryDSN,
    });
  }

  render() {
    return (
      <Link onClick={this.showReport}>Report Crash</Link>
    );
  }
}

export default FeedbackButton;
