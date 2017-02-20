/**
 * Created by helge on 17.02.17.
 */

import React from 'react';
import { ActionBarWrapper } from './ActionBarWrapper';

function ActionBarComponent(props) {
  return (
    <ActionBarWrapper {...props}></ActionBarWrapper>
  );
}

ActionBarComponent.propTypes = {};

export default ActionBarComponent;
