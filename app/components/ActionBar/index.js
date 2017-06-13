/**
 * Created by helge on 24.08.16.
 */
import React from 'react';

import ActionButton from './ActionButton';
import Slider from '../Slider';

import {
  ActionBarWrapper,
  ControlPanel,
} from './styles';

const ActionBar = (props) => {
  const {
    active, amount, amountToCall, callAmount, isMyTurn, handleBet, handleCall,
    handleCheck, handleFold, minRaise, myStack,
    state, updateAmount,
  } = props;
  const buttonState1 = [
    {
      nodeName: 'raise',
      text: `RAISE ${amount}`,
      size: 'medium',
      onClick: () => handleBet(),
    },
    {
      nodeName: 'call',
      text: `CALL ${callAmount}`,
      size: 'medium',
      onClick: () => handleCall(),
    },
    {
      nodeName: 'fold',
      text: 'FOLD',
      size: 'medium',
      onClick: () => handleFold(),
    },
  ];
  const buttonState2 = [
    {
      nodeName: 'null',
      text: '',
      size: 'medium',
      onClick: null,
    },
    {
      nodeName: 'call',
      text: `CALL ${callAmount}`,
      size: 'medium',
      onClick: () => handleCall(),
    },
    {
      nodeName: 'fold',
      text: 'FOLD',
      size: 'medium',
      onClick: () => handleFold(),
    },
  ];
  const buttonState3 = [
    {
      nodeName: 'bet',
      text: `BET ${amount}`,
      size: 'medium',
      onClick: () => handleBet(),
    },
    {
      nodeName: 'check',
      text: 'CHECK',
      size: 'medium',
      onClick: () => handleCheck(),
    },
    {
      nodeName: 'null',
      text: '',
      size: 'medium',
      onClick: null,
    },
  ];
  const buttonStateNull = [
    {
      nodeName: 'null',
      text: '',
      size: 'medium',
      onClick: null,
    },
    {
      nodeName: 'null',
      text: '',
      size: 'medium',
      onClick: null,
    },
    {
      nodeName: 'null',
      text: '',
      size: 'medium',
      onClick: null,
    },
  ];
  const renderButtonGroup = () => {
    if (amountToCall > 0) {
      if (myStack > amountToCall) {
        return buttonState1;
      }
      return buttonState2;
    }
    if (amountToCall === 0) {
      return buttonState3;
    }
    return buttonStateNull;
  };
  const isAppropriateState = (
    state !== 'waiting' && state !== 'dealing' && state !== 'showdown'
  );
  if (active && isMyTurn && isAppropriateState) {
    return (
      <ActionBarWrapper name="action-bar-wrapper">
        {myStack > amountToCall &&
          <Slider
            data-orientation="vertical"
            value={amount}
            min={minRaise}
            max={myStack}
            step={1}
            onChange={updateAmount}
          />
        }
        <ControlPanel name="control-panel">
          {renderButtonGroup().map((item, index) => (
            <ActionButton
              name={item.nodeName}
              key={index}
              size={item.size}
              onClick={item.onClick}
              text={item.text}
            />
          ))}
        </ControlPanel>
      </ActionBarWrapper>
    );
  }
  return null;
};

ActionBar.propTypes = {
  active: React.PropTypes.bool,
  amount: React.PropTypes.number,
  amountToCall: React.PropTypes.number,
  callAmount: React.PropTypes.number,
  handleBet: React.PropTypes.func,
  handleCheck: React.PropTypes.func,
  handleCall: React.PropTypes.func,
  handleFold: React.PropTypes.func,
  updateAmount: React.PropTypes.func,
  isMyTurn: React.PropTypes.bool,
  minRaise: React.PropTypes.number,
  myStack: React.PropTypes.number,
  state: React.PropTypes.string,
};

export default ActionBar;
