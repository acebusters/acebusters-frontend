import React from 'react';
import PropTypes from 'prop-types';

import {
  TokenContainer,
  TokenIcon,
  TokenName,
} from './styles';


const Token = ({
  icon,
  name,
}) => (
  <TokenContainer>
    <TokenIcon>
      {icon}
    </TokenIcon>
    <TokenName>{name}</TokenName>
  </TokenContainer>
);
Token.propTypes = {
  icon: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
};

export default Token;
