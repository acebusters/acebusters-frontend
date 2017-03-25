import React from 'react';
import styled from 'styled-components';

const Block = styled.div`
  width: 64px;
  height: 64px;
  background-size: cover;
  background-repeat: no-repeat;
  border-radius: 50%;
  backgroundImage: url(${(props) => props.blocky});
  box-shadow: inset rgba(255, 255, 255, 0.6) 0 2px 2px, inset rgba(0, 0, 0, 0.3) 0 -2px 6px;
`;

function Blocky(props) {
  return (
    <Block blocky={props.blocky}></Block>
  );
}

Blocky.propTypes = {
  blocky: React.PropTypes.string,
};

export default Blocky;
