import React from 'react';
import PropTypes from 'prop-types';
import { ModalButton, ModalContainer } from 'components/Dropdown/styles';

const SelectToken = ({ options, handleSelectButton }) => (
  <ModalContainer>
    {options.map((option, index) => (
      <ModalButton key={index} onClick={() => handleSelectButton(option.id)}>
        {option.node({ ...option.props })}
      </ModalButton>
      ))
    }
  </ModalContainer>
);
SelectToken.propTypes = {
  options: PropTypes.array,
  handleSelectButton: PropTypes.func,
};

export default SelectToken;
