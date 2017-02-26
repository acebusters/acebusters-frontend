/**
 * Created by helge on 26.02.17.
 */

import React from 'react';
import FormInline from './FormInline';
import FormGroup from './FormGroup';


function Form({ children }) {
  return (
    <FormInline>
      <FormGroup>
        {children}
      </FormGroup>
    </FormInline>
  );
}

Form.propTypes = {
  children: React.PropTypes.node,
};

export default Form;
