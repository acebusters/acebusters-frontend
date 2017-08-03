import React from 'react';
import PropTypes from 'prop-types';
import {
  CurtainTogglerWrapper,
  ToggleIcon,
  ToggleText,
  ToggleTriangle,
} from './index';

const CurtainToggler = (props) => {
  const { isOpen } = props;
  if (isOpen) {
    return (
      <CurtainTogglerWrapper name="curtain-toggler" {...props}>
        <i className="fa fa-2x fa-chevron-left" />
      </CurtainTogglerWrapper>
    );
  }
  return (
    <CurtainTogglerWrapper name="curtain-toggler" {...props}>
      <ToggleTriangle />
      <ToggleIcon className="fa fa-2x fa-comments-o" />
      <ToggleText name="toggle-text">Chat</ToggleText>
    </CurtainTogglerWrapper>
  );
};
CurtainToggler.propTypes = {
  isOpen: PropTypes.bool,
};

export default CurtainToggler;
