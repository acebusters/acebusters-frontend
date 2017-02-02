/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';
import Helmet from 'react-helmet';
import styled, { ThemeProvider } from 'styled-components';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import Header from 'components/Header';
import Footer from 'components/Footer';
import withProgressBar from 'components/ProgressBar';
import makeSelectAccountData from '../AccountProvider/selectors';
import { logout } from '../AccountProvider/actions';
import theme from '../../skin-blue';

const AppWrapper = styled.div`
  max-width: calc(768px + 16px * 2);
  margin: 0 auto;
  display: flex;
  min-height: 100%;
  padding: 0 16px;
  flex-direction: column;
`;

export function App(props) {
  return (
    <AppWrapper>
      <Helmet
        titleTemplate="%s - React.js Boilerplate"
        defaultTitle="React.js Boilerplate"
        meta={[
          { name: 'description', content: 'A React.js Boilerplate application' },
        ]}
      />
      <ThemeProvider theme={theme}>
        <Header loggedIn={props.account.loggedIn} onClickLogout={props.onClickLogout} />
      </ThemeProvider>
      {React.Children.toArray(props.children)}
      <Footer />
    </AppWrapper>
  );
}

App.propTypes = {
  children: React.PropTypes.node,
  account: React.PropTypes.object,
  onClickLogout: React.PropTypes.func,
};

function mapDispatchToProps(dispatch) {
  return {
    onClickLogout: () => dispatch(logout()),
  };
}


const mapStateToProps = createStructuredSelector({
  account: makeSelectAccountData(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(withProgressBar(App));

