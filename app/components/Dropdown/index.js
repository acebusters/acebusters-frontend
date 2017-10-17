import React from 'react';
import PropTypes from 'prop-types';
import find from 'lodash/find';
import { SELECT_TOKEN } from 'containers/Modal/constants';

import {
  Button,
  Caret,
  Container,
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
  const handleToggle = () => {
    modalAdd({
      modalType: SELECT_TOKEN,
      modalProps: {
        options,
        handleSelectButton: (id) => {
          onSelect(id);
          modalDismiss();
        },
      },
      backdrop: true,
    });
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
