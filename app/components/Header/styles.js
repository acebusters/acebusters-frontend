import styled from 'styled-components';

import DropdownMenu from './DropdownMenu';

import {
  fontFamilyBase,
  fontSizeBase,
  lineHeightBase,
  fontWeightBase,
  navbarHeight,
  navbarPaddingHorizontal,
  navbarPaddingVertical,
  screenXsMin,
  screenXsMax,
} from '../../variables';

const imageSize = `${Math.floor(parseInt(navbarHeight, 10) / 2)}px`;
const imageMarginTop = `-${Math.ceil(
  ((parseInt(imageSize, 10) +
  parseInt(navbarPaddingHorizontal, 10) +
  parseInt(navbarPaddingVertical, 10)) -
  parseInt(navbarHeight, 10)) / 2)}px`;
const imageMarginBottom = `-${Math.floor(
  ((parseInt(imageSize, 10) +
  parseInt(navbarPaddingHorizontal, 10) +
  parseInt(navbarPaddingVertical, 10)) -
  parseInt(navbarHeight, 10)) / 2)}px`;

export const StyledUserImage = styled.img`
  box-sizing: border-box;
  float: left;
  border: 0;
  vertical-align: middle;
  width: ${imageSize};
  height: ${imageSize};
  border-radius: 50%;
  margin-right: 10px;
  margin-top: ${imageMarginTop};
  margin-bottom: ${imageMarginBottom};
  max-width: none;
  background-color: gray;

  cursor: pointer;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Chrome/Safari/Opera */
  -khtml-user-select: none; /* Konqueror */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently not supported by any browser */
`;

export const StyledUserName = styled.span`
  cursor: pointer;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Chrome/Safari/Opera */
  -khtml-user-select: none; /* Konqueror */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently not supported by any browser */

  @media (max-width: ${screenXsMin}) {
    display: none;
  }
`;

export const UserMenuHeader = styled.li`
  background-color: ${(props) => props.theme.navbarUserMenuHeaderBg || props.theme.backgroundColor};
  padding: 10px;
  text-align: center;
`;

export const UserMenuHeaderImage = styled.img`
  z-index: 5;
  height: 90px;
  width: 90px;
  border: 3px solid;
  background-color: gray;
  border-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
`;

export const UserMenuHeaderName = styled.p`
  z-index: 5;
  color: #fff;
  color: rgba(255, 255, 255, 0.8);
  font-size: 17px;
  margin-top: 10px;
`;

export const UserFooterButton = styled.button`
  color: #666666;
  box-shadow: none;
  border: 1px solid transparent;
  border-width: 1px;
  border-radius: 0;
  background-color: #f4f4f4;
  border-color: #ddd;
  display: inline-block;
  padding: 6px 12px;
  margin-bottom: 0;
  font-size: ${fontSizeBase};
  font-weight: ${fontWeightBase};
  line-height: ${lineHeightBase};
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  -ms-touch-action: manipulation;
  touch-action: manipulation;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  background-image: none;
`;

export const UserFooter = styled.li`
  /* clearfix */
  &:before, &:after {
    display: table;
    content: " ";
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
  &:after {
    clear: both;
  }

  background-color: #f9f9f9;
  padding: 10px;
`;

export const UserDropDown = styled(DropdownMenu)`
  border-top-radius: 0;
  border-top: 0;
  padding: 1px 0 0 0;
  width: 280px;
`;

export const StyledUserMenu = styled.li`
  /* shared */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-family: ${fontFamilyBase};
  font-weight: ${fontWeightBase};
  font-size: ${fontSizeBase};
  line-height: ${lineHeightBase};
  box-sizing: border-box;

  float: left;
  background-color: transparent;
  background-image: none;
  border: none;
  outline: none;
  padding: ${navbarPaddingVertical} ${navbarPaddingHorizontal};
  position: relative;
  text-decoration: none;
  cursor: pointer;
  &:focus, &:active { background: transparent; }

  /* theme */
  color: ${(props) => props.theme.navbarFontColor || '#fff'};
  border-left: ${(props) => props.theme.navbarItemBorder || 'none'};
  &:hover {
    color: ${(props) => props.theme.navbarHoverColor || '#fff'};
    background-color: ${(props) => props.theme.logoBgColor || 'transparent'};
  }

  @media (max-width: ${screenXsMax}) {
    width: 100%;
    display: ${(props) => {
      if (props.collapsed) {
        return 'none';
      }
      return 'block';
    }};
  }
`;
