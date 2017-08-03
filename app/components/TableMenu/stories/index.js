import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean/* number */ } from '@storybook/addon-knobs';

import TableMenu from '../index';

import { blocky } from '../../../app.config';

const stories = storiesOf('TableMenu', module);

stories.addDecorator(withKnobs);

stories.add('guest menu', () => {
  const guestClose = {
    blocky: null,
    loggedIn: false,
    nickName: 'Guest',
    open: boolean('open', false),
  };
  return <TableMenu {...guestClose} />;
});

stories.add('user menu', () => {
  const guestClose = {
    blocky,
    loggedIn: true,
    nickName: text('nickName', 'DAWN'),
    open: boolean('open', false),
  };
  return <TableMenu {...guestClose} />;
});
