import React from 'react';
import { storiesOf } from '@storybook/react';
import { fromJS } from 'immutable';

import Slider from '../../index';

export const props = fromJS({
  amount: 100,
  minRaise: 100,
  myStack: 332,
  sb: 50,
  updateAmount: () => {},
});

const stories = storiesOf('Slider', module);

stories.add('Default', () => {
  const newProps = props.toJS();
  return (
    <Slider {...newProps} />
  );
});
