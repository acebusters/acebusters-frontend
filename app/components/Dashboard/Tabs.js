import React from 'react';
import PropTypes from 'prop-types';
import Link from '../Link';

import {
  Tab,
  TabLink,
  TabLinkActive,
  TabButtonDisabled,
  TabsWrapper,
  TabIcon,
  TabTitle,
} from './styles';

const Tabs = ({ tabs, disabledTabs }) => (
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
        <Tab name="tab" key={tab.name} data-tour={tab.name}>
          <Link
            to={tab.to}
            component={TabLink}
            activeComponent={TabLinkActive}
            onlyActiveOnIndex={tab.onlyActiveOnIndex}
          >
            <TabIcon className={`fa ${tab.icon}`} />
            <TabTitle>{tab.title}</TabTitle>
          </Link>
        </Tab>
      );
    }
  )}
  </TabsWrapper>
);
Tabs.propTypes = {
  disabledTabs: PropTypes.array,
  tabs: PropTypes.array.isRequired,
};

export default Tabs;
