import React from 'react';
import styled from 'styled-components';

const Div = styled.div`
  width: 500px;
  height: 300px;
  background: white;
  margin: 20vh auto;
  box-sizing: border-box;
  padding: 20px;
`;

export const Background = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, ${(props) => props.opacity});
`;

export const Modal = ({ children, clear }) => {
  const id = 'modal';
  const close = (e) => { if (e.target.id === id) clear(); };

  return (
    <Background opacity={0.2} id={id} onClick={close}>
      <Div>
        {children}
      </Div>
    </Background>
  );
};

Modal.propTypes = {
  children: React.PropTypes.node,
  clear: React.PropTypes.func,
};
