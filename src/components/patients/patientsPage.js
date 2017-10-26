import React from 'react';
import { Link , browserHistory} from 'react-router';
import {bindActionCreators} from 'redux';
import Header from '../common/Header';
import Leftmenu from '../common/Leftmenu';
import Footer from '../common/Footer';
import {connect} from 'react-redux';
import PatientList from'./patientListPage';
import Pagination from "react-js-pagination";
import * as patientActions from '../../actions/patientActions';
import * as roleActions from '../../actions/roleActions';
import toastr from 'toastr';
import { Conditional } from 'react-conditional-render';
import cookies from 'react-cookie';

let search = 
    {params: {
            "pageNumber": 1,
            "pageSize": 10,
            "sortBy": "createdAt",
            "sortOrder": "desc"
        }
    };
let trialId ='';
let isHideDelete = false;
let isShowPatientLink = false;
let isPlaceboVisible = false;


class PatientPage extends React.Component {
      constructor(props, context) {
        super(props, context);

        this.state ={
          search:search
        }
        isHideDelete = false;
        isShowPatientLink = false;
        isPlaceboVisible = false;

        this.getLoggedInUserRoleName();
        this.getAllUserList(search);
        //this.props.actions.loadPahsePatients();
        //this.props.actions.loadAllPatients();
        this.deletePatient = this.deletePatient.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.getPatientDetailGraph = this.getPatientDetailGraph.bind(this);
      }

      getLoggedInUserRoleName() {
        let that = this;
        this.props.roleActions.loadUsersRolesName().then(function(){
            console.log(that.props.userRoleName);
            if(that.props.userRoleName.name == 'DSMB'){
              isPlaceboVisible = true;
            }  
        });
        
      }

    handlePageChange(pageNumber) {
      this.setState({activePage: pageNumber});
      this.state.search.params.pageNumber = pageNumber;

      this.getAllUserList(this.state.search);
      
    }

    getAllUserList(search) {

      if((this.props.location.pathname).indexOf('falloutpatientList') !== -1){
        isHideDelete = true;
        isShowPatientLink=  true;
        this.props.actions.loadFalloutPatients(trialId);
      }
      else
      {
          if(trialId)
          {
            isHideDelete = true;
            isShowPatientLink=  true;
            this.props.actions.loadTrialsPatient(trialId);
          } else {
            this.props.actions.loadPatients(search);
          }
      }
      

      
    }

    deletePatient(patient) {
      if(confirm("Are you sure you want to delete Patient ?")){
        if(patient)
        {
          this.props.actions.deletePatientData(patient)
          .then(() => this.redirect())
          .catch(error => {
            toastr.error(error);
            this.setState({saving: false});
          });
        }
        else {
          return false;
        }
      }
      else {
        return false;
      }
    }

    redirect() {
      let data = {
        params: {
          "pageNumber": 1,
          "pageSize": 10
        }
      };

     /* this.props.actions.loadPahsePatients();
      this.props.actions.loadAllPatients();*/
      this.getAllUserList(data);
      this.setState({saving: false});
      browserHistory.push('/patientList');
      toastr.success('Patient Deleted.');
    }

    getPatientDetailGraph(patientId,newtrialId,newPhaseId) {
      let phaseId = cookies.load('patientPhaseId');
     
      
      //cookies.remove('patientPhaseId', { path: '/' });
      if((this.props.location.pathname).indexOf('falloutpatientList') !== -1){
        cookies.save('patient_trial_id',  newtrialId, {path: '/' });
        cookies.save('patient_phase_id',  newPhaseId, {path: '/' });
      }
      else
      {
        cookies.save('patient_trial_id',  trialId, {path: '/' });
        cookies.save('patient_phase_id',  phaseId, {path: '/' });
      }
      
      
      cookies.save('patient_id',  patientId, {path: '/' });
      browserHistory.push('/patientDetail/')
    }


    render() {
        return (
      <div>
            <Header/>
            <section id="container" className="container-wrap">
                <Leftmenu/>
                <section className="container-fluid">
                  <section className="page-title">
                    <div className="pull-left">
                      <h1>Patient</h1>
                      <div className="breadcrumbs">
                       <span>Patient</span><a>Patient List</a>
                      </div>
                    </div>
                  </section>
                  <section className="box-trials">
                    <div className="head">
                      <h2>Patient List</h2>
                    </div>
                    <div className="pt-data-table">
                      <PatientList patient={this.props.patient} DeletePatient={this.deletePatient} isHideDelete={isHideDelete} isShowPatientLink={isShowPatientLink} isPlaceboVisible = {isPlaceboVisible} getPatientDetailGraph={this.getPatientDetailGraph}/>
                    </div>
                    <div className="pull-right">
                      <Conditional condition={this.props.patientCount > 10}>
                        <Pagination
                          activePage={this.state.search.params.pageNumber}
                          itemsCountPerPage={this.state.search.params.pageSize}
                          totalItemsCount={this.props.patientCount}
                          pageRangeDisplayed={5}
                          onChange={this.handlePageChange}
                        />
                      </Conditional>
                    </div>
                  </section>
                </section>
                <Footer/>
              </section>
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
  trialId = ownProps.params.id;
  if(trialId) {
    state.Patients.count = state.falloutPatients.count
  }
  return {
    patient: (ownProps.location.pathname).indexOf('falloutpatientList') !== -1 ? !_.isUndefined(state.falloutPatients.data) ? state.falloutPatients.data : state.falloutPatients : !_.isUndefined(state.Patients.rows) ? state.Patients.rows : state.Patients,
    patientCount: !_.isUndefined(state.Patients.count) ? state.Patients.count : state.Patients.count,
    userRoleName: state.UserRoleName        
  };
 
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(patientActions, dispatch),
    roleActions: bindActionCreators(roleActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientPage);
