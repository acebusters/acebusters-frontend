import React from 'react';
import { FormattedHTMLMessage } from 'react-intl';

import Container from '../../components/Container';
import H1 from '../../components/H1';

import messages from './messages';

function ConfirmPage() {
  return (
    <Container>
      <H1>
        <FormattedHTMLMessage {...messages.header} />
      </H1>
    </Container>
  );
}

export default ConfirmPage;
