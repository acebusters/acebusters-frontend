import styled, { keyframes } from 'styled-components';
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

const prop = (propName) => (props) => props[propName];

export const CardContainer = styled.div`
  position: relative;
  width: ${prop('cardWidth')}px;
  height: ${prop('cardHeight')}px;

  & + & {
    margin-left: 0.5em;
  }
`;

const CardWrapper = styled.div`
  position: absolute;
  width: ${prop('cardWidth')}px;
  height: ${prop('cardHeight')}px;
  backface-visibility: hidden;
`;

const enterBoard = (front = true) => keyframes`
  0% {
    opacity: 0.3;
    transform: rotateY(${front ? 180 : 0}deg) translateY(-400px);
  }

  70% {
    opacity: 1;
    transform: rotateY(${front ? 180 : 0}deg) translateY(0);
  }

  100% {
    opacity: 1;
    transform: rotateY(${front ? 0 : 180}deg);
  }
`;

const leaveBoard = (front = true) => keyframes`
  0% {
    opacity: 1;
    transform: rotateY(${front ? 0 : 180}deg);
  }

  30% {
    opacity: 1;
    transform: rotateY(${front ? 180 : 0}deg) translateY(0);
  }

  100% {
    opacity: 0.3;
    transform: rotateY(${front ? 180 : 0}deg) translateY(-400px);
  }
`;

export const BoardFront = styled(CardWrapper)`
  opacity: 0;
  animation: ${(props) => (props.leaving ? leaveBoard : enterBoard)(true)} 1.5s;
  animation-delay: ${(props) => props.animNum * (props.leaving ? 0 : 0.1)}s;
  animation-fill-mode: forwards;
`;

export const BoardBack = styled(CardWrapper)`
  opacity: 0;
  animation: ${(props) => (props.leaving ? leaveBoard : enterBoard)(false)} 1.5s;
  animation-delay: ${(props) => props.animNum * (props.leaving ? 0 : 0.1)}s;
  animation-fill-mode: forwards;
`;


const enterHole = (front = true) => keyframes`
  0% {
    opacity: 0.3;
    transform: rotateY(${front ? 180 : 0}deg);
  }

  100% {
    opacity: 1;
    transform: rotateY(${front ? 0 : 180}deg);
  }
`;

const leaveHole = (front = true) => keyframes`
  0% {
    opacity: 1;
    transform: rotateY(${front ? 0 : 180}deg);
  }

  100% {
    opacity: 0.3;
    transform: rotateY(${front ? 180 : 0}deg);
  }
`;

export const HoleFront = styled(CardWrapper)`
  opacity: 0;
  animation: ${(props) => (props.leaving ? leaveHole : enterHole)(true)} 0.4s;
  animation-fill-mode: forwards;
`;

export const HoleBack = styled(CardWrapper)`
  opacity: 0;
  animation: ${(props) => (props.leaving ? leaveHole : enterHole)(false)} 0.4s;
  animation-fill-mode: forwards;
`;
