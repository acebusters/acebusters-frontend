import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import Header from 'components/Header';
import Footer from 'components/Footer';
import Content from 'components/Content';
import Sidebar from 'components/Sidebar';
import withProgressBar from 'components/ProgressBar';
import makeSelectAccountData from '../AccountProvider/selectors';
import TransferDialog from '../TransferDialog';
import { makeSelectSidebarCollapse, makeSelectTransferShow } from './selectors';
import { setAuthState } from '../AccountProvider/actions';
import { sidebarToggle, transferToggle } from './actions';
import Modal from './modal';
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

const sb = () => ([
  <Sidebar.UserPanel
    name="Alexander Pierce"
    image="public/user2-160x160.jpg"
    online
    key="1"
  />,
  <Sidebar.Search key="2" />,
  <Sidebar.Menu header="MAIN NAVIGATION" key="3">
    <Sidebar.Menu.Item
      icon={{ className: 'fa-files-o' }}
      labels={[{ key: 1, type: 'primary', text: '4' }]}
      title="Layout Options"
    >
      <Sidebar.Menu.Item title="Top Navigation" />
      <Sidebar.Menu.Item title="Boxed" href="/boxed" />
      <Sidebar.Menu.Item title="Fixed" />
      <Sidebar.Menu.Item title="Collapsed Sidebar" />
    </Sidebar.Menu.Item>
    <Sidebar.Menu.Item
      icon={{ className: 'fa-th' }}
      labels={[{ key: 1, type: 'success', text: 'new' }]}
      title="Widgets"
    />
  </Sidebar.Menu>,
  <Sidebar.Menu header="LABELS" key="4">
    <Sidebar.Menu.Item icon={{ color: 'danger' }} title="Danger" />
    <Sidebar.Menu.Item icon={{ color: 'warning' }} title="Warning" />
    <Sidebar.Menu.Item icon={{ color: 'information' }} title="Information" />
  </Sidebar.Menu>,
]);

export function App(props) {
  return (
    <div>
      <StyledDashboard>
        <ThemeProvider theme={theme}>
          <Header
            loggedIn={props.account.loggedIn}
            onClickLogout={props.handleClickLogout}
            sidebarToggle={props.sidebarToggle}
          />
        </ThemeProvider>
        {props.account.loggedIn && <ThemeProvider theme={theme}>
          <Sidebar
            fixed={props.fixed}
            sidebarCollapse={props.sidebarCollapse}
            sidebarMini={props.sidebarMini}
          >
            {sb()}
          </Sidebar>
        </ThemeProvider>}
        <ThemeProvider theme={theme}>
          <Content
            fixed={props.fixed}
            name="content-wrapper"
            sidebarCollapse={props.sidebarCollapse}
            sidebarMini={props.sidebarMini}
          >
            {React.Children.toArray(props.children)}
            <Footer />
          </Content>
        </ThemeProvider>
      </StyledDashboard>
      <Modal isOpen={props.isModalOpen} transferToggle={props.transferToggle}>
        <TransferDialog />
      </Modal>
    </div>
  );
}

App.defaultProps = {
  fixed: false,
  initialCollapse: true,
  sidebarMini: true,
};


App.propTypes = {
  children: React.PropTypes.node,
  account: React.PropTypes.object,
  handleClickLogout: React.PropTypes.func,
  sidebarToggle: React.PropTypes.func,
  transferToggle: React.PropTypes.func,
  fixed: React.PropTypes.bool,
  sidebarCollapse: React.PropTypes.bool,
  sidebarMini: React.PropTypes.bool,
  isModalOpen: React.PropTypes.bool,
};

function mapDispatchToProps(dispatch) {
  return {
    handleClickLogout: () => dispatch(setAuthState({ loggedIn: false })),
    sidebarToggle: () => dispatch(sidebarToggle()),
    transferToggle: () => dispatch(transferToggle()),
  };
}


const mapStateToProps = createStructuredSelector({
  account: makeSelectAccountData(),
  sidebarCollapse: makeSelectSidebarCollapse(),
  isModalOpen: makeSelectTransferShow(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(withProgressBar(App));

