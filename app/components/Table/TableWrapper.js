/**
 * Created by helge on 14.02.17.
 */
import styled from 'styled-components';

import {
  lightBlue,
} from 'variables';

export const TableWrapper = styled.div`
   padding: 30% 22% 0% 22%;
   position: relative;
`;

export const PokerTable = styled.div`
  min-height: 20em;
  max-height: 20em;
  min-width: 420px;
  position: relative;
  border-radius: 10em;
  background-color: ${lightBlue};
  background-size: 100px 100px;
  border: 2px solid beige;
`;

export const SeatsWrapper = styled.div`
  position: relative
`;
