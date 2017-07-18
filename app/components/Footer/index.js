import React from 'react';
import { FormattedMessage } from 'react-intl';
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

  @media (max-width: 500px) {
    font-size: 3em !important;
  }
`;

const CenterDiv = styled.div`
  padding: 5px;
  text-align: center;
`;

const IconContainer = styled.div`
    
`;

const Icons = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0 10em;

  @media (max-width: 500px) {
    margin: 0 2em;
  }
`;

function Footer() {
  return (
    <Wrapper>
      <Icons>
        <CenterDiv>
          <a href="https://github.com/acebusters" target="_blank"><StyledIcon className="fa fa-github"></StyledIcon></a>
        </CenterDiv>
        <CenterDiv>
          <IconContainer>
            <a href="https://discordapp.com/invite/7PesDTZ" target="_blank"><StyledIcon className="fa icon-discord"></StyledIcon></a>
          </IconContainer>
        </CenterDiv>
        <CenterDiv>
          <a href="https://twitter.com/ace_busters" target="_blank"><StyledIcon className="fa fa-twitter" ></StyledIcon></a>
        </CenterDiv>
        <CenterDiv>
          <a href="https://www.facebook.com/acebusters.poker" target="_blank"><StyledIcon className="fa fa-facebook"></StyledIcon></a>
        </CenterDiv>
      </Icons>
      <div>
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
      </div>
    </Wrapper>
  );
}

export default Footer;
