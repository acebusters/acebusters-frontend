import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { DialogTransitionGroup } from './DialogTransitionGroup';
import { ContainerTransitionGroup } from './ContainerTransitionGroup';

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
`;

const Background = styled.div`
  position: absolute;
  top: 0;
  left: 0;

  width: 100%;
  height: 100%;

  opacity: 0.85;

  transition: opacity 0.3s;
  background-color: rgb(24, 39, 56);
`;

const Modals = styled.div`
  position: absolute;
  top: 0;
  left: 0;

  overflow-y: auto;
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;

  opacity: 1;

  transition: opacity 0.3s;
`;

const ModalContainer = ({ children, ...props }) => (
  <ContainerTransitionGroup component={Wrapper} {...props}>
    <Background />
    <DialogTransitionGroup component={Modals}>
      {children}
    </DialogTransitionGroup>
  </ContainerTransitionGroup>
);

ModalContainer.propTypes = {
  children: PropTypes.any,
};

export default ModalContainer;
