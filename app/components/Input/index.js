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
      return `border: 2px solid ${green}`;
    }
    return 'border: 1px solid #ccc';
  }}
  -webkit-box-shadow: 0 0 0px 1000px white inset !important
  padding: 10px;
  border: solid 1px gainsboro;
  -webkit-transition: box-shadow 0.3s, border 0.3s;
  -moz-transition: box-shadow 0.3s, border 0.3s;
  -o-transition: box-shadow 0.3s, border 0.3s;
  transition: box-shadow 0.3s, border 0.3s;
  display: block;
  margin: 0;
  color: black;
  width: 100%;
  font-family: "Open Sans", sans-serif;
  font-size: 18px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;
  -webkit-border-radius: none;
  -moz-border-radius: none;
  -ms-border-radius: none;
  -o-border-radius: none;
  border-radius: 4px;
`;

export const CheckBox = styled.input`
  display: inline-block;
  margin-top: 0.7em;
  margin-right: 1em;
  padding-right: 5px;
  float: left;
`;

export default InputStyled;
