import React from 'react';

import { Icon } from '../../containers/Dashboard/styles';
import { gray } from '../../variables';

const countDecimals = (value) =>
  Math.floor(value.toNumber()) === value.toNumber() ? 0 : value.toString().split('.')[1].length || 0;

export default ({ number = 0, decimals = 2, postfix = '' } = {}) =>
  countDecimals(number) === decimals
    ? <span>{number.toFormat()} {postfix}</span>
    : (
      <span>
        {number.toFormat(decimals)}
        &nbsp;
        {postfix}
        &nbsp;
        <Icon
          style={{ color: gray }}
          className="fa fa-info-circle"
          aria-hidden="true"
          title={number.toFormat()}
        />
      </span>
    );
