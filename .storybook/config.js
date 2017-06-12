/* eslint no-ignore: "off", global-require: "off" */
import { configure } from '@storybook/react';

function loadStories() {
  require('../app/components/TableMenu/stories');
}

configure(loadStories, module);
