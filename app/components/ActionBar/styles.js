/**
* Created by jzobro 20170531
*/
import styled from 'styled-components';

const Button = styled.button`
  padding: 0;
  margin: 0;
  border: none;
  background: none;
  &:focus {
    outline: none;
  }
  &:hover {
    cursor: pointer;
  }
  &:disabled{
    cursor: default;
  }
`;

export const ActionBarWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 0);
  display: flex;
  flex-direction: column;
  opacity: ${(props) => props.active ? 1 : 0.3};
`;

export const ControlPanel = styled.div`
  display: flex;
  padding-top: 4px;
  padding-left: 4px;
  padding-right: 4px;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  background-color: #999;
`;

export const ControlWrapper = styled.div`
  display: flex;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  padding-top: 4px;
  padding-left: 4px;
  padding-right: 4px;
  background-color: #666;
`;

export const ActionButtonWrapper = styled(Button)`
  display: flex;
  height: 50px;
  min-width: 100px;
  margin-left: 6px;
  background-color: #999;
  color: white;
  font-weight: 400;
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
  &:first-child {
    margin-left: 0;
    border-top-left-radius: 8px;
  }
  &:nth-child(3) {
    border-top-right-radius: 8px;
  }
  &:active {
    background-color: #666;
    color: #DDD;
  }
  &:disabled {
    background-color: #777;
    color: #DDD;
  }
`;

export const ActionIndicator = styled.div`
  margin-left: 10px;
  margin-top: 10px;
  height: 40px;
  width: 8px;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  background-color: #444;
`;

export const ActionText = styled.div`
  align-self: center;
  margin-left: 8px;
`;

export const SliderWrapper = styled.div`
  align-self: center;
  width: 200px;
  height: 20px;
  margin-left: 24px;
  margin-right: 24px;
`;

export const FlagContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-right: 12px;
  opacity: ${(props) => props.active ? 1 : 0};
`;

export const FlagButtonWrapper = styled(Button)`
  margin-left: 4px;
  padding: 5px;
  padding-left: 18px;
  padding-right: 18px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border-bottom: solid 2px #666;
  background-color: #999;
`;

export const FlagBet = styled.div`
  margin-right: 10px;
  padding: 5px;
  padding-left: 10px;
  padding-right: 20px;
  width: 142px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  background-color: #DDD;
  color: #333;
`;

export const FlagCall = styled.div`
  ${(props) => {
    if (props.sliderOpen) {
      return `
        margin-right: 18px;
      `;
    }
    return `
      margin: 0 auto;
    `;
  }};
  padding-left: 6px;
  padding-right: 6px;
  text-align: center;
  min-width: 80px;
  padding: 5px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  background-color: #DDD;
  color: #333;
`;
