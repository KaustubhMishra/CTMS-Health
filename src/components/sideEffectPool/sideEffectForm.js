import React, {PropTypes} from 'react';
import TextInput from '../common/TextInput';
import {browserHistory, Link} from 'react-router';
import { Conditional } from 'react-conditional-render';

const SideEffectForm = ({sideEffect, onSave, onChange, errors}) => {
    
    return (
        <div className="sponsor-form">
            <ul className="form-list">
                <li>
                    <div className="form-field-row">
                        <label>Name</label>
                        <div className="input-field">
                            <TextInput
                                name="name"
                                value={sideEffect.name}
                                onChange={onChange}
                                error={errors.name}
                            />
                        </div>
                    </div>
                </li>
                
            </ul>
            <div className="sponsor-form-action">
                <input type="submit" 
                    value="Save"
                    className="btn blue"
                    onClick={onSave}
                />
                <Link className="btn btn-border" to="/sideEffects"> Cancel</Link>
            </div>
        </div>
  );
};

SideEffectForm.propTypes = {
  sideEffect: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object
};

export default SideEffectForm;
