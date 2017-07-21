import React from 'react';
import PropTypes from 'prop-types';

const PanesRoot = ({ panes, paneType, paneProps }) => {
  if (!paneType) {
    return null;
  }
  const SpecifiedPane = panes[paneType];
  return <SpecifiedPane name="dashboard-root" {...paneProps} />;
};
PanesRoot.propTypes = {
  panes: PropTypes.object.isRequired,
  paneType: PropTypes.string.isRequired,
  paneProps: PropTypes.object.isRequired,
};

export default PanesRoot;
