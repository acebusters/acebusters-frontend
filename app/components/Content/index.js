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
    box-sizing: border-box;
  }
  &:after {
    clear: both;
  }

  /* shared */
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

  transition: ${transitionSpeed} ${transitionFn}, width ${transitionSpeed} ${transitionFn};

  /* fixed layout */
  padding-top: ${(props) => {
    if (props.fixed) return navbarHeight;
    if (props.showNavigation) return '60px';
    return '20px';
  }
  }
`;

export default Content;
