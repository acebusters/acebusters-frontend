import React from 'react';

import {
 ItemWrapper,
 ItemIcon,
 ItemTitle,
} from './styles';

const MenuItems = (props) => {
  const { item } = props;
  // if the menu is open, close it
  const handleClick = () => {
    if (props.open) {
      props.toggleMenuOpen();
    }
    item.onClick();
  };
  return (
    <ItemWrapper
      name={item.name}
      disabled={item.disabled}
      onClick={handleClick}
    >
      <ItemIcon className={item.icon} aria-hidden />
      <ItemTitle>
        {item.title}
      </ItemTitle>
    </ItemWrapper>
  );
};
MenuItems.propTypes = {
  item: React.PropTypes.object,
  open: React.PropTypes.bool,
  toggleMenuOpen: React.PropTypes.func,
};

export default MenuItems;
