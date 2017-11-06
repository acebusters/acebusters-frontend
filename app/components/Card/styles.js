import styled, { keyframes } from 'styled-components';
import { scaleSeat } from '../../utils/styleUtils';
import { smallShadow } from '../../variables';

import { boardCardFall } from './constants';

const flipAnim = keyframes`
  from { transform: rotateY(180deg); }
  to { transform: rotateY(0deg); }
`;

const boardCardEnterAnim = keyframes`
  0% {
    opacity: 0.3;
    transform: translateY(-500%);
  }
  100% {
    opacity: 1;
    transform: translateY(0%);
  }
`;

export const CardStyle = styled.img`
  max-width: 100%;
  height: auto;
  box-shadow: ${smallShadow};
`;

// BoardCards
const boardCardDelay = (animNumber) => {
  let delay = '0ms';
  if (animNumber <= 2) {
    delay = `${animNumber * 100}ms`;
  }
  return delay;
};

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
  animation: ${boardCardEnterAnim} ${boardCardFall} cubic-bezier(0.57, 0.2, 0.75, 1.1);
  animation-delay: ${(props) => boardCardDelay(props.animNumber)};
  animation-fill-mode: both;
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

// FlipCard
export const FlipCardContainer = styled.section`
  height: 100%;
  width: 100%;
  perspective: 200px;
  position: relative;
`;

export const FlipCardWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  animation: ${flipAnim} 800ms;
  animation-delay: ${(props) => props.animDelay};
  animation-fill-mode: backwards;
  transform-style: preserve-3d;
`;

const FlipCard = styled.figure`
  margin: 0;
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
`;

export const CardFront = styled(FlipCard)``;

export const CardBack = styled(FlipCard)`
  transform: rotateY(180deg);
`;
