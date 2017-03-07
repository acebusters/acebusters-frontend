/**
 *
 * Button.react.js
 *
 * A common button, if you pass it a prop "route" it'll render a link to a react-router route
 * otherwise it'll render a link with an onclick
 */

import React, { PropTypes, Children } from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`{
  display: inline-block;
  box-sizing: border-box;
  text-decoration: none;
  ${(props) => {
    switch (props.size) {
      case 'small':
        return 'padding: 0.2em 0.4em;font-size: 14px;';
      case 'medium':
        return 'padding: 0.25em 2em;font-size: 16px;';
      case 'large':
        return 'padding: 0.5em 4em;font-size: 16px;';
      default:
        return 'padding: 0.25em 2em;font-size: 18px;';
    }
  }}
  border-radius: 4px;
  -webkit-font-smoothing: antialiased;
  -webkit-touch-callout: none;
  user-select: none;
  cursor: pointer;
  outline: 0;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-weight: bold;
  font-size: 16px;
  ${(props) => {
    if (props.disabled) {
      return 'border: 2px solid grey; color: grey;';
    }
    return 'border: 2px solid #41addd; color: #41addd;';
  }}
  

  &:active {
    background: #41addd;
    color: #fff;
  }
}`;

const Wrapper = styled.div`
  text-align: center;
  float: left;
`;

function Button(props) {
  // Render an anchor tag
  const button = (
    <StyledButton onClick={props.onClick} size={props.size} type={props.type} disabled={props.disabled}>
      {Children.toArray(props.children)}
    </StyledButton>
  );

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
  disabled: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

export default Button;
