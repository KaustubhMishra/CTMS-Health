import React from 'react';
import TextInput from '../common/TextInput';
import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';
import moment from 'moment';

const EditableCell = ({medicationTime,onRowUpdate,index}) => {
    return (
    	<div className="trial-field-row">
	        <div className="select-field">
	        	<label>Time:</label>
                <TimePicker
				    className="medicationTime"
				    showSecond={false}
				    id = {medicationTime.id}
				    name = {medicationTime.name}
				    onChange={ e=> onRowUpdate(e,index)}
				    defaultValue={ moment(medicationTime.value, 'HH:mm') }
				    value={ moment(medicationTime.value, 'HH:mm') }
				/>&nbsp;&nbsp;
				<span>HH:MM</span>
	        </div>
		</div> 
    );
};

EditableCell.propTypes = {
 
};

export default EditableCell;