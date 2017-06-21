/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import styled from 'styled-components';
import Link from '../Link';

import {
  fontFamilyBase,
  fontSizeBase,
  lineHeightBase,
  fontWeightBase,
  navbarHeight,
  navbarPaddingHorizontal,
  navbarPaddingVertical,
  navbarColorCurrent,
  screenXsMax,
  baseColor,
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

const StyledSpan = styled.span`
  width: 100%;
`;

const StyledIcon = styled.i`
  color: inherit;
  box-sizing: border-box;
  float: left;
  border: 0;
  vertical-align: top;
  border-radius: 50%;
  margin-right: 10px;
  max-width: none;
  font-size: 28px;
  margin-top: -4px;

  &:hover {
    color: inherit;
  }

  cursor: pointer;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Chrome/Safari/Opera */
  -khtml-user-select: none; /* Konqueror */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently not supported by any browser */
`;

const StyledImage = styled.img`
  color: inherit;
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

  &:hover {
    color: inherit;
  }

  cursor: pointer;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Chrome/Safari/Opera */
  -khtml-user-select: none; /* Konqueror */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently not supported by any browser */
`;

const StyledLink = styled.a`
  text-decoration: none;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Chrome/Safari/Opera */
  -khtml-user-select: none; /* Konqueror */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently not supported by any browser */

  color: inherit;
  display: block;
  cursor: pointer;
  padding: ${navbarPaddingVertical} ${navbarPaddingHorizontal};
  position: relative;
  background-color: transparent;

  border-bottom: 2px solid transparent;

  &:hover {
    color: ${(props) => props.theme.navbarHoverColor || '#fff'};
    text-decoration: none !important;
    border-bottom-color: ${baseColor};
  }
`;

const ActiveLink = styled(StyledLink)`
  cursor: default;
  border-bottom: 2px solid ${navbarColorCurrent};
  background-color: ${navbarColorCurrent};

  &:hover {
    border-bottom-color: ${navbarColorCurrent};
  }
`;

const StyledItem = styled.li`
  /* shared */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-family: ${fontFamilyBase};
  font-weight: ${fontWeightBase};
  font-size: ${fontSizeBase};
  line-height: ${lineHeightBase};
  box-sizing: border-box;

  float: left;
  display: block;
  background-image: none;
  position: relative;
  text-decoration: none;
  &:focus, &:active {
    background: transparent;
    outline: none;
  }

  /* theme */
  color: ${(props) => props.theme.navbarFontColor || '#fff'};
  border-left: ${(props) => props.theme.navbarItemBorder || 'none'};

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

const displayImage = (src, icon) => {
  if (src) {
    return <StyledImage src={src} />;
  } else if (icon) {
    return <StyledIcon className={icon} />;
  }
  return null;
};

const NavItem = ({ title, to, image, iconClass, collapsed }) => (
  <StyledItem
    collapsed={collapsed}
  >
    <Link
      component={StyledLink}
      activeComponent={ActiveLink}
      to={to}
    >
      {displayImage(image, iconClass)}
      <StyledSpan>{title}</StyledSpan>
    </Link>
  </StyledItem>
);

NavItem.propTypes = {
  title: React.PropTypes.string,
  collapsed: React.PropTypes.bool,
  to: React.PropTypes.any,
  image: React.PropTypes.string,
  iconClass: React.PropTypes.string,
};

export default NavItem;
