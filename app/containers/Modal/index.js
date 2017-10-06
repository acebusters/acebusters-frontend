import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';

class ModalContainer extends React.Component {

  constructor(props) {
    super(props);

    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleClose = this.handleClose.bind(this);

    if (props.modal) {
      window.addEventListener('keyup', this.handleKeyUp);
    }
  }

  componentWillUpdate(nextProps) {
    if (nextProps.modal) {
      window.addEventListener('keyup', this.handleKeyUp);
    } else {
      window.removeEventListener('keyup', this.handleKeyUp);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.handleKeyUp);
  }

  handleKeyUp(e) {
    if (e.keyCode === 27) {
      this.handleClose();
    }
  }

  handleClose() {
    const { modalDismiss, modal: { closeHandler } } = this.props;
    if (typeof closeHandler === 'function') {
      closeHandler();
    } else {
      modalDismiss();
    }
  }

  render() {
    return (
      <Modal handleClose={this.handleClose} {...this.props} />
    );
  }
}
ModalContainer.propTypes = {
  modalDismiss: PropTypes.func,
  modal: PropTypes.shape({
    closeHandler: PropTypes.func,
  }),
};

export default ModalContainer;
