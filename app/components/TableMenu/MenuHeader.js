import React from 'react';
import PropTypes from 'prop-types';

import {
  Hamburger,
  Identicon,
  ItemTitle,
  MenuHeader as HeaderStyle,
  Patty,
} from './styles';

const MenuHeader = ({
  active,
  blocky,
  toggleMenuOpen,
  toggleMenuActive,
  nickName,
  open,
}) => {
  const handleOnLeave = () => active ? toggleMenuActive() : null;
  return (
    <HeaderStyle
      open={open}
      onClick={toggleMenuOpen}
      onMouseDown={toggleMenuActive}
      onMouseUp={toggleMenuActive}
      onMouseLeave={handleOnLeave}
    >
      <Identicon name="identicon" bgImg={blocky} />
      <ItemTitle name="item-title">{nickName}</ItemTitle>
      <Hamburger>
        <Patty active={active} />
        <Patty active={active} />
        <Patty active={active} />
      </Hamburger>
    </HeaderStyle>
  );
};

MenuHeader.propTypes = {
  active: PropTypes.bool,
  blocky: PropTypes.string,
  nickName: PropTypes.string,
  toggleMenuActive: PropTypes.func,
  toggleMenuOpen: PropTypes.func,
  open: PropTypes.bool,
};

export default MenuHeader;
