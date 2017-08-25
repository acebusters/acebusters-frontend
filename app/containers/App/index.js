import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { browserHistory } from 'react-router';

import Footer from 'components/Footer';
import Content from 'components/Content';
import withProgressBar from 'components/ProgressBar';
import { ModalContainer, ModalDialog } from 'components/Modal';
import { ModalsTransitionGroup } from 'components/Modal/ModalsTransitionGroup';
import Notifications from 'containers/Notifications';

import { selectNotifications } from '../Notifications/selectors';
import { makeSelectLoggedIn } from '../AccountProvider/selectors';
import Header from '../Header';
import { setAuthState } from '../AccountProvider/actions';

import {
  makeSelectProgress,
  makeSelectTransferShow,
  makeModalSelector,
  selectWorkerProgress,
} from './selectors';
import { modalDismiss } from './actions';
import { StyledDashboard } from './styles';

export function App({ notifications, loggedIn, modal, ...props }) {
  const pathname = props.location.pathname;
  const isNotTable = pathname.indexOf('table') === -1;
  const showNotifications = pathname.match(/table|lobby|dashboard|login/);

  return (
    <div name="app-container">
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
          <ModalContainer style={{ zIndex: 7 }}>
            <ModalDialog
              onClose={modal.closeHandler || props.modalDismiss}
            >
              {modal.node}
            </ModalDialog>
          </ModalContainer>
        }
      </ModalsTransitionGroup>
    </div>
  );
}

App.defaultProps = {
  fixed: false,
  initialCollapse: true,
};

App.propTypes = {
  children: PropTypes.node,
  handleClickLogout: PropTypes.func,
  modalDismiss: PropTypes.func,
  fixed: PropTypes.bool,
  params: PropTypes.object,
  location: PropTypes.object,
  modal: PropTypes.shape({
    node: PropTypes.any,
    closeHandler: PropTypes.func,
  }),
  notifications: PropTypes.array,
  loggedIn: PropTypes.bool,
};

function mapDispatchToProps(dispatch) {
  return {
    handleClickLogout: () => {
      browserHistory.push('/login');
      return dispatch(setAuthState({ loggedIn: false }));
    },
    modalDismiss: () => dispatch(modalDismiss()),
  };
}

const mapStateToProps = createStructuredSelector({
  workerProgress: selectWorkerProgress,
  isModalOpen: makeSelectTransferShow(),
  modal: makeModalSelector(),
  progress: makeSelectProgress(),
  notifications: selectNotifications(),
  loggedIn: makeSelectLoggedIn(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(withProgressBar(App));
