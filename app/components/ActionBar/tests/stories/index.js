import React from 'react';
import { storiesOf } from '@storybook/react';
import {
  withKnobs,
  text,
  boolean,
  number,
} from '@storybook/addon-knobs';

import * as tests from '../tests';

import ActionBar from '../../index';

const createStory = (test) => {
  stories.add(tests.combine(test.describe, test.it), () => (
    <ActionBar {...test.props} />
  ));
};

const stories = storiesOf('ActionBar', module);

stories.addDecorator(withKnobs);

stories.add('Kitchen Sink', () => (
  <ActionBar
    active={boolean('active', true)}
    amount={number('amount', 200)}
    amountToCall={number('amountToCall', 100)}
    buttonActive={text('buttonActive', '')}
    callAmount={number('callAmount', 0)}
    handleFold={() => {}}
    handleCall={() => {}}
    handleCheck={() => {}}
    handleBet={() => {}}
    isMyTurn={boolean('isMyTurn', true)}
    minRaise={number('minRaise', 200)}
    mode={text('mode', '')}
    myStack={number('myStack', 10000)}
    params={{ tableAddr: '0x33' }}
    potSize={number('potSize', 400)}
    setActionBarButtonActive={() => {}}
    sliderOpen={boolean('sliderOpen', false)}
    state={text('state', 'flop')}
    turnComplete={boolean('turnComplete', false)}
    updateAmount={() => {}}
    visible={boolean('visible', true)}
  />
));

createStory(tests.atTable0);
createStory(tests.atTable1);
createStory(tests.atTable2);
createStory(tests.amountToCheck);
createStory(tests.amountToCall0);
createStory(tests.amountToCall1);
createStory(tests.minRaise0);
createStory(tests.buttonBet0);
createStory(tests.buttonBet1);
createStory(tests.buttonRaise0);
createStory(tests.buttonRaise1);
createStory(tests.actionDispatchRaise0);
