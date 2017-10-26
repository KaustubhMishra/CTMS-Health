import React, {PropTypes} from 'react';
import TextInput from '../common/TextInput';
import TextArea from '../common/TextArea';
import SelectInput from '../common/SelectInput';
import {browserHistory, Link} from 'react-router';
import { Conditional } from 'react-conditional-render';

const SponsorForm = ({sponsor, label, onSave, onChange, saving, errors, countryList, stateList, updateCountry, showStateTextbox, hideStateSelectbox}) => {
    console.log(sponsor);
    return (
        <div className="sponsor-form">
            <ul className="form-list">
                <li className="li">
                    <div className="form-field-row">
                        <label>Sponsor Company</label>
                        <div className="input-field">
                            <TextInput
                                name="sponsor_company"
                                value={sponsor.sponsor_company}
                                onChange={onChange}
                                error={errors.sponsor_company}
                            />
                        </div>
                    </div>
                </li>
                <li className="li">
                    <div className="form-field-row">
                        <label>Contact Name</label>
                        <div className="input-field">
                            <TextInput
                                name="contact_name"
                                value={sponsor.contact_name}
                                onChange={onChange}
                                error={errors.contact_name}
                            />
                        </div>
                    </div>
                </li>
                <li className="li">
                    <div className="form-field-row">
                        <label>Email</label>
                        <div className="input-field">
                            <TextInput
                                name="email_address"
                                value={sponsor.email_address}
                                onChange={onChange}
                                error={errors.email_address}
                            />
                        </div>
                    </div>
                </li>
                <li className="li">
                    <div className="form-field-row">
                        <label>Contact Number</label>
                        <div className="input-field">
                            <TextInput
                                name="contact_number"
                                value={sponsor.contact_number}
                                onChange={onChange}
                                error={errors.contact_number}
                            />
                        </div>
                    </div>
                </li>
                <li className="li">
                    <div className="form-field-row">
                        <label>Address 1</label>
                        <div className="textarea-field">
                            <TextArea
                                name="contact_address_1"
                                value={sponsor.contact_address_1}
                                onChange={onChange}
                                error={errors.contact_address_1}
                            />
                        </div>
                    </div>
                </li>
                <li className="li">
                    <div className="form-field-row">
                        <label>Address 2</label>
                        <div className="textarea-field">
                            <TextArea
                                name="contact_address_2"
                                value={sponsor.contact_address_2}
                                onChange={onChange}
                                error={errors.contact_address_2}
                            />
                        </div>
                    </div>
                </li>
                <li className="li">
                    <div className="form-field-row">
                        <label>Country</label>
                        <div className="select-field">
                            <SelectInput
                                name="country"
                                defaultOption="Select Country"
                                value={sponsor.country}
                                options={countryList}
                                onChange={updateCountry}
                                error={errors.country}
                            />
                        </div>
                    </div>
                </li>
                <Conditional condition={hideStateSelectbox}>
                    <li className="li">
                        <div className="form-field-row">
                            <label>State</label>
                            <div className="select-field">
                                <SelectInput
                                    name="state"
                                    defaultOption="Select State"
                                    value={sponsor.state}
                                    options={stateList}
                                    onChange={onChange}
                                    error={errors.state}
                                />
                            </div>
                        </div>
                    </li>
                </Conditional>
                <Conditional condition={showStateTextbox}>
                    <li className="li">
                        <div className="form-field-row">
                            <div className="input-field">
                                <TextInput
                                    name="state"
                                    label="State"
                                    value={sponsor.state}
                                    onChange={onChange}
                                    error={errors.state}
                                />
                            </div>
                        </div>
                    </li>
                </Conditional>
                <li className="li">
                    <div className="form-field-row">
                        <label>City</label>
                        <div className="input-field">
                            <TextInput
                                name="city"
                                value={sponsor.city}
                                onChange={onChange}
                                error={errors.city}
                            />
                        </div>
                    </div>
                </li>
                <li className="li">
                    <div className="form-field-row">
                        <label>Zip</label>
                        <div className="input-field">
                            <TextInput
                                name="zip"
                                value={sponsor.zip}
                                onChange={onChange}
                                error={errors.zip}
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
                <Link className="btn btn-border" to="/sponsors"> Cancel</Link>
            </div>
        </div>
  );
};

SponsorForm.propTypes = {
  sponsor: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  saving: PropTypes.bool,
  errors: PropTypes.object
};

export default SponsorForm;
