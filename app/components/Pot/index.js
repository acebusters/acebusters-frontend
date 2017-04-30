/**
 * Created by helge on 30.04.17.
 */
import React from 'react';
import styled from 'styled-components';
import { chipValues } from '../../app.config';

export const Chip = styled.div`
  color: ${(props) => props.color};
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

const Wrapper = styled.div`
  position: absolute;
  right: ${(props) => props.right};
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
    <Wrapper right={props.right} left={props.left}>
      { chips }
    </Wrapper>
  );
}

Pot.propTypes = {
  potSize: React.PropTypes.number,
  right: React.PropTypes.number,
  left: React.PropTypes.number,
};

export default Pot;
