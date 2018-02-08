import React from 'react';
import PropTypes from 'prop-types';
import Link from '../Link';

import {
  ActiveLink,
  StyledImage,
  StyledIcon,
  StyledItem,
  StyledLink,
  StyledSpan,
  MenuWrapper,
  MenuItem,
} from './styles';

const displayImage = (src, icon) => {
  if (src) {
    return <StyledImage src={src} />;
  } else if (icon) {
    return <StyledIcon className={icon} />;
  }
  return null;
};

const NavItem = ({
  title,
  to,
  image,
  iconClass,
  collapsed,
  collapseOnMobile,
  onClick,
  menu,
  onMenuClick,
}) => (
  <StyledItem
    collapsed={collapsed}
    collapseOnMobile={collapseOnMobile}
  >
    <Link
      component={StyledLink}
      activeComponent={ActiveLink}
      to={to}
      onClick={onClick || null}
    >
      {displayImage(image, iconClass)}
      <StyledSpan>{title}</StyledSpan>
    </Link>

    {menu &&
      <MenuWrapper>
        {menu.map((item, i) => (
          <MenuItem
            key={i}
            onClick={() => onMenuClick(i)}
          >
            {item}
          </MenuItem>
        ))}
      </MenuWrapper>
    }
  </StyledItem>
);

NavItem.propTypes = {
  title: PropTypes.any,
  collapsed: PropTypes.bool,
  collapseOnMobile: PropTypes.bool,
  to: PropTypes.any,
  image: PropTypes.string,
  menu: PropTypes.array,
  onMenuClick: PropTypes.func,
  iconClass: PropTypes.string,
  onClick: PropTypes.func,
};

NavItem.defaultProps = {
  collapseOnMobile: true,
};

export default NavItem;
