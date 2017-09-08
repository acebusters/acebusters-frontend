import styled from 'styled-components';

// Controller
export const ControlWrapper = styled.div`
  width: 100%;
  display: flex;
`;

export const FieldGroup = styled.div`
  display: flex;
  width: 100%;
  margin-right: 8px;
  text-align: right;
  align-items: center;
  border: solid 1px gainsboro;
  border-radius: 4px;
  outline: ${(props) => props.focus ? '-webkit-focus-ring-color auto 5px' : 'none'};
  ${(props) => props.disabled ?
    `background-color: #e6e6e6;
    cursor: not-allowed;`
    :
    ''
  };
`;

export const Unit = styled.span`
  padding-right: 12px;
  text-transform: uppercase;
`;
