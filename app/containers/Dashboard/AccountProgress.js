import React from 'react';
import { object } from 'prop-types';
import styled from 'styled-components';
import BigNumber from 'bignumber.js';
import { round } from '../../utils';

const Root = styled.div`
  position: relative;

  margin: 10px 0 0;
  height: 32px;
  background-color: rgba(0, 0, 0, 0.1);
`;

const Scale = styled.div`
  width: ${(props) => props.progress * 100}%;
  height: 100%;

  background-color: rgba(0, 0, 0, 0.2);
`;

const Label = styled.div`
  position: absolute;
  top: 0;
  left: 0;

  padding: 5px 10px;
`;

const AccountProgress = ({
  ethBalance,
  nutzBalance,
  floor,
  ethLimit,
}) => {
  const progress = BigNumber.min(1, ethBalance.add(nutzBalance.div(floor)).div(ethLimit)).toNumber();
  return (
    <Root>
      <Scale progress={progress} />
      <Label>
        Limit usage: {round(progress * 100, 1)}%
      </Label>
    </Root>
  );
};

AccountProgress.propTypes = {
  ethBalance: object.isRequired,
  nutzBalance: object.isRequired,
  floor: object.isRequired,
  ethLimit: object.isRequired,
};

export default AccountProgress;
