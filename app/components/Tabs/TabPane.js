import React from 'react';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';

import {
  baseColor,
  gray,
} from '../../variables';

const TabPaneItem = styled.li`
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-family: 'Source Sans Pro','Helvetica Neue',Helvetica,Arial,sans-serif;
    font-weight: 400;
    font-size: 14px;
    line-height: 1.428571429;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    float: left;
    display: block;
    ${(props) => {
      if (props.active) {
        return `border-bottom:2px solid ${baseColor}`;
      }
      return '';
    }}
    padding: 15px 10px 15px 10px;
    position: relative;
    text-decoration: none;  
    height: 100%;
    border-left: none;
    cursor: pointer;
`;

export const TabPaneWrapper = styled.ul`
    color: #333;
    font-weight: 400;
    border-bottom: 1px solid ${gray};
    position: relative;
    min-height: 50px;
    margin-bottom: 0;
    border-radius: 0;
    -webkit-margin-before: 1em;
    -webkit-margin-after: 1em;
    -webkit-margin-start: 0px;
    -webkit-margin-end: 0px;
    -webkit-padding-start: 40px;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    display: block;
    margin: 0;
    padding: 0;
`;

const TabPane = function (props) {
  return (
    <TabPaneItem
      active={props.active}
      onClick={() => props.setActive(props.index)}
    >
      <FormattedMessage {...props.message} />
    </TabPaneItem>
  );
};

TabPane.propTypes = {
  index: React.PropTypes.number,
  active: React.PropTypes.bool,
  setActive: React.PropTypes.func,
  message: React.PropTypes.object,
};

export default TabPane;
