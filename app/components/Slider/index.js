/**
 * Created by helge on 09.03.17.
 */

import styled from 'styled-components';

export const Slider = styled.input`
  float:left;
  width: 100%;
  margin: 2.5px 0;
`;

export const SliderVertical = styled.input`
  position: fixed;
  right: 5%;
  -webkit-appearance: none;
  writing-mode: bt-lr; /* IE */
  -webkit-appearance: slider-vertical; /* WebKit */
  width: 8px;
  height: 50%;
`;
