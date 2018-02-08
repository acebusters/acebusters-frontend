import React from 'react';
import PropTypes from 'prop-types';
import Notifications from 'containers/Notifications';
import Header from 'containers/Header';
import { StyledTable, TableNotificationsWrapper } from './styles';

const TableFrame = (props) => (
  <StyledTable name="styled-table">
    <TableNotificationsWrapper>
      <Notifications location={props.location} />
    </TableNotificationsWrapper>
    <Header transparent />
    {props.children}
  </StyledTable>
);
TableFrame.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.object.isRequired,
};

export default TableFrame;
