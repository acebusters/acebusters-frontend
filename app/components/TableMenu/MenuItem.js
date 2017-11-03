import React from 'react';
import PropTypes from 'prop-types';
import Link from '../Link';
import WithLoading from '../WithLoading';

import {
 ItemWrapper,
 ItemIcon,
 ItemTitle,
 LinkWrapper,
} from './styles';

const MenuItem = ({ item, ...props }) => {
  const Component = item.onClick ? ItemWrapper : Link;

  const handleClick = () => {
    // if the menu is open, close it
    if (props.open) {
      props.toggleMenuOpen();
    }
    if (item.onClick) {
      item.onClick();
    }
  };

  return (
    <Component
      to={item.to}
      name={item.name}
      onClick={handleClick}
      disabled={item.disabled}
      component={LinkWrapper}
    >
      {item.pending &&
        <WithLoading loadingSize="14px" isLoading type="inline" />
      }
      {!item.pending &&
        <ItemIcon className={item.icon} aria-hidden />
      }
      <ItemTitle>
        {item.title}
      </ItemTitle>
    </Component>
  );
};
MenuItem.propTypes = {
  item: PropTypes.object,
  open: PropTypes.bool,
  toggleMenuOpen: PropTypes.func,
};

export default MenuItem;
