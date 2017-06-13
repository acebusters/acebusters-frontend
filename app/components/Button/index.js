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
  text-align: ${(props) => props.align};
  width: 100%;
`;

const sizes = {
  medium: Medium,
  large: Large,
};

function Button({
  size = 'medium',
  icon = '',
  align = 'center',
  ...props
}) {
  // Render an anchor tag
  const ButtonComponent = sizes[size] || Medium;

  return (
    <Wrapper align={align}>
      <ButtonComponent onClick={props.onClick} type={props.type} disabled={props.disabled}>
        {Children.toArray(props.children)}
        {icon &&
          <Icon className={icon} content={Children.toArray(props.children)}></Icon>
        }
      </ButtonComponent>
    </Wrapper>
  );
}

Button.propTypes = {
  onClick: PropTypes.func,
  type: PropTypes.string,
  size: PropTypes.oneOf(['large', 'medium']),
  align: PropTypes.oneOf(['center', 'left']),
  icon: PropTypes.string,
  disabled: PropTypes.bool,
  children: PropTypes.node,
};

export default Button;
