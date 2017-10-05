/**
 *
 * Button.react.js
 *
 * A common button, if you pass it a prop "route" it'll render a link to a react-router route
 * otherwise it'll render a link with an onclick
 */

import React, { Children } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import A from '../A';

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

  &:hover {
    color: ${baseColor};
  }

  &:active {
    color: ${baseColor};
  }

  &:disabled {
    cursor: default;
  }
`;

const Small = styled(SharedButton)`
  padding: 0.1em 0.5em;
  font-size: 16px;
  background-color: ${black};

  &:disabled {
    color: ${white};
    opacity: 0.6;
  }
`;

const Medium = styled(SharedButton)`
  margin: 0.2em;
  padding: 0.7em 1.2em;
  font-size: 16px;
  background-color: ${black};

  &:disabled {
    color: ${white};
    opacity: 0.6;
  }
`;

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
  }
`;

const Icon = styled.i`
  padding-left: 0.5em;
  padding-right: ${(props) => props.content.length === 0 ? '0.5em' : 0};
`;

const sizes = {
  medium: Medium,
  large: Large,
  small: Small,
  link: A,
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
  size: PropTypes.oneOf(['large', 'medium', 'small', 'link']),
  icon: PropTypes.string,
  disabled: PropTypes.bool,
  children: PropTypes.node,
};

function getButtonComponent({ size, href }) {
  const component = sizes[size] || Small;

  if (href) {
    return component.withComponent(SharedButton.withComponent('a'));
  }

  return component;
}

export default Button;
