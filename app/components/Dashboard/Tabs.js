import React from 'react';
import PropTypes from 'prop-types';

import {
  Tab,
  TabButton,
  TabsWrapper,
  TabIcon,
  TabTitle,
} from './styles';

const Tabs = ({ activeTab, tabs, setActiveTab }) => (
  <TabsWrapper name="tabs">
    {tabs.map((tab) => (
      <Tab name="tab" key={tab.name}>
        <TabButton
          disabled={tab.name === activeTab}
          onClick={() => setActiveTab(tab.name)}
        >
          <TabIcon className={`fa ${tab.icon}`} />
          <TabTitle>{tab.title}</TabTitle>
        </TabButton>
      </Tab>
    ))}
  </TabsWrapper>
);
Tabs.propTypes = {
  activeTab: PropTypes.string.isRequired,
  tabs: PropTypes.array.isRequired,
  setActiveTab: PropTypes.func.isRequired,
};

export default Tabs;
