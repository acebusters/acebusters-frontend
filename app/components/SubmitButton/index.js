import React from 'react';
import styled from 'styled-components';
import Button from '../Button';

const Wrapper = styled.div`
  text-align: center;
`;

function SubmitButton({ ...props }) {
  return (
    <Wrapper>
      <Button type="submit" {...props} />
    </Wrapper>
  );
}

export default SubmitButton;
