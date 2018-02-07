import React from 'react';
import styled from 'styled-components';
import Wrapper from './Wrapper';

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

const Icons = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0 10em;

  @media (max-width: 500px) {
    margin: 0 2em;
  }
`;

const Version = styled.div`
  font-size: 10px;
`;

export const A = styled.a`
  color: ${baseColor};
  text-decoration: none !important;
  cursor: pointer;
  font-weight: 700;
  font-size: 85%;
  &:hover {
    color: ${white};
  }
`;

function Footer() {
  return (
    <Wrapper>
      <Icons>
        <CenterDiv>
          <a href="https://github.com/acebusters" target="_blank">
            <StyledIcon className="fa fa-github" />
          </a>
        </CenterDiv>
        <CenterDiv>
          <a href="https://t.me/acebusters" target="_blank">
            <StyledIcon className="fa fa-telegram" />
          </a>
        </CenterDiv>
        <CenterDiv>
          <a href="https://twitter.com/ace_busters" target="_blank">
            <StyledIcon className="fa fa-twitter" />
          </a>
        </CenterDiv>
        <CenterDiv>
          <a href="https://www.facebook.com/acebusters.poker" target="_blank">
            <StyledIcon className="fa fa-facebook" />
          </a>
        </CenterDiv>
      </Icons>
      <div>
        <CenterDiv>
          <A href="http://www.acebusters.com/terms" target="_blank">Terms of Use</A>
        </CenterDiv>
        <CenterDiv>
          <Version>{// eslint-disable-next-line no-undef
            __VERSION__
          }</Version>
        </CenterDiv>
      </div>
    </Wrapper>
  );
}

export default Footer;
