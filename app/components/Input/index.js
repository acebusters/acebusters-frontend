/**
 * Created by helge on 26.02.17.
 */

import styled from 'styled-components';

import {
  green,
} from '../../variables';

const InputStyled = styled.input`
  ${(props) => {
    if (props.touched && !props.error) {
      return `border: solid 2px ${green}`;
    }
    return 'border: solid 1px #ccc';
  }};
  padding: 10px;
  margin: 0;
  border: solid 1px gainsboro;
  border-radius: 4px;
  display: block;
  width: 100%;
  appearance: none;
  box-shadow: none;
  color: black;
  font-family: "Open Sans", sans-serif;
  font-size: 18px;
  transition: box-shadow 0.3s, border 0.3s;
`;

// focus on this element is handled by component state
export const InputWithUnit = styled.input`
  ${(props) => {
    if (props.touched && !props.error) {
      return `border: solid 2px ${green}`;
    }
    return '';
  }};
  padding: 10px;
  margin: 0;
  width: 100%;
  color: black;
  text-align: right;
  font-family: "Open Sans", sans-serif;
  font-size: 18px;
  transition: box-shadow 0.3s, border 0.3s;
  &:focus {
    outline: none;
  }
`;

export const CheckBox = styled.input`
  display: inline-block;
  margin-top: 0.7em;
  margin-right: 1em;
  padding-right: 5px;
  float: left;
`;

export default InputStyled;
