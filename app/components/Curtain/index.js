import React from 'react';
import styled from 'styled-components';

import {
  baseColor,
  gray,
  black,
  white,
  curtainStickyWidth,
  curtainWidth,
} from 'variables';

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

export const CurtainToggler = styled.div`
  position: absolute;
  cursor: pointer;

  ${(props) => props.isOpen ? `
    left : ${curtainWidth};
    width: 100vh;
    top: 0;
    height: 100vh;
  ` : `
    top: 40px;
    right: 0px;
  `}
  
  &:before {
    content: '';
    display: block;
    position: absolute;
    border: 35px solid transparent;
    border-top-width: 25px;
    border-bottom-width: 25px;
    ${(props) => props.isOpen ? `
      border-right-color: ${black};
      left: -70px;
      top: 50px;
    ` : `
      border-left-color: ${gray};
    `}
  }
    
  &:after {
    content: '💬 \\00a0 \\00a0 Chat';
    position: absolute;
    display: block;
    white-space: nowrap;
    font-size: large;
    color: ${white};
    ${(props) => props.isOpen ? `
      left: 20px;
      top: 63px;
    ` : `
      left: 40px;
      top: 13px;
    `}
  }
  
  @media (min-width: ${curtainStickyWidth}) {
    display: none;
  }
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
