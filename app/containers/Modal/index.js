import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Modal from 'components/Modal';

import { makeModalSelector } from 'containers/App/selectors';
import { modalDismiss } from 'containers/App/actions';

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
    const { modal: { closeHandler } } = this.props;
    if (typeof closeHandler === 'function') {
      closeHandler();
    } else {
      this.props.modalDismiss();
    }
  }

  render() {
    return (
      <Modal handleClose={this.handleClose} modal={this.props.modal} />
    );
  }
}
ModalContainer.propTypes = {
  modalDismiss: PropTypes.func,
  modal: PropTypes.shape({
    closeHandler: PropTypes.func,
  }),
};

const mapDispatchToProps = (dispatch) => ({
  modalDismiss: () => dispatch(modalDismiss()),
});

const mapStateToProps = createStructuredSelector({
  modal: makeModalSelector(),
});

export default connect(mapStateToProps, mapDispatchToProps)(ModalContainer);
