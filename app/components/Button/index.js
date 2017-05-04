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

const SharedButton = styled.button`
  display: block;
  box-sizing: border-box;
  text-decoration: none;
  margin: 0 auto;
  border-radius: 4px;
  user-select: none;
  cursor: pointer;
  outline: 0;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-weight: bold;
  color: ${white};
`;

const Medium = styled(SharedButton)`{
  padding: 0.1em 0.5em;
  font-size: 16px;
  background-color: ${black};

  &:hover {
    color: ${baseColor};
  }

  &:active {
    color: ${baseColor};
  }
}`;

const Large = styled(SharedButton)`
  padding: 10px;
  font-size: 24px;
  width: 100%;
  background-color: ${baseColor};

  &:hover {
    color: ${white};
    background-color: ${hover};
  }

  &:active {
    color: ${baseColor};
    background-color: ${background};
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
