import React from 'react';
import PropTypes from 'prop-types';
import find from 'lodash/find';

import {
  Button,
  Caret,
  Container,
  ModalButton,
  ModalContainer,
} from './styles';

const Dropdown = ({
  handleFocus,
  handleBlur,
  options,
  selected,
  onSelect,
  modalAdd,
  modalDismiss,
}) => {
  const handleSelectButton = (id) => {
    onSelect(id);
    modalDismiss();
  };

  const handleToggle = () => {
    modalAdd(
      <ModalContainer>
        {options.map((option, index) => (
          <ModalButton key={index} onClick={() => handleSelectButton(option.id)}>
            {option.node({ ...option.props })}
          </ModalButton>
          ))
        }
      </ModalContainer>
    );
  };

  const selectedOption = find(options, { id: selected });

  return (
    <Container name="dropdown-button">
      <Button
        onClick={handleToggle}
        onFocus={handleFocus}
        onBlur={handleBlur}
        type="button"
      >
        {selectedOption.node({ ...selectedOption.props })}
        <Caret className="fa fa-caret-down" />
      </Button>
    </Container>
  );
};
Dropdown.propTypes = {
  modalAdd: PropTypes.func.isRequired,
  modalDismiss: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      node: PropTypes.func.isRequired,
    }),
  ).isRequired,
  selected: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  handleFocus: PropTypes.func,
  handleBlur: PropTypes.func,
};

export default Dropdown;
