/**
 * Created by helge on 14.02.17.
 */
import styled from 'styled-components';
import {
  navy,
} from 'variables';

export const TableWrapper = styled.div`
   padding: 10% 35% 0% 35%;
`;

export const PokerTable = styled.div`
  min-height: 200px;
  max-height: 100em;
  min-width: 500px;
  max-width: 500px;
  border-radius: 10em;
  background-color: ${navy};
  background-size: 100px 100px;
  border: 2px solid beige;
`;
