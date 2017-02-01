import React from 'react'
import FormError from './FormError'

function ErrorMessage (props) {
  return (
    <div className='form__error-wrapper js-form__err-animation'>
      <FormError>
        {props.error}
      </FormError>
    </div>
  )
}

ErrorMessage.propTypes = {
  error: React.PropTypes.string
}

export default ErrorMessage