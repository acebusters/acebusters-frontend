/**
* Created by jzobro 20170517
*/
import React from 'react';
import styled from 'styled-components';

// components
import Button from '../../components/Button';
import ContainerBase from '../../components/Container';
import SeatExamples from './SeatExamples';
import SeatTester from './SeatTester';

const Container = styled(ContainerBase)`
  background-color: darkgray;
  background: radial-gradient(50% 49%, #B4B3B3 50%, #353535 100%);
`;

class UiTestPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTestPage: 'examples',
    };
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(val) {
    this.setState({ currentTestPage: val });
  }
  render() {
    const { currentTestPage } = this.state;
    const showMain = () => {
      if (currentTestPage === 'examples') return (<SeatExamples />);
      if (currentTestPage === 'tester') return (<SeatTester />);
      return (<SeatExamples />);
    };
    return (
      <Container>
        <div style={{ display: 'flex' }}>
          <Button onClick={() => this.handleClick('examples')} value="examples">
            Seat Examples
          </Button>
          <Button onClick={() => this.handleClick('tester')} value="tester">
            Test Transitions
          </Button>
        </div>
        {showMain()}
      </Container>
    );
  }
}

export default UiTestPage;
