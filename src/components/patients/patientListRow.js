import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import * as sponsorActions from '../../actions/sponsorActions';
import { Conditional } from 'react-conditional-render';

const PatientListRow = ({patient, DeletePatient, isHideDelete,isPlaceboVisible, getPatientDetailGraph, isShowPatientLink}) => {
  return (
    <tr className="grey">
      <Conditional condition={isShowPatientLink}>
        <td onClick={() => 
          getPatientDetailGraph(
              patient.patients[0].id ? patient.patients[0].id : '',
              patient.patients[0].vital_dosage_statuses ? patient.patients[0].vital_dosage_statuses[0].trial_id : '',
              patient.patients[0].vital_dosage_statuses ? patient.patients[0].vital_dosage_statuses[0].phase_id : ''
              )
        } > 
        <a href="javascript:void(0)">{patient.firstname} {patient.lastname} </a>
        </td>
      </Conditional>
      <Conditional condition={!isHideDelete}>
        <td>{patient.firstname} {patient.lastname} </td>
      </Conditional>
      <td>{patient.patients[0].age}</td>
      <td>{patient.patients[0].gender}</td>
      <td>{patient.email}</td>
      <Conditional condition={isPlaceboVisible}>
      <td>
           <div className="checkbox-field">
              <input type="checkbox" disabled readonly checked = {patient.patients[0].placebo ? patient.patients[0].placebo : false}
                    id={ "patient" + patient.patient_id } className="css-checkbox"/>
              <label htmlFor={ "patient" + patient.patient_id } className="css-label">&nbsp;</label>
            </div>
      </td>
      </Conditional>
      <Conditional condition={!isHideDelete}>  
        <td>
          <button type="button" className="btn-btn-danger"
            onClick={() => DeletePatient(patient)}>
            <i className="fa fa-trash" aria-hidden="true"></i>
          </button>
        </td>
      </Conditional>
    </tr>
  );

};

PatientListRow.propTypes = {
  patient: PropTypes.object.isRequired
};

export default PatientListRow;
