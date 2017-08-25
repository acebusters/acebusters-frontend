/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import H1 from '../../components/H1';

import { backgroundBoxed } from '../../variables';

import messages from './messages';


const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${backgroundBoxed};
`;

export default function NotFound() {
  return (
    <Wrapper>
      <H1>
        <FormattedMessage {...messages.header} />
      </H1>
    </Wrapper>
  );
}
