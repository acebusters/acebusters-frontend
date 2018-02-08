import React from 'react';
import PropTypes from 'prop-types';
import Input from '../Input';

import { Container, CopyIcon, Tooltip } from './styles';

function copyText(input) {
  input.select();

  try {
    document.execCommand('copy');
  } finally {
    input.setSelectionRange(0, 0);
  }
}

class CopyInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      copied: false,
    };
  }

  render() {
    const { value } = this.props;
    const { copied } = this.state;

    return (
      <Container
        name="copy-container"
        onMouseEnter={() => this.setState({ copied: false })}
      >
        <CopyIcon
          className="fa fa-copy"
        />
        <Tooltip>{copied ? 'Copied' : 'Click to copy'}</Tooltip>
        <Input
          defaultValue={value}
          onClick={(e) => {
            this.setState({ copied: true });
            copyText(e.currentTarget);
          }}
          readOnly
          style={{ width: value.length * 8, fontSize: 15 }}
        />
      </Container>
    );
  }
}

CopyInput.propTypes = {
  value: PropTypes.string.isRequired,
};

export default CopyInput;
