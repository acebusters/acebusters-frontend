/**
* Created by jzobro 20170517
*/
import styled from 'styled-components';

// colors
const cardBg = '#A3BFE0';
const successBg = 'linear-gradient(0deg, #B4ED50 0%, #78D049 100%)';
const infoBg = 'linear-gradient(0deg, #D4D4D4 0%, #4D4D4D 100%)';
const infoReverseBg = 'linear-gradient(0deg, #4D4D4D 0%, #D4D4D4 100%)';
const warningBg = 'linear-gradient(0deg, #F7F8CB 0%, #F7F51C 100%)';
const dangerBg = 'linear-gradient(0deg, #FBDA61 0%, #F76B1C 100%)';
const activeColor = '#35C5E3'; // tealish
const successColor = '#305209'; // greenish
const infoColor = '#FFFFFF'; // white
const warningColor = '#5E5F3B'; // yellowish
const dangerColor = '#63430F';  // orangish
// shadows
const smallShadow = '0 1px 4px 0 rgba(0,0,0,0.50)';
const medShadow = '0 2px 4px 0 rgba(0,0,0,0.50)';
// size
const seatScale = 128;
const joinButtonScale = 64;


const calcSize = (baseSize, scaleSize, dimToScale) => {
  const convertedNum = Math.round((scaleSize / baseSize) * dimToScale);
  return `${convertedNum}px`;
};

const scaleSeat = (dimToScale) => {
  const baseSeatSize = 128;
  return calcSize(baseSeatSize, seatScale, dimToScale);
};

const scaleButtonJoin = (dimToScale) => {
  const baseJoinButtonSize = 64;
  return calcSize(baseJoinButtonSize, joinButtonScale, dimToScale);
};

// shared styles
export const SharedMiddle = styled.div`
  background-color: #333;
  background-image: linear-gradient(-180deg, #787878 0%, #393939 50%, #1F1F1F 50%, #3C3C3C 100%);
  box-shadow: ${medShadow};
`;

export const SharedLower = styled.div`
  margin-left: ${scaleSeat(8)};
  box-shadow: ${smallShadow};
  border-radius: 0 0 ${scaleSeat(3)} ${scaleSeat(3)};
`;

// seat
export const SeatWrapper = styled.div`
  position: absolute;
  left: ${(props) => props.coords[0]}%;
  top: ${(props) => props.coords[1]}%;
  color: 'white';
  width: 10%;
  height: 25%;
`;

export const SeatContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: ${scaleSeat(128)};

  color: white;
  background-color: none;
  opacity: ${(props) => props.activePlayer ? 1 : 0.5};
 `;

// cards
export const CardContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-right: ${scaleSeat(4)};

  background-color: none;
`;

export const Card = styled.div`
  background-color: ${cardBg};
  border-top: ${scaleSeat(1)} solid white;
  border-left: ${scaleSeat(1)} solid white;
  border-right: ${scaleSeat(1)} solid white;
  border-bottom: none;
  border-radius: ${scaleSeat(2)} ${scaleSeat(2)} 0 0;
  box-shadow: ${smallShadow};
  height: ${scaleSeat(12)};
  margin-right: ${scaleSeat(2)};
  width:${scaleSeat(36)};
`;

// info
export const InfoWrapper = styled(SharedMiddle)`
  display: flex;
  border-radius: ${scaleSeat(4)};

  color: #D5D5D5;
  font-weight: 400;
  z-index: 100;
`;

export const AvatarImage = styled.img`
  background-color: AliceBlue;
  width: ${scaleSeat(38)};
  height: ${scaleSeat(38)};
  border-radius: ${scaleSeat(3)};
  margin: ${scaleSeat(3)} ${scaleSeat(4)};
`;

export const DetailWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  background-color: none;
  margin-left: ${scaleSeat(2)};
`;

export const NameBox = styled.div`
  padding-bottom: ${scaleSeat(2)};
  font-size: ${scaleSeat(11)};
  background-color: none;
  color: white;
`;

export const StackBox = styled.div`
  padding-top: ${scaleSeat(2)};
  font-size: ${scaleSeat(11)};
  background-color: none;
  color: white;
`;

// status
export const StatusWrapper = styled.div`
  display: flex;

  background-color: none;
`;

export const StatusHand = styled(SharedLower)`
  padding-top: 0;
  padding-left: ${scaleSeat(10)};
  padding-bottom: ${scaleSeat(1)};
  padding-right: ${scaleSeat(10)};
  font-weight: 600;
  font-size: ${scaleSeat(11)};

  color: ${(props) => {
    if (props.type === 'success') return successColor;
    if (props.type === 'info') return infoColor;
    if (props.type === 'warning') return warningColor;
    if (props.type === 'danger') return dangerColor;
    return infoColor;
  }};
  background: ${(props) => {
    if (props.type === 'success') return successBg;
    if (props.type === 'info') return infoBg;
    if (props.type === 'warning') return warningBg;
    if (props.type === 'danger') return dangerBg;
    return infoBg;
  }};
  opacity: ${(props) => props.recent ? 1 : 0.4};
`;

export const StatusSeatWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-right: ${scaleSeat(6)};

  background-color: none;
`;

export const StatusSeat = styled.div`
  padding-top: 0;
  padding-left: ${scaleSeat(14)};
  padding-bottom: ${scaleSeat(1)};
  padding-right: ${scaleSeat(14)};

  font-weight: 600;
  font-size: ${scaleSeat(11)};
  color: ${infoColor};

  background: ${infoReverseBg};
  box-shadow: ${smallShadow};
  border-radius: ${scaleSeat(3)} ${scaleSeat(3)} 0 0;
`;

// timer
export const TimerWrapper = styled(SharedLower)`
  width: ${scaleSeat(110)};
  background-color: #393939;
`;

export const TimerBackground = styled.div`
  position: relative;
  height: ${scaleSeat(6)};
  margin-top: 0;
  margin-right: ${scaleSeat(3)};
  margin-bottom: ${scaleSeat(3)};
  margin-left: ${scaleSeat(3)};
  background-color: #727272;
  border-radius: 0 0 ${scaleSeat(2)} ${scaleSeat(2)};
`;

export const TimerBar = styled.div`
  position: absolute;
  height: 100%;
  top: 0px;
  left: 0px;
  width: ${(props) => props.width};
  border-radius: 0 0 ${scaleSeat(2)} ${scaleSeat(2)};
  background: ${(props) => {
    if (props.type === 'active') return activeColor;
    if (props.type === 'warning') return warningBg;
    if (props.type === 'danger') return dangerBg;
    return infoBg;
  }};
`;

// ButtonJoin
export const ButtonStyle = styled(SharedMiddle)`
  border-radius: ${scaleButtonJoin(4)};
  width: ${scaleButtonJoin(64)};
`;

export const ButtonWrapper = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  color: #D5D5D5;
  font-weight: 400;
  &:hover {
    color: white;
    transform: scale(1.1, 1.1);
    ${''/* box-shadow: inset 0 1px 3px 0 rgba(0,0,0,0.50); */}
  }
  &:active {
    color: ${activeColor};
    transform: scale(1.0, 1.0);
  }
`;

export const ButtonIcon = styled.i`
  flex: auto;
  padding-top: ${scaleButtonJoin(6)};
  padding-right: ${scaleButtonJoin(8)};
  padding-bottom: ${scaleButtonJoin(6)};
  padding-left: ${scaleButtonJoin(8)};
  &:before {
    font-size: ${scaleButtonJoin(16)};
  }
`;

export const ButtonText = styled.div`
  font-size: ${scaleButtonJoin(14)};
  font-weight: 600;
  flex: auto;
  padding-top: ${scaleButtonJoin(4)};
  padding-bottom: ${scaleButtonJoin(6)};
`;
