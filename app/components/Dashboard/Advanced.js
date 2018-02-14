import React from 'react';
import PropTypes from 'prop-types';
import Alert from 'components/Alert';
import Button from 'components/Button';
import H2 from 'components/H2';

import {
  Pane,
  Section,
  Text,
  ButtonGroup,
  TabIcon as ModeIcon,
} from './styles';

// eslint-disable-next-line react/prefer-stateless-function
class Advanced extends React.Component {
  static propTypes = {
    onImport: PropTypes.func.isRequired,
    onExport: PropTypes.func.isRequired,
  }
  render() {
    const { onImport, onExport } = this.props;
    return (
      <Pane name="dashboard-advanced">
        <Section>
          <H2><ModeIcon className="fa fa-suitcase" />Account Recovery</H2>
          <Text>These functions import and export the wallet seed from/to localstorage. Please be careful as this operation can cause loss of funds.</Text>
          <Alert theme="warning" style={{ textAlign: 'center' }}>
            Warning: Testnet ETH and NTZ only!
          </Alert>
          <ButtonGroup>
            <Button
              icon="fa fa-download"
              size="medium"
              onClick={onImport}
            >
              Import Wallet
            </Button>
            <Button
              icon="fa fa-upload"
              size="medium"
              onClick={onExport}
            >
              Export Wallet
            </Button>
          </ButtonGroup>
        </Section>
      </Pane>
    );
  }
}

export default Advanced;
