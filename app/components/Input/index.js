/**
 * Created by helge on 26.02.17.
 */

import styled from 'styled-components';


const Input = styled.input`
  height: 34px;
  padding: 6px 12px;
  font-size: 14px;
  line-height: 1.42857143;
  color: #555;
  ${($props) => `type:${$props.placeholder}`};
  float:left;
  background-color: #fff;
  background-image: none;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

export default Input;
