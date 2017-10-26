import React, {PropTypes} from 'react';
import TextInput from '../common/TextInput';
import TextArea from '../common/TextArea';
import SelectInput from '../common/SelectInput';
import SelectMultipleInput from '../common/SelectMultipleInput';
import {browserHistory, Link} from 'react-router';
import { Conditional } from 'react-conditional-render';

const DeviceForm = ({device, label, onSave, onChange, imagePreviewUrl, showimagePreview,fileEvent, saving, deviceGroupData, errors}) => {
    console.log(showimagePreview);
    return (
        <div className="sponsor-form">
            <ul className="form-list">
                <li className="li">
                    <div className="form-field-row">
                        <div className="input-field">
                            <TextInput
                                name="name"
                                label="Name"
                                value={device.name}
                                onChange={onChange}
                                error={errors.name}
                            />
                        </div>
                    </div>
                </li>
                <li className="li">
                    <div className="form-field-row">
                        <div className="input-field">
                            <TextInput
                                name="manufacturer"
                                label="Manufacturer"
                                value={device.manufacturer}
                                onChange={onChange}
                                error={errors.manufacturer}
                            />
                        </div>
                    </div>
                </li>
                <li className="li">
                    <div className="form-field-row">
                        <div className="input-field">
                            <TextInput
                                name="firmware"
                                label="Firmware"
                                value={device.firmware}
                                onChange={onChange}
                                error={errors.firmware}
                            />
                        </div>
                    </div>
                </li>
                <li className="li">
                    <div className="form-field-row">
                        <div className="input-field">
                            <TextInput
                                name="version"
                                label="Version"
                                value={device.version}
                                onChange={onChange}
                                error={errors.version}
                            />
                        </div>
                    </div>
                </li>
                <li className="li">
                    <div className="form-field-row">
                        <label>Device Group</label>
                        <div className="select-field">
                            <SelectInput
                                name="device_group_id"
                                value={device.device_group_id}
                                defaultOption="Select Device Group"
                                options={deviceGroupData}
                                onChange={onChange} 
                                error={errors.device_group_id}
                            />
                        </div>
                    </div>
                </li>
                <li>
                    <div className="form-field-row">
                        <div className="input-field">
                            <label>Choose File </label>
                            <input
                                type="file"
                                onChange={fileEvent}
                                className="form-control"
                            />
                            <div className="tooltip1"> 
                                <i className="fa fa-question-circle-o" aria-hidden="true" data-toggle="tooltip" title="png and jpg image supported!"></i>
                            </div>
                            <Conditional condition={showimagePreview == true}>
                            {imagePreviewUrl ? (
                                <img src={imagePreviewUrl} style={{width: 100 + 'px', height: 100 + 'px'}}/>
                            ) : (
                                <img src={'/upload/profilepicture/' + device.device_image}
                                style={{width: 100 + 'px', height: 100 + 'px'}}/>
                            )}
                            </Conditional>

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
                <Link className="btn btn-border" to="/deviceList"> Cancel</Link>
            </div>
        </div>
  );
};

DeviceForm.propTypes = {
  device: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  saving: PropTypes.bool,
  errors: PropTypes.object
};

export default DeviceForm;
