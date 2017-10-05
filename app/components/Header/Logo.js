import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {
  sidebarWidth,
  navbarHeight,
  screenXsMax,
} from '../../variables';

const StyledLogo = styled.a`
  /* theme */
  background-color: ${(props) => props.theme.logoBgColor || '#fff'} !important;
  color: ${(props) => props.theme.logoColor || '#000'} !important;
  border-bottom: ${(props) => props.theme.logoBorderBottom || 'none'} !important;;
  border-right: ${(props) => props.theme.navbarItemBorder || 'none'} !important;;
  &:hover {
    background-color: ${(props) => props.theme.logoHover || '#f6f6f6'} !important;;
  }

  display: block;
  text-decoration: none;
  float: left;
  height: ${navbarHeight};
  font-size: 20px;
  line-height: ${navbarHeight};
  text-align: center;
  width: ${sidebarWidth};
  @media (max-width: ${screenXsMax}) {
    width: 30%;
  }
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  padding: 0 15px;
  font-weight: 300;
  overflow: hidden;
  &:hover, &:focus {
    text-decoration: none !important;
    outline: none;
  }
`;

const LargeLogo = styled.span`
  display: block;
`;

const Logo = ({ href, logoLg, sidebarMini, collapse }) => (
  <StyledLogo sidebarMini={sidebarMini} collapse={collapse} name="navbar-logo" href={href}>
    <LargeLogo sidebarMini={sidebarMini} collapse={collapse} name="navbar-logo-lg">{logoLg}</LargeLogo>
  </StyledLogo>
    );

Logo.propTypes = {
  href: PropTypes.string,
  logoLg: PropTypes.element,
  sidebarMini: PropTypes.bool,
  collapse: PropTypes.bool,
};

export default Logo;
