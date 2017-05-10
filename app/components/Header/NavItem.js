/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import styled from 'styled-components';

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
  cursor: inherit;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Chrome/Safari/Opera */
  -khtml-user-select: none; /* Konqueror */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently not supported by any browser */

  color: inherit;
  display: block;
  padding: ${navbarPaddingVertical} ${navbarPaddingHorizontal};
  position: relative;
  background-color: transparent;

  &:hover {
    color: inherit;
    text-decoration: none !important;
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
  background-color: ${(props) => props.currentPath ? navbarColorCurrent : 'transparent'};
  background-image: none;
  border: none;
  outline: none;
  position: relative;
  text-decoration: none;
  cursor: ${(props) => props.currentPath ? 'default' : 'pointer'};
  &:focus, &:active {
    background: transparent;
    outline: none;
  }

  /* theme */
  color: ${(props) => props.theme.navbarFontColor || '#fff'};
  border-left: ${(props) => props.theme.navbarItemBorder || 'none'};
  &:hover {
    color: ${(props) => props.theme.navbarHoverColor || '#fff'};
    background-color: ${(props) => props.currentPath ? navbarColorCurrent : (props.theme.logoBgColor || 'transparent')};
    border-bottom: ${(props) => props.currentPath ? 'none' : `1px solid ${baseColor}`};
  }

  @media (max-width: ${screenXsMax}) {
    width: 100%;
    &:hover {
      border-bottom: none;
    }
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

// Compare the redux state of location.pathname with the title of the NavItem
const isCurrentPath = (location, title) => {
  if (!location || !title) return false;

  const currentPathname = location.pathname.slice(1);
  const currentTitle = title.toLowerCase();

  if (currentPathname === currentTitle) {
    return true;
  }

  return false;
};

const NavItem = ({ title, onClick, href, image, iconClass, collapsed, location }) => (
  <StyledItem
    collapsed={collapsed}
    currentPath={isCurrentPath(location, title)}
  >
    {onClick &&
      <StyledLink onClick={onClick} href={null}>
        {displayImage(image, iconClass)}
        <StyledSpan>{title}</StyledSpan>
      </StyledLink>
    }
    {(!onClick && href) &&
      <StyledLink href={href}>
        {displayImage(image, iconClass)}
        <StyledSpan>{title}</StyledSpan>
      </StyledLink>
    }
  </StyledItem>
);

NavItem.propTypes = {
  location: React.PropTypes.object,
  title: React.PropTypes.string,
  collapsed: React.PropTypes.bool,
  onClick: React.PropTypes.func,
  href: React.PropTypes.string,
  image: React.PropTypes.string,
  iconClass: React.PropTypes.string,
};

export default NavItem;
