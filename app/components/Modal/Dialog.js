import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: relative;

  box-sizing: border-box;
  width: auto;
  margin-bottom: 20px;
  padding: 20px;

  color: #333;
  background: white;
  box-shadow: 0px 2px 15px rgba(0, 0, 0, 0.4);
  border-radius: 10px;
`;

const CloseButton = styled.a`
  position: absolute;
  top: 0px;
  right: 0px;

  width: 30px;
  height: 30px;

  cursor: pointer;

  transition: transform 0.1s;
`;

class ModalDialog extends React.Component {

  constructor(props) {
    super(props);

    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleClose = this.handleClose.bind(this);

    window.addEventListener('keyup', this.handleKeyUp);
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
    if (typeof this.props.onClose === 'function') {
      this.props.onClose();
    }
  }

  render() {
    const { children, ...props } = this.props;

    return (
      <Wrapper {...props}>
        {children}

        <CloseButton onClick={this.handleClose}>
          <svg width="30" height="30">
            <g transform="rotate(45 15 15)">
              <rect x="5" y="14.25" width="20" height="1.5" fill="#000" />
              <rect y="5" x="14.25" height="20" width="1.5" fill="#000" />
            </g>
          </svg>
        </CloseButton>
      </Wrapper>
    );
  }

}

ModalDialog.propTypes = {
  children: PropTypes.any,
  onClose: PropTypes.func,
};

export default ModalDialog;
