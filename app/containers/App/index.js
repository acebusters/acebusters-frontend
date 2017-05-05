import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { ModalContainer, ModalDialog } from 'kd-react-modal-dialog';
import { browserHistory } from 'react-router';
import Header from 'components/Header';
import Footer from 'components/Footer';
import Content from 'components/Content';
import withProgressBar from 'components/ProgressBar';

import { landingPageUrl } from '../../app.config';
import makeSelectAccountData, { makeSignerAddrSelector } from '../AccountProvider/selectors';
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
  ${(props) => {
    if (props.params.tableAddr) {
      return `
              background: #000000; /* Old browsers */
              background: -moz-linear-gradient(-45deg,  #000000 0%, #1a2d3d 93%); /* FF3.6-15 */
              background: -webkit-linear-gradient(-45deg,  #000000 0%,#1a2d3d 93%); /* Chrome10-25,Safari5.1-6 */
              background: linear-gradient(135deg,  #000000 0%,#1a2d3d 93%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
              filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#000000', endColorstr='#1a2d3d',GradientType=1 ); /* IE6-9 fallback on horizontal gradient */`;
    }
    return background;
  }};
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
      <StyledDashboard
        params={props.params}
      >
        <Header
          loggedIn={props.account.loggedIn}
          onClickLogout={props.handleClickLogout}
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
      { props.location.pathname.indexOf('table') === -1 &&
        <Footer />
      }
      { modalContent &&
        <ModalContainer>
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
  location: React.PropTypes.object,
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
  workerProgress: selectWorkerProgress,
  isModalOpen: makeSelectTransferShow(),
  modalStack: makeModalStackSelector(),
  progress: makeSelectProgress(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(withProgressBar(App));
