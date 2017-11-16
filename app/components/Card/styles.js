import styled from 'styled-components';
import { scaleSeat } from '../../utils/styleUtils';
import { smallShadow } from '../../variables';

export const CardStyle = styled.img`
  max-width: 100%;
  height: auto;
  box-shadow: ${smallShadow};
`;

// BoardCards
export const BoardContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  justify-content: flex-start;
  width: 255px;
  height: auto;
  transform: translate(-50%, -50%);
  margin: 0;
`;

export const BoardCardWrapper = styled.div`
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  perspective: 200px;
  margin-left: 0.5em;
`;

// HoleCards
export const HoleCardContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-right: ${scaleSeat(4)};
  margin-top: ${(props) => (props.empty ? scaleSeat(40) : 0)};

  background-color: none;
`;

export const CardShared = styled.section`
  background-color: none;
  margin-right: ${scaleSeat(2)};
  width: ${scaleSeat(36)};
`;

export const DownWrapper = styled(CardShared)`
  height: ${scaleSeat(12)};
  margin-top: ${scaleSeat(28)};
`;

export const UpWrapper = styled(CardShared)`
  height: ${scaleSeat(40)};
`;
