import React from 'react';
import { storiesOf } from '@storybook/react';
import {
  withKnobs,
  text,
  boolean,
  number,
} from '@storybook/addon-knobs';

import tests, { combine } from '../tests';

import ActionBar from '../../index';

const stories = storiesOf('ActionBar', module);

stories.addDecorator(withKnobs);

stories.add('Kitchen Sink', () => (
  <ActionBar
    active={boolean('active', true)}
    amount={number('amount', 100)}
    amountToCall={number('amountToCall', 100)}
    callAmount={number('callAmount', 0)}
    isMyTurn={boolean('isMyTurn', true)}
    minRaise={number('minRaise', 0)}
    myStack={number('myStack', 10000)}
    state={text('state', 'flop')}
    params={{ tableAddr: '0x33' }}
  />
));
// iterate over tests and add a story for each
tests.forEach((test) => {
  stories.add(combine(test.describe, test.it), () => (
    <ActionBar {...test.props} />
  ));
});
