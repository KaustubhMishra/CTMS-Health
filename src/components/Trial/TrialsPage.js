import React, {PropTypes} from 'react';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import {browserHistory, Link} from 'react-router';
import toastr from 'toastr';
import Header from '../common/Header';
import Leftmenu from '../common/Leftmenu';
import { Conditional } from 'react-conditional-render';
import * as RolesandPermission from '../common/RolesandPermission';
import * as getLoggedUserActions from '../../actions/getLoggedUserActions';
import * as sponsorsActions from '../../actions/sponsorActions';
import * as roleActions from '../../actions/roleActions';
import cookies from 'react-cookie';
import TrialList from './TrialList';
import * as trialActions from '../../actions/trialActions';
import Footer from '../common/Footer';
import {sponsorsFormattedForDropdown} from '../../selectors/selectors';
import {trialsFormattedForDropdown} from '../../selectors/selectors';
import {phasesFormattedForDropdown} from '../../selectors/selectors';
import {statusesFormattedForDropdown} from '../../selectors/selectors';
import {sponsorDSMBFormattedForDropdown} from '../../selectors/selectors';
import SelectInput from '../common/SelectInput';
import Pagination from "react-js-pagination";
import * as patientActions from '../../actions/patientActions';



let search = 
    {params: {
            "pageNumber": 1,
            "pageSize": 10,
            "sortBy": "createdAt",
            "sortOrder": "desc"
        }
    };

let phasePatientTrialId = "";
let UsertimeZone = '';

class TrialsPage extends React.Component {
  constructor(props, context) {
    super(props, context);
    
    search.params = {
      "pageNumber": 1,
      "pageSize": 10,
      "sortBy": "createdAt",
      "sortOrder": "desc"
    }

    this.state = { 
      trialData : '',
      sponsorId : '',
      trialId : '',
      phaseId : '',
      statusId : '',
      search: search
    }
    
    this.getLoggedInUserRoleName();
    
    this.handlePageChange = this.handlePageChange.bind(this);

    this.selectTrial = this.selectTrial.bind(this);
    this.ConfirmDelete = this.ConfirmDelete.bind(this);
    this.ConfirmCompelete = this.ConfirmCompelete.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSponsorChange = this.onSponsorChange.bind(this);
    this.onsearchClick = this.onsearchClick.bind(this);
    this.ongetTrial = this.ongetTrial.bind(this);
    this.redirect = this.redirect.bind(this);
    /*this.props.patientActions.loadAllPatients();
    this.props.patientActions.loadPahsePatients(0);*/
  }

  getLoggedInUserRoleName() {
    $(document).ready(function(){
      let isOpen = false;
      $('.nav-icon').click(function(){
        if(isOpen == false) {
          $("#container").removeClass("nav-is-close");
          $("#container").addClass("nav-is-open");
          isOpen = true;
        }
        else {
          $("#container").removeClass("nav-is-open");
          $("#container").addClass("nav-is-close");
          isOpen = false;
        }
      });
      $(window).on('beforeunload', function() {
        $(window).scrollTop(0); 
      });
    });
    
    let trialStatusId = cookies.load('trial_statusId');
    let trialPhase = cookies.load('trial_phase');
    let trialSponsor = cookies.load('trial_sponsor');
    let trialId = cookies.load('trial_Id');

    if(trialStatusId && trialPhase && trialSponsor && trialId)
    {
      this.getTrialonDashboard();
    } else {
      this.props.roleActions.loadUsersRolesName().then(() =>  this.onPageLoad());  
    }
    
  }

  onPageLoad(){

    let statusparam = cookies.load('trial_status');
    let sponsorId = cookies.load('trial_sponsor');
    let trialId = cookies.load('trial_Id');
    let phaseId1 = cookies.load('trial_phase');
    let trialStatus =cookies.load('trial_statusId');
    if(statusparam)
    {
      if(this.props.userRoleName.name == 'DSMB') {
        this.state.statusId = statusparam;
        cookies.remove('trial_status', { path: '/' });
        this.getTrialForSelectedUser(this.state);
      } 
      else if(this.props.userRoleName.name == 'CRO Coordinator') {
        this.state.statusId = statusparam;
        cookies.remove('trial_status', { path: '/' });
        this.getTrialForSelectedUser(this.state);
      }
      else {
        this.state.statusId = statusparam;
        cookies.remove('trial_status', { path: '/' });
        this.getActiveTrial(this.state);  
      }
    }
    else if(phaseId1 || trialStatus || sponsorId || trialId) {
      if(this.props.userRoleName.name == 'DSMB') {
        this.state.phaseId = phaseId1;
        this.state.statusId = trialStatus;
        this.state.sponsorId = sponsorId;
        this.state.trialId = trialId;
        cookies.remove('trial_phase', { path: '/' });
        cookies.remove('trial_statusId', { path: '/' });
        cookies.remove('trial_sponsor', { path: '/' });
        cookies.remove('trial_Id', { path: '/' });
        this.props.actions.loadTrialByUserId(this.state);
        return this.setState(this.state);
      } else if(this.props.userRoleName.name == 'CRO Coordinator'){
        this.state.phaseId = phaseId1;
        this.state.statusId = trialStatus;
        this.state.sponsorId = sponsorId;
        this.state.trialId = trialId;
        cookies.remove('trial_phase', { path: '/' });
        cookies.remove('trial_statusId', { path: '/' });
        cookies.remove('trial_sponsor', { path: '/' });
        cookies.remove('trial_Id', { path: '/' });
        this.props.actions.loadTrialByCROId(this.state);
        return this.setState(this.state);
      } else if(this.props.userRoleName.name == 'CRO') {
        this.state.phaseId = phaseId1;
        this.state.statusId = trialStatus;
        this.state.sponsorId = sponsorId;
        this.state.trialId = trialId;
        cookies.remove('trial_phase', { path: '/' });
        cookies.remove('trial_statusId', { path: '/' });
        cookies.remove('trial_sponsor', { path: '/' });
        cookies.remove('trial_Id', { path: '/' });
        this.getAllTrialList(this.state);
      }
    }
    else {
      this.getTrialForSelectedUser();
    }   
  }

  getTrialonDashboard(){
    let trialStatusId = cookies.load('trial_statusId');
    let trialPhase = cookies.load('trial_phase');
    let trialSponsor = cookies.load('trial_sponsor');
    let trialId = cookies.load('trial_Id');

    /*if(trialStatusId && trialPhase && trialSponsor && trialId)
    {*/
      this.state.statusId = trialStatusId;
      this.state.sponsorId = trialSponsor;
      this.state.phaseId = trialPhase;
      this.state.trialId = trialId;

      cookies.remove('trial_statusId', { path: '/' });
      cookies.remove('trial_phase', { path: '/' });
      cookies.remove('trial_sponsor', { path: '/' });
      cookies.remove('trial_Id', { path: '/' });
      this.getAllTrialList(this.state);
    //}
    /*else if(this.props.userRoleName.name == 'CRO') {
      this.getAllTrialList(this.state);
    }*/
    //this.getTrialForSelectedUser();  
  };


  handlePageChange(pageNumber) {
    this.setState({activePage: pageNumber});
    this.state.search.params.pageNumber = pageNumber;
    this.getAllTrialList(this.state);    
  }

  getAllTrialList(search) {
    this.props.actions.loadTrials(search);
  }

  getAllTrialListCRO(search) {
    this.props.actions.loadTrials(search);
  }

  getActiveTrial(search) {
    this.props.actions.loadActiveTrials(search);
  }

  
  ongetTrial(trialId){

    if(trialId)
      {
        /*this.props.patientActions.loadPahsePatients(trialId);
        this.props.actions.fetchDataById(trialId)
        .then(() => */
          browserHistory.push('/trial/' + trialId)
       /* )
        .catch(error => {
          toastr.error(error);
          this.setState({saving: false});
        });*/
      }
      else {
        return false;
      }

  }

  onsearchClick(event){
    var sponsorId = this.state.sponsorId;
    var trialId = this.state.trialId;
    var phaseId1 = this.state.phaseId;
    var trialStatus = this.state.statusId;
    this.state.search.params.pageNumber = 1;
    if(phaseId1 || trialStatus || sponsorId || trialId) {
      if(this.props.userRoleName.name == 'DSMB') {
        this.props.actions.loadTrialByUserId(this.state);
        return this.setState(this.state);
      } else if(this.props.userRoleName.name == 'CRO Coordinator'){
        this.state.phaseId = phaseId1;
        this.state.statusId = trialStatus;
        this.state.sponsorId = sponsorId;
        this.state.trialId = trialId;
        cookies.remove('trial_phase', { path: '/' });
        cookies.remove('trial_statusId', { path: '/' });
        cookies.remove('trial_sponsor', { path: '/' });
        cookies.remove('trial_Id', { path: '/' });
        this.props.actions.loadTrialByCROId(this.state);
        return this.setState(this.state);
      } else if(this.props.userRoleName.name == 'CRO') {
        this.state.phaseId = phaseId1;
        this.state.statusId = trialStatus;
        this.state.sponsorId = sponsorId;
        this.state.trialId = trialId;
        cookies.remove('trial_phase', { path: '/' });
        cookies.remove('trial_statusId', { path: '/' });
        cookies.remove('trial_sponsor', { path: '/' });
        cookies.remove('trial_Id', { path: '/' });
        this.getAllTrialList(this.state);
        return this.setState(this.state);
      }
    }
    /*if(this.props.userRoleName.name == 'DSMB') {
      this.state.search.params = {
        "pageNumber": 1,
        "pageSize": 10,
        "sortBy": "createdAt",
        "sortOrder": "desc"
      }
      this.props.actions.loadTrialByUserId(this.state);
    } else if(this.props.userRoleName.name == 'CRO Coordinator') {
      this.state.search.params = {
        "pageNumber": 1,
        "pageSize": 10,
        "sortBy": "createdAt",
        "sortOrder": "desc"
      }
      this.props.actions.loadTrialByCROId(this.state);
    } 
    else {
      this.state.search.params = {
        "pageNumber": 1,
        "pageSize": 10,
        "sortBy": "createdAt",
        "sortOrder": "desc"
      }
      this.props.actions.loadTrials(this.state)
    }*/
  }

  onSponsorChange(event){
    this.state.sponsorId = event.target.value;
    this.state.trialId ='';
    
    if(this.props.userRoleName.name == 'DSMB') {
      this.props.actions.loadtrialsSelectListDSMB(this.state);
      return this.setState(this.state);
    } else if(this.props.userRoleName.name == 'CRO Coordinator'){
      this.props.actions.loadtrialsSelectListCRO(this.state);
      return this.setState(this.state);
    } else {
      this.props.actions.loadtrialsSelectList(this.state);
      return this.setState(this.state);
    }
  }

  onChange(event){
    const field = event.target.name;
    let state = this.state;
    state[field] = event.target.value;
    return this.setState(state);
  }

  ConfirmDelete(){
     if(this.state.trialData)
      {
        this.props.actions.deleteTrial(this.state.trialData)
        .then(() => 
          this.redirect(),
          toastr.success('Trial Deleted Successfully.')
        )
        .catch(error => {
          toastr.error(error);
          this.setState({saving: false});
        });
      }
      else {
        return false;
      }

  }

  getTrialForSelectedUser() {
    if(this.props.userRoleName.name == 'DSMB') {
      this.props.actions.loadTrialByUserId(this.state);
      this.props.sponsorsActions.loadSponsorsListForDSMB();
    } else if(this.props.userRoleName.name == 'CRO Coordinator') {
      this.props.actions.loadTrialByCROId(this.state);
      this.props.sponsorsActions.loadSponsorsListForCRO();
    }
    else if(this.props.userRoleName.name == 'CRO') {
      this.getAllTrialList(this.state);
      this.props.sponsorsActions.loadSponsorsList();
    }
  }

  ConfirmCompelete(){
     if(this.state.trialData)
      {
        this.props.actions.compeleteTrial(this.state.trialData)
        .then(() => 
          this.redirect(),
          toastr.success('Trial Completed Successfully.')
        )
        .catch(error => {
          toastr.error(error);
          this.setState({saving: false});
        });
      }
      else {
        return false;
      }

  }

  redirect() {
    
    this.state = { 
      trialData : '',
      sponsorId : '',
      trialId : '',
      phaseId : '',
      statusId : '',
      search: {params: {
            "pageNumber": 1,
            "pageSize": 10,
            "sortBy": "createdAt",
            "sortOrder": "desc"
        }
      }
    }
    if(this.props.userRoleName.name == 'CRO Coordinator') {
      this.props.actions.loadTrialByCROId(this.state);
      this.setState({saving: false});
    } else if(this.props.userRoleName.name == 'DSMB') {
      this.props.actions.loadTrialByUserId(this.state);
      this.setState({saving: false});
    }
    else {
      /*this.props.patientActions.loadAllPatients();
      this.props.patientActions.loadPahsePatients(0);*/
      this.props.actions.loadtrialsSelectList(this.state)
      this.getAllTrialList(this.state);
      this.setState({saving: false});
    }    
  }

  selectTrial(trial) {
    this.state.trialData = trial;
  }

  render() {
     return (
     <div>
        <Header/>
        <div className="modal fade" id="deleteModal" role="dialog">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal">&times;</button>
                  <h4 className="modal-title">Delete Trial</h4>
                </div>
                <div className="modal-body">
                  <p>Are You Sure You Want To Delete Trial ?</p>
                </div>
                <div className="modal-footer">
                  <div className="btn-group">
                     <button type="button" className="btn blue set-width" data-dismiss="modal" onClick={this.ConfirmDelete} >Delete </button> 
                     <button type="button" className="btn blue set-width" data-dismiss="modal">Close</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
         <div className="modal fade" id="compeleteModal" role="dialog">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal">&times;</button>
                  <h4 className="modal-title">Complete Trial</h4>
                </div>
                <div className="modal-body">
                  <p>Are You Sure You Want To Complete Trial ?</p>
                </div>
                <div className="modal-footer">
                  <div className="btn-group">
                     <button type="button" className="btn blue set-width" onClick={this.ConfirmCompelete} data-dismiss="modal" >Complete </button> 
                     <button type="button" className="btn blue set-width" data-dismiss="modal">Close</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        <section id="container" className="container-wrap">
          <Leftmenu/>
              <section className="container-fluid">
                    <section className="page-title">
                      <div className="pull-left">
                        <h1>Trial</h1>
                        <div className="breadcrumbs">
                          <span>Trial</span><a>Active Trials</a>
                        </div>
                      </div>
                      <div className="pull-right right-head">
                        <Conditional condition={RolesandPermission.permissionCheck("TRAIL_ADD_UPDATE") ==true}>
                          <Link className="btn btn-border pull-left" to="/trial">Add Trial <i className="fa fa-plus-circle"></i> 
                          </Link>
                        </Conditional>                       
                      </div>
                    </section>
                    <div className="db-search-wrap">
                      <div className="db-search-form">
                        <ul className="at-list">
                          <li>
                              <SelectInput
                                name="sponsorId"
                                value={this.state.sponsorId}
                                defaultOption="Select Sponsor"
                                options={this.props.sponsors}
                                onChange={this.onSponsorChange} 
                              />
                          </li>
                          <li>
                            <SelectInput
                                name="trialId"
                                value={this.state.trialId}
                                defaultOption="Select Trial"
                                options={this.props.trialsSelectList}
                                onChange={this.onChange} 
                              />
                          </li>
                          <li>
                            <SelectInput
                                name="phaseId"
                                value={this.state.phaseId}
                                defaultOption="Select Phase"
                                options={this.props.phaseLists}
                                onChange={this.onChange} 
                              />
                          </li>
                          <li>
                             <SelectInput
                                name="statusId"
                                value={this.state.statusId}
                                defaultOption="Select Status"
                                options={this.props.statusLists}
                                onChange={this.onChange} 
                              />
                          </li>
                          <li>
                            <input className="btn blue set-width pull-left" id="search" type="submit" value="Search" onClick={this.onsearchClick}/>
                            <input className="btn blue set-width" id="reset" type="submit" value="Reset" onClick={this.redirect}/>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <section className="box-trials">
                              <div className="head"><h2>Active Trials</h2></div>
                             <TrialList 
                                trials={this.props.trials}
                                userRoleName={this.props.userRoleName} 
                                timeZone = {UsertimeZone}
                                onDeleteTrial={this.selectTrial} 
                                onCompeletedTrial={this.selectTrial}
                                ongetTrial = { this.ongetTrial }
                              />

                              <div className="pull-right">
                                <Conditional condition={this.props.trialCount > 10}>
                                  <Pagination
                                    activePage={this.state.search.params.pageNumber}
                                    itemsCountPerPage={this.state.search.params.pageSize}
                                    totalItemsCount={this.props.trialCount}
                                    pageRangeDisplayed={3}
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


TrialsPage.propTypes = {
  actions: PropTypes.object.isRequired,
  trials: PropTypes.array.isRequired,
  trialsSelectList: PropTypes.array.isRequired,
  sponsors: PropTypes.array.isRequired,
  phaseLists: PropTypes.array.isRequired,
  statusLists: PropTypes.array.isRequired
};


function mapStateToProps(state, ownProps) {
  UsertimeZone = state.userData.timezone;
  
  let phaseList = [
    {"id" : 1,
     "name": 'First Phase'
    },
     {"id" : 2,
     "name": 'Second Phase'
    }, {"id" : 3,
     "name": 'Third Phase'
    }, {"id" : 4,
     "name": 'Fourth Phase'
    },
  ]

  let statusList = [
    {"id" : 1,
     "name": 'On Time'
    },
    {"id" : 2,
     "name": 'Completed'
    },
    {"id" : 3,
     "name": 'Delayed'
    }
  ]

  
  return {
    userRoleName: state.UserRoleName,
    trials: state.trials,
    trialCount: !_.isUndefined(state.trials[0]) ? state.trials[0].count : state.trials, 
    sponsors: sponsorsFormattedForDropdown(state.sponsorsSelectList),
    trialsSelectList: trialsFormattedForDropdown(state.trialsSelectList),
    phaseLists: phasesFormattedForDropdown(phaseList),
    statusLists: statusesFormattedForDropdown(statusList),
    timeZone : UsertimeZone
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(trialActions, dispatch),
    getLoggedUseractions: bindActionCreators(getLoggedUserActions, dispatch),
    sponsorsActions: bindActionCreators(sponsorsActions, dispatch),
    roleActions: bindActionCreators(roleActions, dispatch),
    patientActions: bindActionCreators(patientActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TrialsPage);
