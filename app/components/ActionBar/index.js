/**
 * Created by helge on 17.02.17.
 */

import React from 'react';
import styled from 'styled-components';

const ControlPanel = styled.div`
  float:right;
  width: 50%;
  min-width: 550px;
`;

const ActionBarWrapper = styled.div`
  position: fixed;
  bottom: 0;
  height: 15%;
  width: 100%;
  background: #f5f5f5;
`;

function ActionBarComponent(props) {
  return (
    <ActionBarWrapper {...props} id="action-bar">
      <ControlPanel {...props}>
      </ControlPanel>
    </ActionBarWrapper>
  );
}

ActionBarComponent.propTypes = {};

export default ActionBarComponent;
