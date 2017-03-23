/**
 * Created by helge on 15.02.17.
 */

import React from 'react';
import Card from '../Card'; // eslint-disable-line
import { SeatWrapper, ImageContainer, CardContainer, DealerButton, SeatLabel, ChipGreen } from './SeatWrapper';
import { ActionBox, StackBox, NameBox, TimeBox, AmountBox } from './Info';

function SeatComponent(props) {
  const cardSize = 40;
  let seat = null;
  let status = '';
  if (props.pending) {
    status = 'PENDING';
  } else if (props.myPos === -1) {
    status = 'JOIN';
  } else {
    status = 'EMPTY';
  }

  if (props.open || props.pending) {
    seat = (
      <SeatWrapper
        coords={props.coords}
      >
        <ImageContainer {...props} >
          <SeatLabel>
            { status }
          </SeatLabel>
        </ImageContainer>
      </SeatWrapper>
      );
  } else {
    seat = (
      <SeatWrapper
        coords={props.coords}
        {...props}
      >
        <ImageContainer {...props}>
          <DealerButton {...props}></DealerButton>
          <CardContainer>
            <Card
              cardNumber={props.cards[0]}
              folded={props.folded}
              size={cardSize}
              offset={[0, 0]}
            >
            </Card>
            <Card
              cardNumber={props.cards[1]}
              folded={props.folded}
              size={cardSize}
              offset={[-110, -110]}
            >
            </Card>
          </CardContainer>
          <AmountBox {...props}>
            { (props.lastAmount > 0) &&
              <div>
                <ChipGreen />
                { props.lastAmount }
              </div>
            }
          </AmountBox>
          <div>
            <NameBox {...props}> { props.lineup.getIn([props.pos, 'address']) }
              <hr />
            </NameBox>
            <StackBox {...props}> { props.stackSize }</StackBox>
          </div>
          <TimeBox>{ (props.timeLeft > 0) ? props.timeLeft : '' } </TimeBox>
          <ActionBox fontSize={2} opacity={props.opacity}> { props.lastAction } </ActionBox>
        </ImageContainer>
      </SeatWrapper>
    );
  }
  return seat;
}

SeatComponent.propTypes = {
  pos: React.PropTypes.number,
  hand: React.PropTypes.object,
  cards: React.PropTypes.array,
  lastAction: React.PropTypes.string,
  lastAmount: React.PropTypes.number,
  folded: React.PropTypes.bool,
};

export default SeatComponent;
