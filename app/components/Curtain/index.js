import React from 'react';
import styled from 'styled-components';

import {
  baseColor,
  gray,
  white,
  curtainStickyWidth,
  curtainWidth,
} from 'variables';

import { menuClose } from '../TableMenu/styles';

export const CurtainWrapper = styled.div`
  width: ${curtainWidth};
  background-color: #5D5D5D;
  position: absolute;
  top: 0px;
  bottom: 0;
  left: ${(props) => props.isOpen ? '0' : `-${curtainWidth}`};
  z-index: 6;
  padding: 20px;
  transition: .15s ease left;

  @media (min-width: ${curtainStickyWidth}) {
    left: 0px;
  }
`;

export const CurtainTogglerWrapper = styled.div`
  position: absolute;
  ${(props) => props.isOpen ?
    `top: 40px;
    left: 356px;`
    :
    `top: 60px;
    left: 400px;`
  }
  cursor: pointer;
  display: flex;
  align-items: center;
  color: ${gray};
  @media (min-width: ${curtainStickyWidth}) {
    display: none;
  }
`;

export const ToggleTriangle = styled.span`
  width: 70px;
  height: 70px;
  clip: rect(auto, 70px, auto, 50px);
  transform: translateX(-50px);
  &:before {
    content: "";
    position: absolute;
    top: 10px;
    bottom: 10px;
    left: 10px;
    right: 10px;
    background: ${menuClose};
    transform: rotate(-45deg);
  }
`;

export const ToggleIcon = styled.i`
  margin-left: -36px;
`;

export const ToggleText = styled.span`
  padding: 4px 0 0 7px;
  font-size: 16px;
`;

const CurtainHeaderContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const CurtainLogoContainer = styled.div`
  width: 60px;
  height: 60px;
  padding-right: 20px;
  box-sizing: content-box;
`;

const CurtainLogo = () => (
  <CurtainLogoContainer>
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 1000 1000">
      <path d="M500,10C367,173.8,317.1,228.9,282.6,268.6C215,349.5,31.5,486.9,31.5,634.4c0,169.7,181,192,234.3,192c53.3,0,208.9-34.3,208.9-103.1c0,64.7-40.4,257.1-105.1,266.7c121.2,0,272.8,0,272.8,0s-101-84.9-101-266.7c0,56.4,145.5,101,222.3,101s205-66.7,205-192c0-138.2-137.3-259.3-247.4-361.7C605.5,163.2,500,10,500,10z" />
    </svg>
  </CurtainLogoContainer>
);

const CurtainNameContainer = styled.div`
  font-size: 20px;
  font-weight: bold;
`;

const ContainerName = () => (
  <CurtainNameContainer>
    <span style={{ color: baseColor }}>ACE</span>
    <span style={{ color: white }}>BUSTERS</span>
  </CurtainNameContainer>
);

export const CurtainHeader = () => (
  <CurtainHeaderContainer>
    <CurtainLogo />
    <ContainerName />
  </CurtainHeaderContainer>
);
