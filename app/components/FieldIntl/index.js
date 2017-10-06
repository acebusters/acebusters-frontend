/* eslint no-multi-spaces: "off", key-spacing: "off" */

import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form/immutable';
import { injectIntl } from 'react-intl';

const FieldIntl = (props) => {
  const data = ['label', 'placeholder'].reduce((_obj, key) => {
    const obj = _obj;
    // Note: props[key] could either be a normal string or a messageDescriptor obj
    if (typeof props[key] === 'string') {
      obj[key] = props[key];
    } else {
      obj[key] = props.intl.formatMessage(props[key]);
    }

    return obj;
  }, {});

  return (
    <Field {...props} {...data} />
  );
};

FieldIntl.propTypes = {
  ...Field.propTypes,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  placeholder: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

export default injectIntl(FieldIntl);
