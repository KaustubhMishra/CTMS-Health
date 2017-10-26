import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import TextInput from '../common/TextInput';
import TextArea from '../common/TextArea';
import SelectInput from '../common/SelectInput';

const PatientListRow = ({patient,phaseId,index,Phaseindex,onDeletePatient,getPatientDetail}) => {
  return (
    <tr>
      <td>{patient.firstname}</td>
      <td>{patient.lastname}</td>
      <td>{patient.email}</td>
      <td>{patient.patients[0].age}</td>
      <td>{patient.patients[0].gender}</td>
      <td>
        <button type="button" className="btn btn-primary btn-sm" 
                              onClick={() => onDeletePatient(patient,Phaseindex,index)}>Delete</button>
      </td>
    </tr>
  );

};

PatientListRow.propTypes = {
  patient: PropTypes.object.isRequired,
  onDeletePatient: PropTypes.func.isRequired,
  getPatientDetail: PropTypes.func.isRequired,
};

export default PatientListRow;

