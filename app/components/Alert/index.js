import { PropTypes } from 'react';
import styled from 'styled-components';

const borderColors = {
  danger: '#dcb1b1',
  success: '#d4e7c4',
};

const bgColors = {
  danger: '#ffcaca',
  success: '#e7efe4',
};

const textColors = {
  danger: '#634a49',
  success: '#3a6536',
};

const Alert = styled.div`
  padding: 5px 10px;
  margin: 10px 0;
  border: 1px solid ${(props) => borderColors[props.theme]};
  border-radius: 4px;
  color: ${(props) => textColors[props.theme]};
  background-color: ${(props) => bgColors[props.theme]};
`;

export default Alert;

Alert.propTypes = {
  theme: PropTypes.oneOf(['success', 'danger']),
};

Alert.defaultProps = {
  theme: 'success',
};
