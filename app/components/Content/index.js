import styled from 'styled-components';

import {
  fontFamilyBase,
  fontSizeBase,
  lineHeightBase,
  fontWeightBase,
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
  color: ${fontPrimary};

  min-height: 100%;
  z-index: 800;

  /* fixed layout */
  padding-top: none;
  }
`;

export default Content;
