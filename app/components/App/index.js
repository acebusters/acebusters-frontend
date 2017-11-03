import React from 'react';
import PropTypes from 'prop-types';

import Content from 'components/Content';
import GoogleTagManager from 'containers/GTM';
import Modal from 'containers/Modal';
import { conf } from '../../app.config';

const App = (props) => (
  <div name="app-container">
    <GoogleTagManager gtmId={conf().gtmId} />

    <Content fixed={props.fixed} name="content-wrapper">
      {React.Children.toArray(props.children)}
    </Content>

    <Modal />
  </div>
);
App.defaultProps = {
  fixed: false,
  initialCollapse: true,
};
App.propTypes = {
  children: PropTypes.node,
  fixed: PropTypes.bool,
};

export default App;
