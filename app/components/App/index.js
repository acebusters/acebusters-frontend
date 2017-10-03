import React from 'react';
import PropTypes from 'prop-types';

import Footer from 'components/Footer';
import Content from 'components/Content';
import { ModalContainer, ModalDialog } from 'components/Modal';
import { ModalsTransitionGroup } from 'components/Modal/ModalsTransitionGroup';
import Notifications from 'containers/Notifications';
import GoogleTagManager from 'containers/GTM';
import Header from 'containers/Header';
import { conf } from '../../app.config';

import { StyledDashboard } from './styles';

const App = (props) => {
  const {
    location,
    modalDismiss,
    modal,
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

      <ModalsTransitionGroup>
        {modal &&
          <ModalContainer
            style={{ zIndex: 7 }}
            onClick={modal.backdrop ? (modal.closeHandler || modalDismiss) : null}
          >
            <ModalDialog onClose={modal.closeHandler || modalDismiss}>
              {modal.node}
            </ModalDialog>
          </ModalContainer>
        }
      </ModalsTransitionGroup>
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
  modalDismiss: PropTypes.func,
  fixed: PropTypes.bool,
  params: PropTypes.object,
  modal: PropTypes.shape({
    node: PropTypes.any,
    closeHandler: PropTypes.func,
    backdrop: PropTypes.bool,
  }),
  notifications: PropTypes.array,
};

export default App;
