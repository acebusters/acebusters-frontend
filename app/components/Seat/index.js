/**
 * Created by helge on 15.02.17.
 */

import React from 'react';
import {
  baseColor,
  green,
  gray,
} from 'variables';
import { nickNameByAddress } from '../../services/nicknames';
import Card from '../Card';
import Radial from '../RadialProgress';
import Pot from '../Pot';
import { SeatWrapper, CardContainer, DealerButton } from './SeatWrapper';
import { StackBox, NameBox, AmountBox } from './Info';


function SeatComponent(props) {
  const cardSize = 40;
  let seat = null;
  let status = '';
  if (props.pending) {
    status = 'PENDING';
  } else if (props.myPos === undefined) {
    status = 'JOIN';
  } else {
    status = 'EMPTY';
  }
  if (props.open || props.pending) {
    seat = (
      <SeatWrapper
        onClick={() => props.isTaken(props.open, props.myPos, props.pending, props.pos)}
        coords={props.coords}
      >
        <Radial
          color={'#fff'}
          cursor={'pointer'}
          label={status}
        >
        </Radial>
      </SeatWrapper>
      );
  } else {
    let color;
    if (props.state !== 'showdown' && props.pos === props.whosTurn) {
      color = green;
    } else if (typeof props.sitout === 'number') {
      color = gray;
    } else {
      color = baseColor;
    }
    seat = (
      <SeatWrapper
        coords={props.coords}
      >
        <Radial
          percent={props.timeLeft}
          strokeWidth="10"
          strokeColor={color}
          bgImg={props.blocky}
        />
        <DealerButton
          dealer={props.dealer}
          pos={props.pos}
        >
        </DealerButton>
        <CardContainer>
          <Card
            cardNumber={props.holeCards[0]}
            folded={props.folded}
            size={cardSize}
            offset={[0, 0]}
          >
          </Card>
          <Card
            cardNumber={props.holeCards[1]}
            folded={props.folded}
            size={cardSize}
            offset={[-100, -133]}
          >
          </Card>
        </CardContainer>
        <AmountBox
          amountCoords={props.amountCoords}
        >
          { (props.lastAmount > 0) &&
          <div>
            <Pot potSize={props.lastAmount} left="0%" top="0%" />
          </div>
          }
        </AmountBox>
        <div>
          <NameBox> { nickNameByAddress(props.signerAddr) }
            <hr />
          </NameBox>
          <StackBox> { props.stackSize }</StackBox>
        </div>
      </SeatWrapper>
    );
  }
  return seat;
}

SeatComponent.propTypes = {
  pos: React.PropTypes.number,
  cards: React.PropTypes.array,
  lastAction: React.PropTypes.string,
  lastAmount: React.PropTypes.number,
  folded: React.PropTypes.bool,
};

export default SeatComponent;
