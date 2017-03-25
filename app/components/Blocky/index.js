import React, { PropTypes } from 'react';
import styled from 'styled-components';
import { create } from '../../services/blockies';

const Block = styled.div`
  width: 64px;
  height: 64px;
  background-size: cover;
  background-repeat: no-repeat;
  border-radius: 50%;
  backgroundImage: url(${(props) => create({
    seed: props.address,
    color: props.color,
    bgcolor: props.bgcolor,
    size: 8,
    scale: 16,
    spotcolor: '#000',
  }).toDataURL()});
  box-shadow: inset rgba(255, 255, 255, 0.6) 0 2px 2px, inset rgba(0, 0, 0, 0.3) 0 -2px 6px;
`;

function Blocky(props) {
  const addr = (props.address) ? props.address : '0x00000000000000000000';
  return (
    <Block
      address={addr}
      color={`#${addr.substring(2, 5)}`}
      bgcolor={`#${addr.substring(6, 9)}`}
    ></Block>
  );
}

// We require the use of src and alt, only enforced by react in dev mode
Blocky.propTypes = {
  address: PropTypes.string,
};

export default Blocky;
