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
  padding-bottom: 3em;
  border-radius: 0.5em;
  background: ${white};
  @media (min-width: 768px) {
    width: 750px;
  }

  @media (max-width: 500px) {
    padding-right: 0.5em;
    padding-left: 0.5em;
    padding-top: 1em;
    padding-bottom: 1.5em;
  }
`;

export default Container;
