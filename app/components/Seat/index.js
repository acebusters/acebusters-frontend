/**
 * Created by helge on 15.02.17.
 */

import React from 'react';
import {
  baseColor,
  green,
  gray,
} from 'variables';
import Card from '../Card';
import { SeatWrapper, ImageContainer, CardContainer, DealerButton, SeatLabel, ChipGreen, Amount } from './SeatWrapper';
import { StackBox, NameBox, TimeBox, AmountBox } from './Info';


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
        <ImageContainer
          pos={props.pos}
          color={'#fff'}
          cursor={'pointer'}
        >
          <SeatLabel>
            { status }
          </SeatLabel>
        </ImageContainer>
      </SeatWrapper>
      );
  } else {
    let color;
    if (props.pos === props.whosTurn) {
      color = green;
    } else if (props.sitout) {
      color = gray;
    } else {
      color = baseColor;
    }
    seat = (
      <SeatWrapper
        coords={props.coords}
      >
        <ImageContainer
          blocky={props.blocky}
          color={color}
        >
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
              <ChipGreen>
              </ChipGreen>
              <Amount>
                { props.lastAmount }
              </Amount>
            </div>
            }
          </AmountBox>
          <div>
            <NameBox> { props.signerAddr }
              <hr />
            </NameBox>
            <StackBox> { props.stackSize }</StackBox>
          </div>
          <TimeBox>{ (props.timeLeft > 0) ? props.timeLeft : '' } </TimeBox>
        </ImageContainer>
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
