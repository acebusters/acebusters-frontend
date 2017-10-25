import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import PropTypes from 'prop-types';
import Header from 'containers/Header';
import Footer from 'components/Footer';
import Notifications from 'containers/Notifications';
import { selectNotifications } from 'containers/Notifications/selectors';
import { StyledDashboard } from './styles';

const DashboardFrame = (props) => (
  <div>
    <Header {...props} />
    <Notifications location={props.location} />
    <StyledDashboard
      move={props.notifications.length > 0}
      name="styled-dashboard"
    >
      {props.children}
    </StyledDashboard>
    <Footer />
  </div>
);
DashboardFrame.propTypes = {
  children: PropTypes.node.isRequired,
  notifications: PropTypes.array.isRequired,
  location: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  notifications: selectNotifications(),
});

export default connect(mapStateToProps)(DashboardFrame);
