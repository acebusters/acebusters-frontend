import styled from 'styled-components';
import {
  activeColor,
  successBg,
  infoBg,
  warningBg,
  dangerBg,
  successBgSolid,
  infoBgSolid,
  warningBgSolid,
  dangerBgSolid,
  infoColor,
  successColor,
  dangerColor,
  warningColor,
} from '../variables';

// colorHelper
export const alertBg = (type, style) => {
  if (style === 'gradient') {
    if (type === 'success') return successBg;
    if (type === 'info') return infoBg;
    if (type === 'warning') return warningBg;
    if (type === 'danger') return dangerBg;
  }
  if (style === 'solid') {
    if (type === 'success') return successBgSolid;
    if (type === 'info') return infoBgSolid;
    if (type === 'warning') return warningBgSolid;
    if (type === 'danger') return dangerBgSolid;
  }
  if (type === 'active') return activeColor;
  return infoColor;
};
export const alertColor = (type) => {
  if (type === 'success') return successColor;
  if (type === 'info') return 'black';
  if (type === 'warning') return warningColor;
  if (type === 'danger') return dangerColor;
  return infoColor;
};

export const Button = styled.button`
  padding: 0;
  margin: 0;
  border: none;
  &:focus {
    outline: none;
  }
  &:hover {
    cursor: pointer;
  }
  &:disabled{
    cursor: default;
  }
`;

// size
const seatScale = 128;
const joinButtonScale = 64;

const calcSize = (baseSize, scaleSize, dimToScale) => {
  const convertedNum = Math.round((scaleSize / baseSize) * dimToScale);
  return `${convertedNum}px`;
};

export const scaleSeat = (dimToScale) => {
  const baseSeatSize = 128;
  return calcSize(baseSeatSize, seatScale, dimToScale);
};

export const scaleButtonJoin = (dimToScale) => {
  const baseJoinButtonSize = 64;
  return calcSize(baseJoinButtonSize, joinButtonScale, dimToScale);
};
