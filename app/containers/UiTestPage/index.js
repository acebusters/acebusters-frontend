/**
* Created by jzobro 20170517
*/
import React from 'react';
import styled from 'styled-components';

// components
import Button from '../../components/Button';
import ContainerBase from '../../components/Container';
import CardExamples from './CardExamples';
import SeatExamples from './SeatExamples';
import SeatTester from './SeatTester';
import ButtonExamples from './ButtonExamples';

const Container = styled(ContainerBase)`
  background-color: darkgray;
  background: radial-gradient(50% 49%, #B4B3B3 50%, #353535 100%);
`;

class UiTestPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTestPage: 'cards',
    };
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(val) {
    this.setState({ currentTestPage: val });
  }
  render() {
    const { currentTestPage } = this.state;
    const showMain = () => {
      if (currentTestPage === 'cards') return (<CardExamples />);
      if (currentTestPage === 'seats') return (<SeatExamples />);
      if (currentTestPage === 'buttons') return (<ButtonExamples />);
      if (currentTestPage === 'tester') return (<SeatTester />);
      return (<SeatExamples />);
    };
    return (
      <Container>
        <div style={{ display: 'flex' }}>
          <Button onClick={() => this.handleClick('seats')}>
            Seats
          </Button>
          <Button onClick={() => this.handleClick('cards')}>
            Cards
          </Button>
          <Button onClick={() => this.handleClick('buttons')}>
            Buttons
          </Button>
          <Button onClick={() => this.handleClick('tester')}>
            Test Transitions
          </Button>
        </div>
        {showMain()}
      </Container>
    );
  }
}

export default UiTestPage;
