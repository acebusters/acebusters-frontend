import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { ModalContainer, ModalDialog } from 'kd-react-modal-dialog';
import { browserHistory } from 'react-router';
import Footer from 'components/Footer';
import Content from 'components/Content';
import withProgressBar from 'components/ProgressBar';
import Header from '../Header';

import {
  makeSelectProgress,
  makeSelectTransferShow,
  makeModalStackSelector,
  selectWorkerProgress,
} from './selectors';
import { setAuthState } from '../AccountProvider/actions';
import { modalDismiss } from './actions';

import {
  boxedLayoutMaxWidth,
  backgroundBoxed,
  backgroundTable,
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
  background-image: ${(props) => props.params.tableAddr ? backgroundTable : backgroundBoxed};
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
  const modalContent = props.modalStack[props.modalStack.length - 1];
  return (
    <div name="app-container">
      <StyledDashboard params={props.params} name="styled-dashboard">
        { props.location.pathname.indexOf('table') === -1 &&
          <Header
            onClickLogout={props.handleClickLogout}
            {...props}
          />
        }
        <Content
          fixed={props.fixed}
          name="content-wrapper"
        >
          {React.Children.toArray(props.children)}
        </Content>

      </StyledDashboard>
      { props.location.pathname.indexOf('table') === -1 &&
        <Footer />
      }
      { modalContent &&
        <ModalContainer zIndex="7">
          <ModalDialog
            onClose={props.modalDismiss}
            dismissOnBackgroundClick={false}
            closeButtonParam={{ margin: 5 }}
          >
            { modalContent }
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
  children: React.PropTypes.node,
  handleClickLogout: React.PropTypes.func,
  modalDismiss: React.PropTypes.func,
  fixed: React.PropTypes.bool,
  params: React.PropTypes.object,
  location: React.PropTypes.object,
  modalStack: React.PropTypes.array,
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
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(withProgressBar(App));
