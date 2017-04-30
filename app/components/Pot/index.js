/**
 * Copyright (c) 2017 Acebusters
 * Use of this source code is governed by an ISC
 * license that can be found in the LICENSE file.
*/

import React from 'react';
import styled from 'styled-components';
import { chipValues } from '../../app.config';
import {
  white,
} from '../../variables';

export const Chip = styled.div`
  background: ${(props) => props.color};
  position: absolute;
  font-size:1.2em;
  position:relative;
  display:inline-block;
  -webkit-box-sizing:border-box;
  -moz-box-sizing:border-box;
  box-sizing:border-box;
  width:1em;
  height:1em;
  border-radius:50%;
  position:relative;
  border:.1em dashed white;
  transition:all .1s ease;
  backface-visibility:hidden;
  transform: perspective(200px) rotateX(55deg) rotateZ(-40deg);
  box-shadow:
  -1px 1px 0px #555,
  -2px 2px 0px #555,
  -3px 3px 0px #555,
  -4px 4px 0px #555,
  -2px 2px 2px #555;
`;

const Amount = styled.div`
  position: absolute;
  top: -5%;
  left: 140%;
  color: ${white};
`;

const Wrapper = styled.div`
  position: absolute;
  top: ${(props) => props.top};
  left: ${(props) => props.left};
`;

const calculateChipStacks = (potSize, index, chipStacks = []) => {
  let remaining = potSize;
  let newIndex = index;
  if (remaining <= 0) {
    return chipStacks;
  }
  if (chipValues[index][0] <= remaining) {
    remaining -= chipValues[index][0];
    chipStacks.push(chipValues[index]);
  } else {
    newIndex += 1;
  }
  return calculateChipStacks(remaining, newIndex, chipStacks);
};

function Pot(props) {
  const chipsArray = calculateChipStacks(props.potSize, 0);
  const chips = chipsArray.map((chip, i) => (<Chip color={chip[1]} key={i} />));
  return (
    <Wrapper top={props.top} left={props.left}>
      { chips }
      <Amount>{ props.potSize }</Amount>
    </Wrapper>
  );
}

Pot.propTypes = {
  potSize: React.PropTypes.number,
  top: React.PropTypes.string,
  left: React.PropTypes.string,
};

export default Pot;
