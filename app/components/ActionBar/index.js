/**
 * Created by helge on 17.02.17.
 */

import React from 'react';
import styled from 'styled-components';

const ControlPanel = styled.div`
  float:right;
  width: 100%;
`;

const ActionBarWrapper = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
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
