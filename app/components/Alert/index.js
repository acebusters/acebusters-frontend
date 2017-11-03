import PropTypes from 'prop-types';
import styled from 'styled-components';
import { gray } from '../../variables';

const borderColors = {
  info: '#eee',
  danger: '#dcb1b1',
  warning: '#ccbb99',
  success: '#d4e7c4',
  none: '#999',
};

const bgColors = {
  info: '#f4f7f9',
  danger: '#ffcaca',
  warning: '#ffee99',
  success: '#e7efe4',
  none: 'none',
};

const textColors = {
  info: gray,
  danger: '#634a49',
  warning: '#634a33',
  success: '#3a6536',
  none: 'none',
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
  theme: PropTypes.oneOf(['info', 'success', 'warning', 'danger', 'none']),
};

Alert.defaultProps = {
  theme: 'success',
};
