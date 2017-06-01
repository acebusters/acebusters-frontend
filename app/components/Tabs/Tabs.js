import React from 'react';
import styled from 'styled-components';
import TabPane, { TabPaneWrapper } from './TabPane';

const ContentWrapper = styled.div`
    width: 100%;
`;

const TabsHeader = function (props) {
  const headers = props.panes.map((message, index) => {
    const active = props.activeKey === index;
    return (<TabPane
      index={index}
      active={active}
      setActive={props.setActive}
      key={message.id}
      message={message}
    />
    );
  });

  return (
    <TabPaneWrapper>
      { headers }
    </TabPaneWrapper>
  );
};


export default class Tabs extends React.Component {

  constructor(props) {
    super(props);
    this.setActive = this.setActive.bind(this);
    this.state = {
      activeKey: props.activeKey,
    };
  }

  setActive(key) {
    this.setState({
      activeKey: key,
    });
  }


  renderTabContent() {
    return React.Children.map(this.props.children, (child, index) => {
      const active = this.state.activeKey === index;
      return React.cloneElement(child,
        {
          index,
          active,
          key: index,
        });
    });
  }

  render() {
    return (
      <div>
        <TabsHeader
          panes={this.props.panes}
          activeKey={this.state.activeKey}
          setActive={this.setActive}
        />
        <ContentWrapper>
          { this.renderTabContent() }
        </ContentWrapper>
      </div>
    );
  }
}

Tabs.propTypes = {
  activeKey: React.PropTypes.number,
  children: React.PropTypes.array,
  panes: React.PropTypes.array,
};

Tabs.defaultProps = {
  activeKey: 0,
};


TabsHeader.propTypes = {
  setActive: React.PropTypes.func,
  panes: React.PropTypes.array,
};

TabsHeader.defaultProps = {
  activeKey: 0,
};

Tabs.TabPane = TabPane;
