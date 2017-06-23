/**
* Created by jzobro 20170531
*/
import styled, { keyframes } from 'styled-components';

import {
  curtainStickyWidth,
  curtainHalfWidth,
} from '../../variables';

const active = '#35c5e3'; // electric blue
const largeBoxShadow = '0 2px 4px 1px rgba(0,0,0,0.50)';
const medBoxShadow = '0 2px 4px 0px rgba(0,0,0,0.50)';
const Button = styled.button`
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

export const ActionBarWrapper = styled.div`
  position: fixed;
  min-height: 50px;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 0);
  display: flex;
  flex-direction: column;
  opacity: ${(props) => props.active && !props.disabled ? 1 : 0.3};

  transition: opacity 0.3s ease-out;

  @media (min-width: ${curtainStickyWidth}) {
    left: calc(50% + ${curtainHalfWidth});
  }
`;

export const ControlPanel = styled.div`
  z-index: 3;
  align-self: center;
  display: flex;
  padding: 6px 7px 0 7px;
  border-radius: 16px 16px 0 0;
  background-color: #7A7A7A;
  background-image: linear-gradient(0deg, #383838 0%, #7A7A7A 100%);
  box-shadow: ${largeBoxShadow};
`;

const easeSliderIn = keyframes`
  from { width: 290px; }
  to { width: 544px; }
`;

const easeSliderOut = keyframes`
  from { width: 544px; }
  to { width: 290px; }
`;

export const ControlWrapper = styled.div`
  display: flex;
  border-radius: 11px 11px 0 0;
  padding: 3px 3px 0 3px;
  background-color: none;
  box-shadow: inset 0 1px 3px 1px rgba(0,0,0,0.50);
  ${(props) => props.sliderOpen ?
    `animation: ${easeSliderIn} 0.5s ease-in-out;`
    :
    `animation: ${easeSliderOut} 0.5s ease-in-out;`
  }
`;

export const ActionButtonWrapper = styled(Button)`
  display: flex;
  height: 40px;
  margin-left: 4px;
  min-width: 88px;
  border-radius: 2px 2px 0 0;
  background-color: #7C7C7C;
  background-image: linear-gradient(0deg, #383838 0%, #7C7C7C 100%);
  box-shadow: 0 1px 2px 0 rgba(0,0,0,0.50);
  font-weight: 400;
  ${(props) =>
    props.type === 'BET-SET' ||
    props.type === 'RAISE-SET' ||
    props.type === 'BLANK' ?
    'min-width: 88px;'
  :
    'min-width: 94px;'
  };
  color: #CACACA;
  &:first-child {
    margin-left: 0;
    border-top-left-radius: 9px;
  }
  &:nth-child(3) {
    border-top-right-radius: 9px;
  }
  &:hover {
    background-color: #383838;
    background-image: linear-gradient(0deg, #666 0%, #585858 72%, #7C7C7C 100%);
  }
  &:active {
    background-color: #7C7C7C;
    background-image: linear-gradient(0deg, #7C7C7C 0%, #585858 72%, #666 100%);
    color: ${active};
  }
  &:disabled {
    background-color: #777;
    color: #DDD;
  }
`;

export const ActionIndicator = styled.div`
  ${(props) =>
    props.type === 'BLANK' ||
    props.type === 'BET-SET' ||
    props.type === 'RAISE-SET' ?
    'display: none;'
    :
    'display: block;'
  };
  margin-left: 8px;
  margin-top: 6px;
  height: 34px;
  width: 10px;
  border-radius: 4px 4px 0 0;
  background-color: ${(props) => props.active ? active : 'none'};
  box-shadow: inset 0 1px 3px 0px rgba(0,0,0,0.50);
`;

export const ActionText = styled.div`
  ${(props) =>
    props.type === 'BET-SET' ||
    props.type === 'RAISE-SET' ||
    props.type === 'BLANK' ?
    `width: 100%;
     margin-left: 0;
     text-align: center;`
  :
    `margin-left: 12px;
     text-align: left;`
  }
  margin-bottom: 2px;
  align-self: center;
  font-weight: 600;
  font-size: 15px;
`;

export const SliderWrapper = styled.div`
  align-self: center;
  width: 200px;
  height: 20px;
  margin-left: 24px;
  margin-right: 24px;
  .rc-slider-dot {
    background-color: none;
    height: 0;
    width: 0;
    border: none;
  }
`;

export const SliderHandle = styled.div`
  display: flex;
  position: absolute;
  justify-content: center;
  align-items: center;
  width: 34px;
  height: 40px;
  margin-left: -12px;
  margin-top: -12px;
  cursor: pointer;
  border-radius: 8px 8px 0 0;
  border: none;
  background-color: #7C7C7C;
  background-image: linear-gradient(0deg, #383838 0%, #7C7C7C 100%);
  boxShadow: 0 1px 2px 0 rgba(0,0,0,0.50);
  &:hover {
    background-color: #383838;
    background-image: linear-gradient(0deg, #666 0%, #585858 72%, #7C7C7C 100%);
  }
  &:active {
    background-color: #7C7C7C;
    background-image: linear-gradient(0deg, #7C7C7C 0%, #585858 72%, #666 100%);
  }
`;

export const SliderDot = styled.div`
  height: 10px;
  width: 10px;
  border-radius: 50%;
  background-color: ${(props) => props.active ? active : 'none'};
  box-shadow: inset 0 1px 3px 1px rgba(0,0,0,0.50);
`;

export const FlagContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-right: 12px;
  opacity: ${(props) => props.active ? 1 : 0};
`;

export const FlagButtonWrapper = styled(Button)`
  height: 30px;
  transform: translateY(${(props) => !props.sliderOpen ? '32px' : '0'});
  margin-left: 4px;
  padding: 5px 18px ;
  border-radius: 4px 4px 0 0;
  border-bottom: solid 2px #515151;
  background-color: #7B7B7B;
  color: #C1BFBF;
  font-weight: 600;
  font-size: 12px;
  &:hover {
    cursor: pointer;
    background-color: #666;
  }
  &:active {
    background-color: #7B7B7B;
    color: ${active};
  }
  &:disabled {
    cursor: default;
    opacity: 0.3;
    background-color: #7B7B7B;
  }
  transition: 0.5s ease;
`;

const FlagShared = styled.div`
  align-self: center;
  min-height: 20px;
  min-width: 80px;
  padding: 6px 10px 4px 10px;
  border-radius: 4px 4px 0 0;
  background-color: #BCBCBC;
  box-shadow: ${medBoxShadow};
  color: #555;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  transition: 0.5s ease;
`;

export const FlagBet = styled(FlagShared)`
  z-index: 1;
  ${(props) => props.sliderOpen ?
    `transform: translate(-26px, 30px);
    transition-delay: 0.3s;
    ` : `
    transform: translate(0px, 60px);`
  }
`;

export const FlagCall = styled(FlagShared)`
  z-index: 2;
  ${(props) => props.sliderOpen ?
    `margin-right: 18px;
    display: ${props.hide ? 'none' : 'block'};
    transform: translate(-116px, 60px);
    ` : `
    transform: translateY(${props.hide ? '90px' : '60px'});
    `
  };
`;
