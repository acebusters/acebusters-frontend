import React from 'react';
import { storiesOf } from '@storybook/react';
import {
  withKnobs,
  text,
  boolean,
  number,
} from '@storybook/addon-knobs';

import tests, { combine } from '../tests';
import * as tests2 from '../tests2';

import ActionBar from '../../index';

const stories = storiesOf('ActionBar', module);

const createStory = (test) => {
  stories.add(combine(test.describe, test.it), () => (
    <ActionBar {...test.props} />
  ));
};

stories.addDecorator(withKnobs);

stories.add('Kitchen Sink', () => (
  <ActionBar
    active={boolean('active', true)}
    amount={number('amount', 200)}
    amountToCall={number('amountToCall', 100)}
    callAmount={number('callAmount', 0)}
    handleFold={() => {}}
    handleCall={() => {}}
    handleCheck={() => {}}
    handleBet={() => {}}
    isMyTurn={boolean('isMyTurn', true)}
    minRaise={number('minRaise', 200)}
    mode={text('mode', null)}
    myStack={number('myStack', 10000)}
    params={{ tableAddr: '0x33' }}
    potSize={number('potSize', 400)}
    setActionBarBetSlider={() => {}}
    sliderOpen={boolean('sliderOpen', false)}
    state={text('state', 'flop')}
    updateAmount={() => {}}
    visible={boolean('visible', true)}
  />
));

createStory(tests2.atTable0);
createStory(tests2.atTable1);
createStory(tests2.atTable2);
createStory(tests2.amountToCheck);
createStory(tests2.actionDispatchCheck);
createStory(tests2.amountToCall0);
createStory(tests2.actionDispatchCall);
createStory(tests2.amountToCall1);
createStory(tests2.minRaise0);
createStory(tests2.actionDispatchAllIn);
createStory(tests2.actionDispatchFold);
createStory(tests2.buttonBet0);
createStory(tests2.buttonBet1);
createStory(tests2.actionDispatchBet);
createStory(tests2.buttonRaise0);
createStory(tests2.buttonRaise1);
createStory(tests2.actionDispatchRaise);

// iterate over tests and add a story for each
tests.forEach((test) => {
  stories.add(combine(test.describe, test.it), () => (
    <ActionBar {...test.props} />
  ));
});
