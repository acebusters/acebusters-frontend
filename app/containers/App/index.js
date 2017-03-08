import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { ModalContainer, ModalDialog } from 'react-modal-dialog';
import { browserHistory } from 'react-router';
import Header from 'components/Header';
import Content from 'components/Content';
import withProgressBar from 'components/ProgressBar';

import { landingPageUrl } from '../../app.config';
import makeSelectAccountData, { makeSelectGravatar } from '../AccountProvider/selectors';
import {
  makeSelectSidebarCollapse,
  makeSelectTransferShow,
  makeModalStackSelector,
} from './selectors';
import { setAuthState } from '../AccountProvider/actions';
import { modalDismiss } from './actions';
import theme from '../../skin-blue';

import {
  boxedLayoutMaxWidth,
} from '../../variables';

const StyledDashboard = styled.div`
  /* clearfix */
  &:before, &:after {
    display: table;
    content: " ";
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
  &:after {
    clear: both;
  }
  /* theme */
  ${(props) => (props.theme.sidebarBg && `background-color: ${(props).theme.sidebarBg};`)}
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
    <div>
      <StyledDashboard>
        <ThemeProvider theme={theme}>
          <Header
            loggedIn={props.account.loggedIn}
            onClickLogout={props.handleClickLogout}
            imageUrl={props.gravatarUrl}
            logoHref={props.logoHref}
          />
        </ThemeProvider>
        {props.account.loggedIn && <ThemeProvider theme={theme}>
        </ThemeProvider>}
        <ThemeProvider theme={theme}>
          <Content
            fixed={props.fixed}
            name="content-wrapper"
          >
            {React.Children.toArray(props.children)}
          </Content>
        </ThemeProvider>
      </StyledDashboard>

      { modalContent &&
        <ModalContainer onClose={props.modalDismiss}>
          <ModalDialog onClose={props.modalDismiss}>
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
  logoHref: landingPageUrl,
};


App.propTypes = {
  children: React.PropTypes.node,
  account: React.PropTypes.object,
  handleClickLogout: React.PropTypes.func,
  modalDismiss: React.PropTypes.func,
  logoHref: React.PropTypes.string,
  fixed: React.PropTypes.bool,
  gravatarUrl: React.PropTypes.string,
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
  account: makeSelectAccountData(),
  sidebarCollapse: makeSelectSidebarCollapse(),
  isModalOpen: makeSelectTransferShow(),
  gravatarUrl: makeSelectGravatar(),
  modalStack: makeModalStackSelector(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(withProgressBar(App));

