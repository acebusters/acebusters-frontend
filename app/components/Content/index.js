import styled from 'styled-components';

import {
  fontFamilyBase,
  fontSizeBase,
  lineHeightBase,
  fontWeightBase,
  navbarHeight,
  transitionSpeed,
  transitionFn,
  fontPrimary,
} from 'variables';

const Content = styled.div`
  /* clearfix */
  &:before, &:after {
    display: table;
    content: " ";
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
  &:after {
    clear: both;
  }

  /* shared */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-family: ${fontFamilyBase};
  font-weight: ${fontWeightBase};
  font-size: ${fontSizeBase};
  line-height: ${lineHeightBase};
  box-sizing: border-box;

  /* theme */
  ${(props) => (props.theme.contentLeftBorder && `border-left: ${(props).theme.contentLeftBorder};`)}
  background-color: transparent;
  color: ${fontPrimary}

  min-height: 100%;
  z-index: 800;

  -webkit-transition: ${transitionSpeed} ${transitionFn}, width ${transitionSpeed} ${transitionFn};
  -moz-transition: ${transitionSpeed} ${transitionFn}, width ${transitionSpeed} ${transitionFn};
  -o-transition: ${transitionSpeed} ${transitionFn}, width ${transitionSpeed} ${transitionFn};
  transition: ${transitionSpeed} ${transitionFn}, width ${transitionSpeed} ${transitionFn};

  /* fixed layout */
  ${(props) => (props.fixed && `padding-top: ${navbarHeight};`)};
`;

export default Content;
