import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { ModalContainer, ModalDialog } from 'kd-react-modal-dialog';
import { browserHistory } from 'react-router';
import Footer from 'components/Footer';
import Content from 'components/Content';
import withProgressBar from 'components/ProgressBar';
import Header from '../Header';
import Notifications from '../../containers/Notifications';

import {
  makeSelectProgress,
  makeSelectTransferShow,
  makeModalStackSelector,
  selectWorkerProgress,
} from './selectors';

import { selectNotifications } from '../Notifications/selectors';
import { makeSelectLoggedIn } from '../AccountProvider/selectors';

import { setAuthState } from '../AccountProvider/actions';
import { modalDismiss } from './actions';

import {
  boxedLayoutMaxWidth,
  backgroundBoxed,
  backgroundTableColor,
} from '../../variables';

const StyledDashboard = styled.div`
  /* clearfix */
  &:before, &:after {
    display: table;
    content: " ";
    box-sizing: border-box;
  }
  &:after {
    clear: both;
  }
  /* theme */
  background: #444;
  background-color: ${(props) => props.params.tableAddr ? backgroundTableColor : backgroundBoxed};
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  ${(props) => (props.boxed && `
    max-width: ${boxedLayoutMaxWidth};
    margin: 0 auto;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
    position: relative;
  `)}
`;

export function App(props) {
  const { notifications, loggedIn } = props;
  const isNotTable = props.location.pathname.indexOf('table') === -1;
  return (
    <div name="app-container">
      <StyledDashboard params={props.params} name="styled-dashboard">
        {isNotTable &&
          <Header
            onClickLogout={props.handleClickLogout}
            {...props}
          />
        }
        <div>
          <Notifications isNotTable={isNotTable} />
          <Content
            showNavigation={!loggedIn || notifications.length > 0}
            fixed={props.fixed}
            name="content-wrapper"
          >
            {React.Children.toArray(props.children)}
          </Content>
        </div>
      </StyledDashboard>

      {isNotTable &&
        <Footer />
      }

      {props.modalStack.length > 0 &&
        <ModalContainer zIndex={7}>
          <ModalDialog
            onClose={props.modalDismiss}
            dismissOnBackgroundClick={false}
            closeButtonParam={{ margin: 5 }}
          >
            {props.modalStack[props.modalStack.length - 1]}
          </ModalDialog>
        </ModalContainer>
      }
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
  modalStack: PropTypes.array,
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
  modalStack: makeModalStackSelector(),
  progress: makeSelectProgress(),
  notifications: selectNotifications(),
  loggedIn: makeSelectLoggedIn(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(withProgressBar(App));
