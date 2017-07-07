import React from 'react';
import PropTypes from 'prop-types';

import {
  Category,
  Container,
  Details,
  CenterWrapper,
} from './styles';

const Visitor = ({
  category,
  details,
  isNotTable,
  removing,
  type,
}) => (
  <Container
    name="notification-container"
    removing={removing}
    type={type}
    isNotTable={isNotTable}
  >
    <CenterWrapper type={type} isNotTable={isNotTable}>
      <Category>{category}</Category>
      <Details>{details}</Details>
    </CenterWrapper>
  </Container>
);
Visitor.propTypes = {
  category: PropTypes.string,
  isNotTable: PropTypes.bool,
  details: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]),
  removing: PropTypes.bool,
  type: PropTypes.string,
};
Visitor.defaultProps = {
  isNotTable: false,
};

export default Visitor;
