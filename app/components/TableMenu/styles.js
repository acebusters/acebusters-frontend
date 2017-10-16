/**
* Created by jzobro 20170602
*/
import styled from 'styled-components';

import { LogoContainer } from '../Logo';

import {
  curtainStickyWidth,
  menuClose,
} from '../../variables';

import { Button as SharedButton } from '../../utils/styleUtils';

const menuActiveBG = '#35c5e3'; // electric blue
const menuBoxShadow = '0 2px 4px 0 rgba(0,0,0,0.31)';
const menuColor = '#ebe8e8'; // light gray
const menuOpen = 'linear-gradient(0deg, #383838 0%, #717171 100%)';
const menuHoverBoxShadow = 'inset 1px 1px 5px 1px rgba(0,0,0,0.3)';
const menuActiveBoxShadow = 'inset 2px 1px 5px 2px rgba(0,0,0,0.50)';

const Button = styled(SharedButton)`
  color: ${menuColor};
  background: none;
  text-decoration: none;
  &:focus {}
  &:hover {
    box-shadow: ${menuHoverBoxShadow};
  }
  &:active {
    box-shadow: ${menuActiveBoxShadow};
    color: ${menuActiveBG};
  }
  &:disabled{
    color: #8e8e8e;
    box-shadow: none;
  }
`;

// Logo
export const LogoWrapper = styled.div`
  position: absolute;
  top: 24px;
  left: 18px;
  display: flex;
  align-items: center;
  pointer-events: none;
  color: #FFF;
  @media (min-width: ${curtainStickyWidth}) {
    display: none;
  }
`;

export const TableLogoContainer = styled(LogoContainer)`
  color: #272727;
`;

// table-menu
export const MenuContainer = styled.div`
  position: absolute;
  top: 0;
  left: calc(100% - 165px);
  display: flex;
  flex-direction: column;
  min-width: 165px;
  margin-left: auto;
  pointer-events: all;
  background: ${(props) => props.open ? menuOpen : 'none'};
  border-bottom-left-radius: 8px;
  box-shadow: ${(props) => props.open ? menuBoxShadow : 'none'};
  z-index: ${(props) => props.open ? 100 : 0};
`;

// header-item
export const MenuHeader = styled(Button)`
  display: flex;
  align-items: center;
  height: 42px;
  margin-bottom: 4px;
  padding-left: 14px;
  border-bottom-left-radius: 8px;
  background: ${(props) => props.open ? 'none' : menuClose};
  box-shadow: ${(props) => props.open ? 'none' : menuBoxShadow} !important;
  &:hover {
    transform: scale(1.1, 1.1);
  }
`;

export const Identicon = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #33bcd9;
  background-image: url(${(props) => props.bgImg});
  background-size: 24px 24px;
`;

export const NickName = styled.span`
  min-width: 40px;
  padding-left: 6px;
  font-size: 14px;
  font-weight: normal;
`;

export const Hamburger = styled.span`
  display: flex;
  flex-direction: column;
  margin-left: auto;
  padding-right: 12px;
  min-width: 20px;
  min-height: 20px;
`;

export const Patty = styled.div`
  width: 20px;
  height: 4px;
  margin-bottom: 3px;
  background-color: ${(props) => props.active ? menuActiveBG : '#5b5a5a'};
  box-shadow: inset 0 1px 3px 0 rgba(0,0,0,0.41);
  border-radius: 1px;
  &:last-child {
    margin-bottom: 0;
  }
`;

// menu item
export const MenuItemsWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ItemWrapper = styled(Button)`
  display: flex;
  align-items: center;
  height: 40px;
  margin-left: 8px;
  padding-left: 12px;
  border-bottom-left-radius: 6px;
  border-top-left-radius: 6px;
  &:last-child {
    height: 40px;
    margin-bottom: 10px;
  }
`;

export const LinkWrapper = ItemWrapper.withComponent(Button.withComponent('a'));

export const ItemIcon = styled.i`
  &:before {
    font-size: 16px;
  }
`;

export const ItemTitle = styled.span`
  padding-left: 10px;
  font-size: 14px;
`;
