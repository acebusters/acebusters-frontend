/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import styled from 'styled-components';

import {
  transitionSpeed,
  transitionFn,
  navbarHeight,
  screenXsMax,
  black,
} from '../../variables';

const StyledNavbarMenuList = styled.ul`
  -webkit-margin-before: 1em;
  -webkit-margin-after: 1em;
  -webkit-margin-start: 0px;
  -webkit-margin-end: 0px;
  -webkit-padding-start: 40px;
  box-sizing: border-box;
  display: block;
  list-style: none;
  margin: 0;
  padding: 0;
`;

const StyledNavbarMenu = styled.div`
  box-sizing: border-box;
  display: block;
  float: right;
  @media (max-width: ${screenXsMax}) {
    width: 100%;
  }
`;

const StyledNavbar = styled.nav`
  /* clearfix */
  &:before, &:after {
    display: table;
    content: " ";
    box-sizing: border-box;
  }
  &:after {
    clear: both;
  }
  /* transitions */
  -o-transition: margin-left ${transitionSpeed} ${transitionFn};
  transition: margin-left ${transitionSpeed} ${transitionFn};
  color: ${(props) => props.theme.navbarFontColor || '#333'};
  display: block;
  font-weight: 400;
  position: fixed;
  width: 100%;
  min-height: ${navbarHeight};
  z-index: 1000;
  margin-bottom: 0;
  border-radius: 0;
  background-color: ${black};
`;

const Navbar = (props) => (
  <StyledNavbar
    topNav={props.topNav}
  >
    <StyledNavbarMenu collapsed={props.collapsed}>
      <StyledNavbarMenuList name="navbar-menu-wrapper">
        {props.children}
      </StyledNavbarMenuList>
    </StyledNavbarMenu>
  </StyledNavbar>
  );


Navbar.propTypes = {
  children: React.PropTypes.node,
  topNav: React.PropTypes.bool,
  collapsed: React.PropTypes.bool,
};

export default Navbar;
