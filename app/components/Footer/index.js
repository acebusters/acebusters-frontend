import React from 'react';
import { FormattedMessage } from 'react-intl';
import Grid from 'grid-styled';
import styled from 'styled-components';
import A from 'components/A';
import LocaleToggle from 'containers/LocaleToggle';
import Wrapper from './Wrapper';
import messages from './messages';

import {
  baseColor,
  white,
} from '../../variables';

export const StyledIcon = styled.i`
  font-size: 5em !important;
  color: ${baseColor};
  padding: 0.1em;
  &:hover {
    color: ${white};
  }
`;

const CenterDiv = styled.div`
  padding: 5px;
  text-align: center;
`;

const IconContainer = styled.div`
    margin-left: -20px;
`;

function Footer() {
  return (
    <Wrapper>
      <Grid xs={1 / 1}>
        <Grid xs={1 / 4}>
          <CenterDiv>
            <a href="https://github.com/acebusters" target="_blank"><StyledIcon className="fa fa-github"></StyledIcon></a>
          </CenterDiv>
        </Grid>
        <Grid xs={1 / 4}>
          <CenterDiv>
            <IconContainer>
              <a href="https://discordapp.com/invite/7PesDTZ" target="_blank"><StyledIcon className="fa icon-discord"></StyledIcon></a>
            </IconContainer>
          </CenterDiv>
        </Grid>
        <Grid xs={1 / 4}>
          <CenterDiv>
            <a href="https://twitter.com/ace_busters" target="_blank"><StyledIcon className="fa fa-twitter" ></StyledIcon></a>
          </CenterDiv>
        </Grid>
        <Grid xs={1 / 4}>
          <CenterDiv>
            <a href="https://www.facebook.com/acebusters.poker" target="_blank"><StyledIcon className="fa fa-facebook"></StyledIcon></a>
          </CenterDiv>
        </Grid>
      </Grid>
      <Grid xs={1 / 1}>
        <CenterDiv>
          <LocaleToggle />
        </CenterDiv>
        <CenterDiv>
          <FormattedMessage
            {...messages.authorMessage}
            values={{
              author: <A href="https://twitter.com/Ace_Busters">Acebusters</A>,
            }}
          />
        </CenterDiv>
        <CenterDiv>
          <A href="http://www.acebusters.com/terms_of_use.html">Terms of Use</A>
        </CenterDiv>
      </Grid>
    </Wrapper>
  );
}

export default Footer;
