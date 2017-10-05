import React from 'react';
import PropTypes from 'prop-types';

import Content from 'components/Content';
import Footer from 'components/Footer';
import GoogleTagManager from 'containers/GTM';
import Modal from 'containers/Modal';
import Notifications from 'containers/Notifications';
import Header from 'containers/Header';
import { conf } from '../../app.config';

import { StyledDashboard } from './styles';

const App = (props) => {
  const {
    location,
    notifications,
   } = props;
  const pathname = location.pathname;
  const isNotTable = pathname.indexOf('table') === -1;
  const showNotifications = pathname.match(/table|lobby|dashboard|login/);
  return (
    <div name="app-container">
      <GoogleTagManager gtmId={conf().gtmId} />
      <StyledDashboard params={props.params} name="styled-dashboard">
        {isNotTable &&
          <Header onClickLogout={props.handleClickLogout} {...props} />
        }

        {showNotifications &&
          <Notifications isNotTable={isNotTable} />
        }

        <Content
          isTable={!isNotTable}
          shiftForNotification={notifications.length > 0}
          fixed={props.fixed}
          name="content-wrapper"
        >
          {React.Children.toArray(props.children)}
        </Content>

      </StyledDashboard>

      {isNotTable && <Footer />}

      <Modal {...props} />

    </div>
  );
};
App.defaultProps = {
  fixed: false,
  initialCollapse: true,
};

App.propTypes = {
  children: PropTypes.node,
  location: PropTypes.object,
  handleClickLogout: PropTypes.func,
  fixed: PropTypes.bool,
  params: PropTypes.object,
  notifications: PropTypes.array,
};

export default App;
