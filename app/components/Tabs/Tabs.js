import React from 'react';
import styled from 'styled-components';
import TabPane, { TabPaneWrapper } from './TabPane';

const ContentWrapper = styled.div`
    width: 100%;
`;

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

  renderTabHeader() {
    return this.props.panes.map((title, index) => {
      const active = this.state.activeKey === index;
      return (<TabPane
        title={title}
        index={index}
        active={active}
        setActive={this.setActive}
        key={index}
      />
      );
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
        <TabPaneWrapper>
          { this.renderTabHeader() }
        </TabPaneWrapper>
        <ContentWrapper>
          { this.renderTabContent() }
        </ContentWrapper>
      </div>
    );
  }
}

Tabs.propTypes = {
  activeKey: React.PropTypes.number,
  panes: React.PropTypes.array,
  children: React.PropTypes.array,
};

Tabs.defaultProps = {
  activeKey: 0,
};

Tabs.TabPane = TabPane;
