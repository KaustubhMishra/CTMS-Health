import React, {PropTypes} from 'react';
import TextInput from '../common/TextInput';
import TextArea from '../common/TextArea';
import SelectInput from '../common/SelectInput';
import {browserHistory, Link} from 'react-router';

const UserForm = ({user, label, allRole, timezoneList, onSave, onChange, saving, errors}) => {
    console.log(user);
    return (
        <div className="sponsor-form">
            <ul className="form-list">
                <li className="li">
                    <div className="form-field-row">
                        <div className="input-field">
                            <TextInput
                                name="firstname"
                                label="First Name"
                                value={user.firstname}
                                onChange={onChange}
                                error={errors.firstname}
                            />
                        </div>
                    </div>
                </li>
                <li className="li">
                    <div className="form-field-row">
                        <div className="input-field">
                            <TextInput
                                name="lastname"
                                label="Last Name"
                                value={user.lastname}
                                onChange={onChange}
                                error={errors.lastname}
                            />
                        </div>
                    </div>
                </li>
                <li className="li">
                    <div className="form-field-row">
                        <div className="input-field">
                            <TextInput
                                name="email"
                                label="Email"
                                value={user.email}
                                onChange={onChange}
                                error={errors.email}
                            />
                        </div>
                    </div>
                </li>
                <li className="li">
                    <div className="form-field-row">
                        <div className="input-field">
                            <TextInput
                                name="phone"
                                label="Contact Number"
                                value={user.phone}
                                onChange={onChange}
                                error={errors.phone}
                            />
                        </div>
                    </div>
                </li>
                <li className="li">
                    <div className="form-field-row">
                        <label>Timezone</label>
                        <div className="select-field">
                           <SelectInput
                                name="timezone"
                                label="Timezone"
                                value={user.timezone}
                                defaultOption="Select Timezone"
                                options={timezoneList}
                                onChange={onChange} 
                                error={errors.timezone}
                            />
                        </div>
                    </div>
                </li>
                <li className="li">
                    <div className="form-field-row">
                        <label>Role</label>
                        <div className="select-field ">
                            <SelectInput
                                name="role_id"
                                label="Role"
                                value={user.role_id}
                                defaultOption="Select Role"
                                options={allRole}
                                onChange={onChange} 
                                error={errors.role_id}
                            />
                        </div>
                    </div>
                </li>
            </ul>
            <div className="sponsor-form-action">
                <input type="submit" 
                    disabled={saving} 
                    value={saving ? 'Saving...' : 'Save'}
                    className="btn blue"
                    onClick={onSave}
                />
                <Link className="btn btn-border" to="/users"> Cancel</Link>
            </div>
        </div>
  );
};

UserForm.propTypes = {
  user: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  saving: PropTypes.bool,
  errors: PropTypes.object
};

export default UserForm;
