import React from 'react';
import Raven from 'raven-js';

import styled from 'styled-components';

import { conf } from '../../app.config';

const Link = styled.a`
  cursor: pointer; 
  padding: 5px 10px;
  background-color: ${(props) => props.inProgress ? 'grey' : 'cornflowerblue'};
  transform: rotate(90deg);
  display: inline-block;
  position: fixed;
  right: ${(props) => props.inProgress ? '-44px' : '-36px'};
  bottom: 150px;
  color: white;
  border-radius: 0 0 3px 3px;
`;

export class FeedbackButton extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  constructor() {
    super();
    this.showReport = this.showReport.bind(this);
    this.state = { inProgress: false };
  }

  showReport() {
    this.setState({ inProgress: true });
    Raven.captureMessage(`Feedback Button ${Date.now()}`);
    Raven.showReportDialog({
      eventId: Raven.lastEventId(),
      dsn: conf().sentryDSN,
    });
    setTimeout(() => {
      this.setState({ inProgress: false });
    }, 5000);
  }

  render() {
    const { inProgress } = this.state;
    return (
      <Link onClick={!inProgress && this.showReport} inProgress={inProgress}>
        {inProgress &&
          <i className="fa fa-refresh fa-spin"></i>}
        &nbsp;Report Crash
      </Link>
    );
  }
}

export default FeedbackButton;
