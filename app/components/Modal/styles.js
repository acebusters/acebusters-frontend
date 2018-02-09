import styled from 'styled-components';
import H2 from 'components/H2';

// Container
export const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
`;

export const Background = styled.div`
  position: absolute;
  top: 0;
  left: 0;

  width: 100%;
  height: 100%;

  opacity: 0.85;

  transition: opacity 0.3s;
  background-color: rgb(24, 39, 56);
`;

export const Modals = styled.div`
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

// Dialog
export const DialogWrapper = styled.div`
  position: relative;

  box-sizing: border-box;
  width: auto;
  margin-bottom: 20px;
  padding: 40px 30px 20px 30px;

  color: #333;
  background: white;
  box-shadow: 0px 2px 15px rgba(0, 0, 0, 0.4);
  border-radius: 10px;
`;

export const DialogContents = styled.div`
  width: 480px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const DialogTitle = styled(H2)`
  margin-top: 0;
`;

export const DialogText = styled.p`
`;

export const DialogButtonWrapper = styled.div`
  margin-top: 16px;
  margin-bottom: 8px;
`;

export const CloseButton = styled.a`
  position: absolute;
  top: 5px;
  right: 5px;

  width: 30px;
  height: 30px;

  cursor: pointer;

  transition: transform 0.1s;
`;
