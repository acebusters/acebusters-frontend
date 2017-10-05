import React from 'react';
import PropTypes from 'prop-types';

class GoogleTagManager extends React.PureComponent {
  componentDidMount() {
    const { gtmId, dataLayerName, additionalEvents } = this.props;

    const gtmData = {
      gtmId,
      dataLayerName: dataLayerName || 'dataLayer',
      additionalEvents: additionalEvents || {},
    };

    this.gtmInclude(gtmData.dataLayerName, gtmData.gtmId);
  }

  gtmInclude(l, i) {
    window[l] = window[l] || [];
    window[l].push({
      'gtm.start': new Date().getTime(),
      event: 'gtm.js',
    });
    const f = document.getElementsByTagName('script')[0];
    const j = document.createElement('script');
    const dl = l !== 'dataLayer' ? `&l=${l}` : '';
    j.async = true;
    j.src = `https://www.googletagmanager.com/gtm.js?id=${i}${dl}`;
    f.parentNode.insertBefore(j, f);
  }

  render() {
    return false;
  }
}

GoogleTagManager.propTypes = {
  gtmId: PropTypes.string.isRequired,
  dataLayerName: PropTypes.string,
  additionalEvents: PropTypes.object,
};

export default GoogleTagManager;
