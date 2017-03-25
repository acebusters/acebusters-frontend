import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { ModalContainer, ModalDialog } from 'react-modal-dialog';
import { browserHistory } from 'react-router';
import Header from 'components/Header';
import Content from 'components/Content';
import withProgressBar from 'components/ProgressBar';

import { landingPageUrl } from '../../app.config';
import makeSelectAccountData, { makeSelectGravatar, makeSignerAddrSelector } from '../AccountProvider/selectors';
import {
  makeSelectSidebarCollapse,
  makeSelectTransferShow,
  makeModalStackSelector,
} from './selectors';
import { setAuthState } from '../AccountProvider/actions';
import { modalDismiss } from './actions';

import {
  boxedLayoutMaxWidth,
  background,
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
  background-color: ${(background)}
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
        <Header
          loggedIn={props.account.loggedIn}
          onClickLogout={props.handleClickLogout}
          imageUrl={props.gravatarUrl}
          logoHref={props.logoHref}
          signerAddr={props.signerAddr}
          params={props.params}
        />
        <Content
          fixed={props.fixed}
          name="content-wrapper"
        >
          {React.Children.toArray(props.children)}
        </Content>
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
  params: React.PropTypes.object,
  gravatarUrl: React.PropTypes.string,
  signerAddr: React.PropTypes.string,
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
  signerAddr: makeSignerAddrSelector(),
  sidebarCollapse: makeSelectSidebarCollapse(),
  isModalOpen: makeSelectTransferShow(),
  gravatarUrl: makeSelectGravatar(),
  modalStack: makeModalStackSelector(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(withProgressBar(App));

