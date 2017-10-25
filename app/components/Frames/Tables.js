import React from 'react';
import PropTypes from 'prop-types';
import Notifications from 'containers/Notifications';
import { StyledTable } from './styles';

const TableFrame = (props) => (
  <StyledTable name="styled-table">
    <Notifications location={props.location} />
    {props.children}
  </StyledTable>
);
TableFrame.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.object.isRequired,
};

export default TableFrame;
