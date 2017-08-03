import React from 'react';
import { bool, any } from 'prop-types';
import styled from 'styled-components';
import Button from '../Button';
import WithLoading from '../WithLoading';

const Wrapper = styled.div`
  text-align: center;
`;

const styles = {
  padding: '10px 40px',
  minWidth: '200px',
  minHeight: '50px',
};

function SubmitButton({ disabled, submitting, children, ...props }) {
  return (
    <Wrapper>
      <Button
        style={styles}
        type="submit"
        disabled={disabled || submitting}
        {...props}
      >
        {children}
        {submitting &&
          <WithLoading
            styles={{ outer: { marginLeft: 5 } }}
            isLoading
            loadingSize="14px"
            type="inline"
          />
        }
      </Button>
    </Wrapper>
  );
}

SubmitButton.propTypes = {
  disabled: bool,
  submitting: bool,
  children: any,
};

export default SubmitButton;
