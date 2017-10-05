import PropTypes from 'prop-types';
import styled from 'styled-components';

const Blocky = styled.div`
  width: 64px;
  height: 64px;
  background-size: cover;
  background-repeat: no-repeat;
  border-radius: 50%;
  background-image: url(${(props) => props.blocky});
  box-shadow: inset rgba(255, 255, 255, 0.6) 0 2px 2px, inset rgba(0, 0, 0, 0.3) 0 -2px 6px;
`;

Blocky.propTypes = {
  blocky: PropTypes.string,
};

export default Blocky;
