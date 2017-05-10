import React from 'react';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';

import {
  baseColor,
  green,
  gray,
} from 'variables';

import Grid from 'grid-styled';
import H1 from '../../components/H1';
import Radial from '../../components/RadialProgress';
import messages from './messages';
import Slides from '../../components/Slides';

const StyledDiv = styled.div`
    font-size: 8em;
    text-align: center;
`;

function JoinSlides() {
  return (
    <Slides width={600} height={400}>
      <div>
        <H1>
          <FormattedMessage {...messages.slides.first.header} />
        </H1>
        <h2>
          <FormattedMessage {...messages.slides.first.text} />
        </h2>
        <StyledDiv>
          <i className="fa fa-cogs fa-5"></i>
        </StyledDiv>
      </div>
      <div>
        <H1>
          <FormattedMessage {...messages.slides.second.header} />
        </H1>
        <Grid sm={1 / 3}>
          <Radial
            percent="100"
            strokeWidth="10"
            strokeColor={baseColor}
          />
          <p>
            <FormattedMessage {...messages.slides.second.active} />
          </p>
        </Grid>
        <Grid sm={1 / 3}>
          <Radial
            percent="100"
            strokeWidth="10"
            strokeColor={green}
          />
          <p>
            <FormattedMessage {...messages.slides.second.isTurn} />
          </p>
        </Grid>
        <Grid sm={1 / 3}>
          <Radial
            percent="100"
            strokeWidth="10"
            strokeColor={gray}
          />
          <p>
            <FormattedMessage {...messages.slides.second.sitOut} />
          </p>
        </Grid>
      </div>
      <div>
        <H1>
          <FormattedMessage {...messages.slides.third.header} />
        </H1>
        <h2>
          <FormattedMessage {...messages.slides.third.text} />
        </h2>
        <StyledDiv>
          <i className="fa fa-shield fa-5"></i>
        </StyledDiv>
      </div>
    </Slides>
  );
}

export default JoinSlides;

