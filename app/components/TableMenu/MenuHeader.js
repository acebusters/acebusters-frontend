import React from 'react';

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
      <ItemTitle name="item-title">{nickName !== null ? nickName : 'Guest'}</ItemTitle>
      <Hamburger>
        <Patty active={active} />
        <Patty active={active} />
        <Patty active={active} />
      </Hamburger>
    </HeaderStyle>
  );
};

MenuHeader.propTypes = {
  active: React.PropTypes.bool,
  blocky: React.PropTypes.string,
  nickName: React.PropTypes.string,
  toggleMenuActive: React.PropTypes.func,
  toggleMenuOpen: React.PropTypes.func,
  open: React.PropTypes.bool,
};

export default MenuHeader;
