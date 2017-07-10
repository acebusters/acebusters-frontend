import styled, { keyframes } from 'styled-components';

import BaseLink from '../Link';

import {
  activeColor,
  curtainStickyWidth,
} from '../../variables';

import {
  alertBg,
  alertColor,
  Button,
} from '../../utils/styleUtils';

export const Link = styled(BaseLink)`
  text-decoration: none;
  color: ${activeColor};
`;

const noteIn = keyframes`
  from { transform: translateY(-40px) }
  to {  transform: translateY(0) }
`;
const noteOut = keyframes`
  from { transform: translateY(0) }
  to {  transform: translateY(-40px) }
`;

export const Container = styled.div`
  width: 100%;
  height: 36px;
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${(props) => props.removing ? noteOut : noteIn} 0.5s ease-in-out;
  ${(props) => props.isNotTable ?
    `margin-top: 52px;
    background-color: ${alertBg(props.type, 'solid')};`
    :
    `margin-top: 0;
    background-color: none;`
  }
`;

export const Wrapper = styled.div`
  position: absolute;
  left: 0;
  display: flex;
  align-items: center;
  height: 36px;
  width: 420px;
  max-width: 100%;
  padding: 0 10px 4px 16px;
  color: ${(props) => alertColor(props.type)};
  ${(props) => props.isNotTable ?
    `border: none;
     margin: none;
     background-color: none;`
    :
    `border-radius: 0 0 8px 8px;
     background-color: ${alertBg(props.type, 'solid')};
     margin-left: 24px;
     @media (min-width: ${curtainStickyWidth}) {
       margin-left: 124px;
     }`
  };
`;

export const CenterWrapper = styled(Wrapper)`
  justify-content: center;
`;

export const Category = styled.h3`
  font-size: 12px;
`;

export const Details = styled.span`
  padding-left: 8px;
  font-size: 12px;
`;

export const IconWrapper = styled.div`
  background-color: none;
  margin: 0 0 0 auto;
  padding-right: 0;
`;

export const Icon = styled.i`
  padding: 4px;
  font-size: 14px;
  &:last-child {
    padding-right: 0;
    margin-right: 0;
  }
`;

export const ButtonWrapper = styled(Button)`
  background-color: none;
`;
