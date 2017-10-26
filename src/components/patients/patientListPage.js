import React, {PropTypes} from 'react';
import PatientListRow from './patientListRow';
import { Conditional } from 'react-conditional-render';

const PatientList = ({patient, DeletePatient, isHideDelete,isPlaceboVisible, getPatientDetailGraph, isShowPatientLink}) => {
  return (
    <table id="example" className="table table-striped table-bordered" cellspacing="0" width="100%">
      <thead>
      <tr>
        <th>Name</th>
        <th>Age</th>
        <th>Gender</th>
        <th>Email</th>
        <Conditional condition={isPlaceboVisible}>
          <th>Placebo</th>
        </Conditional>
        <Conditional condition={!isHideDelete}>
          <th>Action</th>
        </Conditional>
      </tr>
      </thead>
      <tbody>
      {patient.map(patient =>
        <PatientListRow key={patient.id} patient={patient} DeletePatient={DeletePatient} isHideDelete={isHideDelete} isPlaceboVisible = {isPlaceboVisible} getPatientDetailGraph={getPatientDetailGraph} isShowPatientLink ={isShowPatientLink} />
      )}
      {patient.length == 0 &&
          <tr><td className="valign-center" colSpan="6">Data not found</td> </tr>} 
      </tbody>
    </table>
  );
};

PatientList.propTypes = {
  patient: PropTypes.array.isRequired
};

export default PatientList;
