/**
 * Created by helge on 24.08.16.
 */
import React from 'react';

import ChatWrapper from '../Chat';
import Chat from '../../containers/Chat';

import ActionButton from './ActionButton';
import Slider from '../Slider';

import {
  ActionBarWrapper,
  ControlPanel,
} from './styles';

const ActionBar = (props) => {
  const {
    active, amount, amountToCall, callAmount, isMyTurn, handleBet, handleCall,
    handleCheck, handleFold, messages, minRaise, myPos, myStack, params,
    playerCount, state, sendMessage, updateAmount,
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
  const isTakePartOfAGame = myPos != null;
  const isAppropriateState = (
    state !== 'waiting' && state !== 'dealing' && state !== 'showdown'
  );
  const canSeeChat = (isTakePartOfAGame && !isMyTurn && isAppropriateState) || !isTakePartOfAGame;
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
  } else if (canSeeChat) {
    const ta = params.tableAddr.substring(2, 8);
    const chatPlaceholder = `table <${ta}> in state ${state} has ${playerCount || 'no'} player${playerCount === 1 ? '' : 's'}.`;
    return (
      <ChatWrapper>
        <Chat onAddMessage={sendMessage} messages={messages} readonly={!isTakePartOfAGame} placeholder={chatPlaceholder} />
      </ChatWrapper>
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
  sendMessage: React.PropTypes.func,
  isMyTurn: React.PropTypes.bool,
  messages: React.PropTypes.array,
  minRaise: React.PropTypes.number,
  myStack: React.PropTypes.number,
  myPos: React.PropTypes.number,
  state: React.PropTypes.string,
  params: React.PropTypes.object,
  playerCount: React.PropTypes.number,
};

export default ActionBar;
