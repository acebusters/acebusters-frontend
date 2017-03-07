/**
 * Created by helge on 26.02.17.
 */

import styled from 'styled-components';
import { green } from '../../variables';


const Input = styled.input`
  ${(props) => {
    if (props.touched && !props.error) {
      return `border: 2px solid ${green}`;
    }
    return 'border: 1px solid #ccc';
  }}
  height: 34px;
  padding: 6px 12px;
  font-size: 14px;
  line-height: 1.42857143;
  color: #555;
  ${($props) => `type:${$props.placeholder}`};
  float:left;
  width: 100%;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
`;

export default Input;
