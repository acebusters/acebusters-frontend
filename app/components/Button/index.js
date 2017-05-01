/**
 *
 * Button.react.js
 *
 * A common button, if you pass it a prop "route" it'll render a link to a react-router route
 * otherwise it'll render a link with an onclick
 */

import React, { PropTypes, Children } from 'react';
import styled from 'styled-components';

import {
  baseColor,
  disabled,
  black,
  white,
  background,
  hover,
} from '../../variables';

const Medium = styled.button`{
  display: block;
  box-sizing: border-box;
  text-decoration: none;
  margin: 0 auto;
  padding: 0.1em 0.5em;
  font-size: 10em;
  border-radius: 4px;
  -webkit-font-smoothing: antialiased;
  -webkit-touch-callout: none;
  user-select: none;
  cursor: pointer;
  outline: 0;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-weight: bold;
  font-size: 16px;
  background-color: ${black};
  color: ${white};
 
  &:active {
    color: ${baseColor};
  }
  
  &:hover {
    color: ${baseColor};
  }
}`;

const Large = styled.button`
  display: block;
  box-sizing: border-box;
  text-decoration: none;
  margin: 0 auto;
  padding: 10px;
  font-size: 10em;
  border-radius: 4px;
  -webkit-font-smoothing: antialiased;
  -webkit-touch-callout: none;
  user-select: none;
  cursor: pointer;
  outline: 0;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-weight: bold;
  font-size: 24px;
  color: ${white};
  width: 100%;
  background-color: ${baseColor};
  &:active {
    color: ${baseColor};
    background-color: ${background};
  }
  
  &:hover {
    color: ${white};
    background-color: ${hover};
  }
  
  &:disabled {
    color: ${background};
    background-color: ${disabled};
    border-color: ${disabled};
    cursor: not-allowed;
  }
`;

const Icon = styled.i`
  padding-left: 0.5em;
  ${(props) => {
    if (props.content.length === 0) {
      return 'padding-right: 0.5em;';
    }
    return 'padding-right: 0';
  }}
`;

const Wrapper = styled.div`
  text-align: center;
  width: 100%;
`;

function Button(props) {
  // Render an anchor tag
  const icon = props.icon ? props.icon : '';
  let button;
  switch (props.size) {
    case 'medium': {
      button = (
        <Medium onClick={props.onClick} type={props.type} disabled={props.disabled}>
          {Children.toArray(props.children)}
          { props.icon &&
          <Icon className={icon} content={Children.toArray(props.children)}></Icon>
          }
        </Medium>
      );
      break;
    }

    case 'large': {
      button = (
        <Large onClick={props.onClick} type={props.type} disabled={props.disabled}>
          {Children.toArray(props.children)}
          { props.icon &&
          <Icon className={icon} content={Children.toArray(props.children)}></Icon>
          }
        </Large>
      );
      break;
    }

    default: {
      button = (
        <Medium onClick={props.onClick} type={props.type} disabled={props.disabled}>
          {Children.toArray(props.children)}
          { props.icon &&
          <Icon className={icon} content={Children.toArray(props.children)}></Icon>
          }
        </Medium>
      );
    }
  }
  return (
    <Wrapper>
      {button}
    </Wrapper>
  );
}

Button.propTypes = {
  onClick: PropTypes.func,
  type: PropTypes.string,
  size: PropTypes.string,
  icon: PropTypes.string,
  disabled: PropTypes.bool,
  children: PropTypes.node,
};

export default Button;
