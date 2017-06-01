import React from 'react';
import styled from 'styled-components';

const TabContent = styled.div`
    display: ${(props) => props.active ? 'block' : 'none'};
`;

class TabsContentWrapper extends React.Component {

  shouldComponentUpdate(nextProps) {
    if ((nextProps.active !== this.props.active) || this.props.active) {
      return true;
    }
    return false;
  }

  render() {
    return (
      <TabContent {...this.props} />
    );
  }
}

TabsContentWrapper.propTypes = {
  active: React.PropTypes.bool,
};


export default TabsContentWrapper;
