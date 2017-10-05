import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { chipValues, seatChipColor } from '../../app.config';
import { white } from '../../variables';
import { formatNtz } from '../../utils/amountFormatter';

export const Chip = styled.div`
  position: absolute;
  box-sizing: border-box;
  left: 0;
  bottom: ${(props) => `${0.3 * props.index}em`};
  width: 1em;
  height: 1em;
  border-radius: 50%;
  border: .1em dashed white;
  transition: all .1s ease;
  transform: perspective(200px) rotateX(55deg) rotateZ(-40deg);
  box-shadow:
    -1px 1px 0px #555,
    -2px 2px 0px #555,
    -3px 3px 0px #555,
    -4px 4px 0px #555,
    -2px 2px 2px #555;
  font-size: 1.2em;
  backface-visibility: hidden;
  background: ${(props) => props.color};
`;

const ChipStack = styled.div`
  float: left;
  position: relative;
  margin-right: 0.5em;
  width: 1em;
  height: 2em;
  z-index: 2000;
`;

const Amount = styled.div`
  color: ${white};
  float: left;
  margin-top: 0.5em;
`;

const Wrapper = styled.div`
  position: absolute;
  min-width: 4em;
  z-index: 1000;
  top: ${(props) => props.top};
  left: ${(props) => props.left};
`;

const createChipStacks = (chipVals, potSize) => {
  // Note: chipValue format is [value, color]
  const ret = chipVals.reduce((prev, chipValue) => {
    const { stacks, remain } = prev;
    const value = chipValue[0];

    if (remain <= 0 || remain < value) return prev;

    return {
      remain: remain % value,
      stacks: [
        ...stacks,
        {
          value: chipValue[0],
          color: chipValue[1],
          count: Math.floor(remain / value),
        },
      ],
    };
  }, { stacks: [], remain: potSize });

  return ret.stacks;
};

const range = (start, end, step = 1) => {
  const ret = [];

  for (let i = start; i < end; i += step) {
    ret.push(i);
  }

  return ret;
};

function Pot(props) {
  const chipStacks = createChipStacks(chipValues, props.potSize);

  return (
    <Wrapper name="stack-wrapper" top={props.top} left={props.left}>
      {!props.short ?
        chipStacks.map((stack, i) => (
          <ChipStack index={i} key={i}>
            {range(0, stack.count).map((j) => (
              <Chip color={stack.color} index={j} key={j} />
            ))}
          </ChipStack>
        )) :
        <ChipStack index={0} key={0}>
          <Chip color={seatChipColor} index={0} key={0} />
        </ChipStack>
      }
      <Amount>{ formatNtz(props.potSize) }</Amount>
    </Wrapper>
  );
}

Pot.propTypes = {
  potSize: PropTypes.number,
  top: PropTypes.string,
  left: PropTypes.string,
  short: PropTypes.bool,
};

export default Pot;
