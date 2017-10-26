import React from 'react';
import classnames from 'classnames';

const TextFieldGroup = ({ field, value, label, error, type, onChange}) => {
  return (
    <div className={classnames('field-row', { 'has-error': error })}>
      <label>{label}:</label>
      <div className={classnames('field-input')}>
        <input
          onChange={onChange}
          value={value}
          type={type}
          name={field}
        />
        {error && <span className="help-block">{error}</span>}
      </div>
    </div>  );
}

TextFieldGroup.propTypes = {
  field: React.PropTypes.string.isRequired,
  value: React.PropTypes.string.isRequired,
  label: React.PropTypes.string.isRequired,
  error: React.PropTypes.string,
  type: React.PropTypes.string.isRequired,
  onChange: React.PropTypes.func.isRequired
}

TextFieldGroup.defaultProps = {
  type: 'text'
}

export default TextFieldGroup;
