import React from 'react';
import styled from 'styled-components';

const ModalDiv = styled.div`
  width: 300px;
  height: 300px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -150px;
  margin-left: -150px;
  z-index: 9999;
  background: yellow;
`;

const Backdrop = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  z-index: 9998;
  background: rgba(0, 0, 0, 0.3);
`;

export function Modal(props) {
  if (props.isOpen) {
    return (
      <Backdrop onClick={props.transferToggle}>
        <ModalDiv>
          {props.children}
        </ModalDiv>
      </Backdrop>
    );
  }
  return (<div />);
}

Modal.propTypes = {
  children: React.PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.node),
    React.PropTypes.node,
  ]),
  transferToggle: React.PropTypes.func,
  isOpen: React.PropTypes.bool,
};

export default Modal;
