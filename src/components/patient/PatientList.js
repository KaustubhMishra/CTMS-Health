import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import TextInput from '../common/TextInput';
import TextArea from '../common/TextArea';
import SelectInput from '../common/SelectInput';
import PatientListRow from '../patient/PatientListRow';
import PatientModal from '../patient/PatientModal';



const PatientList = ({Phaseindex,allPatients,onPatientChanged,onAddPatients,onCancelPatients,phaseInfo,onDeletePatient,
                        getPatientDetail,handlePatientPageChange,patientCount,OpenModal}) => {
  return (
    <div>
        <div className="overflow">
         <a className="js-open-modal btn btn-border set-width mb-10 btn-sm" 
              onClick={() => OpenModal('AddPatient' + Phaseindex ,Phaseindex)}>
             <i className="fa fa-plus mr-5"></i>Add More Patients
         </a> 
        </div>
        
        <div className="modal fade" id={ "AddPatient" + Phaseindex } role="dialog" data-cache="false">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title">Add Patients</h4>
                </div>
                <div className="modal-body PatientListPopUp">
                   <PatientModal allPatients = {allPatients}
                                 Phaseindex = {Phaseindex}
                                 onPatientChanged = {onPatientChanged}/>
                
                </div>
                <div className="modal-footer">
                  <div className="btn-group">
                    <input className="btn blue set-width js-modal-close" 
                            data-dismiss="modal" id="Save" 
                            value="Save" type="submit"
                          onClick={() => onAddPatients(Phaseindex)}
                    />
                    <input className="btn blue set-width js-modal-close" id="Cancel" 
                          data-dismiss="modal" value="Cancel" type="submit"
                          onClick={() => onCancelPatients('AddPatient' + Phaseindex ,Phaseindex)}/>
                  </div>
                </div>
              </div>
            </div>
    </div>

        
     <div className="pt-data-table">
        <table id="grdPatient" className="table table-striped table-bordered" width="100%" cellspacing="0">
            <thead>
                <tr>
                     <th>First Name</th>
                     <th>Last Name</th> 
                     <th>E-mail</th> 
                      <th>Age</th> 
                      <th>Gender</th>
                      <th>Delete</th>
                </tr>
            </thead>
            <tbody>
                     {
                        phaseInfo.patient.map((PatientData, index) =>
                              <PatientListRow key={index} 
                                  patient={PatientData} 
                                  Phaseindex={Phaseindex}
                                  index={index} 
                                  phaseId = {phaseInfo.id}
                                  onDeletePatient = {onDeletePatient}
                                  getPatientDetail = {getPatientDetail}
                              />
                        )
                    }
                    
            </tbody>
        </table>
     </div> 
   </div>   
  );
};

PatientList.propTypes = {
    onPatientChanged: PropTypes.func.isRequired,
    onAddPatients: PropTypes.func.isRequired,
    onCancelPatients: PropTypes.func.isRequired,
};

export default PatientList;