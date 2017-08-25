import React from 'react';
import PropTypes from 'prop-types';

import {
  Tab,
  TabButton,
  TabButtonDisabled,
  TabsWrapper,
  TabIcon,
  TabTitle,
} from './styles';

const Tabs = ({ activeTab, tabs, setActiveTab, disabledTabs }) => (
  <TabsWrapper name="tabs">
    {tabs.map((tab) => {
      if (disabledTabs && disabledTabs.indexOf(tab.name) !== -1) {
        return (
          <Tab key={tab.name}>
            <TabButtonDisabled>
              <TabIcon className={`fa ${tab.icon}`} />
              <TabTitle>{tab.title}</TabTitle>
            </TabButtonDisabled>
          </Tab>
        );
      }
      return (
        <Tab name="tab" key={tab.name}>
          <TabButton
            disabled={tab.name === activeTab}
            onClick={() => setActiveTab(tab.name)}
          >
            <TabIcon className={`fa ${tab.icon}`} />
            <TabTitle>{tab.title}</TabTitle>
          </TabButton>
        </Tab>
      );
    }
  )}
  </TabsWrapper>
);
Tabs.propTypes = {
  activeTab: PropTypes.string.isRequired,
  disabledTabs: PropTypes.array,
  tabs: PropTypes.array.isRequired,
  setActiveTab: PropTypes.func.isRequired,
};

export default Tabs;
