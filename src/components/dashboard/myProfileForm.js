import React, {PropTypes} from 'react';
import TextInput from '../common/TextInput';
import TextArea from '../common/TextArea';
import SelectInput from '../common/SelectInput';
import {browserHistory, Link} from 'react-router';
import { Conditional } from 'react-conditional-render';

const MyProfileForm = ({user, label, onSave, onChange, saving, countryList, errors, updateCountry, stateList, showStateTextbox, hideStateSelectbox}) => {
    return (
      <div className="">
        <div className="profile-form-row">
          <div className="input-field">
            <TextInput
              name="firstname"
              type="text"
              label="First Name"
              value={user.firstname}
              onChange={onChange}
              error={errors.firstname}
              
            />
          </div>
        </div>
        <div className="profile-form-row">
          <div className="input-field">
            <TextInput
              name="lastname"
              type="text"
              label="Last Name"
              value={user.lastname}
              onChange={onChange}
              error={errors.lastname}
            />
          </div>
        </div>
        <div className="profile-form-row">
          <div className="input-field">
            <TextInput
              name="email"
              type="email"
              label="Email"
              value={user.email}
              disabled
            />
          </div>
        </div>
        <div className="profile-form-row">
          <label>Contact Address</label>    
          <div className="textarea-field pull-left">
            <TextArea
              name="contact_address"
              onChange={onChange}
              value={user.contact_address}
              error={errors.contact_address}
            />
          </div>
        </div>
        <div className="profile-form-row">    
          <div className="input-field">
            <TextInput
              name="phone"
              type="text"
              label="Contact Number"
              onChange={onChange}
              value={user.phone}
              error={errors.phone}
            />
          </div>
        </div>
        <div className="profile-form-row">
          <label>Country</label>
          <div className="select-field">
            <SelectInput
              name="country"
              defaultOption="Select Country"
              value={user.country}
              options={countryList}
              onChange={updateCountry}
              error={errors.country}
            />
          </div>
        </div>
        <Conditional condition={hideStateSelectbox}>
          <div className="profile-form-row">
            <label>State</label>
            <div className="select-field">
              <SelectInput
                name="state"
                defaultOption="Select State"
                value={user.state}
                options={stateList}
                onChange={onChange}
                error={errors.state}
              />
            </div>
          </div>
        </Conditional>
        <Conditional condition={showStateTextbox}>
          <div className="profile-form-row">
            <div className="input-field ">
              <TextInput
                name="state"
                label="State"
                value={user.state}
                onChange={onChange}
                error={errors.state}
              />
            </div>
          </div>
        </Conditional>
        <div className="profile-form-row">
          <div className="input-field ">
            <TextInput
              name="city"
              label="City"
              value={user.city}
              onChange={onChange}
              error={errors.city}
            />
          </div>
        </div>
        <div className="profile-form-row">
          <div className="input-field ">
            <TextInput
              name="fax"
              label="Fax"
              value={user.fax}
              onChange={onChange}
              error={errors.fax}
            />
          </div>
        </div>
        <div className="profile-form-row">
          <div className="profile-form-action">
              <input type="submit" 
                  disabled={saving} 
                  value={saving ? 'Saving...' : 'Save'}
                  className="btn blue"
                  onClick={onSave}
              />
              <Link className="btn btn-border" to="/dashboard"> Cancel</Link>
          </div>
        </div>
      </div>
    );
  };

MyProfileForm.propTypes = {
  user: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  saving: PropTypes.bool,
  errors: PropTypes.object
};

export default MyProfileForm;
