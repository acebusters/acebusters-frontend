import React from 'react';
import PropTypes from 'prop-types';
import Link from '../Link';

import {
 ItemWrapper,
 ItemIcon,
 ItemTitle,
 LinkWrapper,
} from './styles';

const MenuItem = ({ item, ...props }) => {
  const children = [
    <ItemIcon className={item.icon} aria-hidden key="0" />,
    <ItemTitle key="1">
      {item.title}
    </ItemTitle>,
  ];

  const handleClick = () => {
    // if the menu is open, close it
    if (props.open) {
      props.toggleMenuOpen();
    }
    if (item.onClick) {
      item.onClick();
    }
  };

  if (item.onClick) {
    return (
      <ItemWrapper
        name={item.name}
        disabled={item.disabled}
        onClick={handleClick}
      >
        {children}
      </ItemWrapper>
    );
  }

  return (
    <Link
      to={item.to}
      name={item.name}
      onClick={handleClick}
      component={LinkWrapper}
    >
      {children}
    </Link>
  );
};
MenuItem.propTypes = {
  item: PropTypes.object,
  open: PropTypes.bool,
  toggleMenuOpen: PropTypes.func,
};

export default MenuItem;
