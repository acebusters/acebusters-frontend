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
  display: inline-block;
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

  & + & {
    margin-left: 10px;
  }
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

const sizes = {
  medium: Medium,
  large: Large,
};

function Button({
  icon = '',
  children,
  ...props
}) {
  // Render an anchor tag
  const ButtonComponent = getButtonComponent(props);

  return (
    <ButtonComponent {...props}>
      {Children.toArray(children)}
      {icon &&
        <Icon className={icon} content={Children.toArray(children)}></Icon>
      }
    </ButtonComponent>
  );
}

Button.propTypes = {
  onClick: PropTypes.func,
  type: PropTypes.string,
  size: PropTypes.oneOf(['large', 'medium']),
  icon: PropTypes.string,
  disabled: PropTypes.bool,
  children: PropTypes.node,
};

function getButtonComponent({ size, href }) {
  const component = sizes[size] || Medium;

  if (href) {
    return component.withComponent(SharedButton.withComponent('a'));
  }

  return component;
}

export default Button;
