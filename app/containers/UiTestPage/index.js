import React, { Component } from 'react';

// components
import Container from '../../components/Container';
import Button from '../../components/Button';
import H1 from '../../components/H1';

class UiTestPage extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    console.log('hello');
  }
  render() {
    return (
      <Container>
        <div>
          <H1>Test Page</H1>
          <Button onClick={this.handleClick} size="large">
            Press Me
          </Button>
        </div>
      </Container>
    );
  }
}

export default UiTestPage;
