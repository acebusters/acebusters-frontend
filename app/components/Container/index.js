/**
 * Created by helge on 26.02.17.
 */

import styled from 'styled-components';
import {
  white,
} from '../../variables';

const Container = styled.div`
  margin: 3em auto;
  padding-right: 2em;
  padding-left: 2em;
  padding-top: 2em;
  border-radius: 0.5em;
  min-height: 50em;
  background: ${white};
  @media (min-width: 768px) {
    width: 750px;
  }
`;

export default Container;
