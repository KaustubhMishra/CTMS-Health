import React , { Component } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Header from '../common/Header';
import Footer from '../common/Footer';
import Leftmenu from '../common/Leftmenu';
import * as trialActions from '../../actions/trialActions';
import * as notificationActions from '../../actions/notificationActions';
import * as roleActions from '../../actions/roleActions';
import * as sponsorsActions from '../../actions/sponsorActions';
import * as dsmbActions from '../../actions/dsmbActions';
import * as patientActions from '../../actions/patientActions';
import cookies from 'react-cookie';
import { Router, Route, Link, browserHistory, IndexRoute  } from 'react-router';
import SelectInput from '../common/SelectInput';
import {sponsorsFormattedForDropdown} from '../../selectors/selectors';
import {trialsFormattedForDropdown} from '../../selectors/selectors';
import {phasesFormattedForDropdown} from '../../selectors/selectors';
import {statusesFormattedForDropdown} from '../../selectors/selectors';
import { Conditional } from 'react-conditional-render';
import toastr from 'toastr';
import * as UTCtoUser from '../common/generalFunctions';

let search = {
  params: {
    "pageNumber": 1,
    "pageSize": 10,
    "sortBy": "createdAt",
    "sortOrder": "desc"
  }
};
let UsertimeZone = '';

class Profile extends React.Component {

  constructor(props, context) {
    super(props, context);
    
    search.params = {
      "pageNumber": 1,
      "pageSize": 10,
      "sortBy": "createdAt",
      "sortOrder": "desc"
    }

    
    this.participantCountResult = '';
    this.state = { 
      trialData : '',
      sponsorId : '',
      trialId : '',
      phaseId : '',
      statusId : '',
      search: search
    };

    this.onSponsorChange = this.onSponsorChange.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onsearchClick = this.onsearchClick.bind(this);
    this.redirect = this.redirect.bind(this);
    this.getfallOutPatient =  this.getfallOutPatient.bind(this);
    this.getEnrolledPatientList =  this.getEnrolledPatientList.bind(this);
    this.getPatientDetailGraph = this.getPatientDetailGraph.bind(this);
    this.getNotification();
    this.getLoggedInUserRoleName();
  }  
  componentWillMount() {
    $(document).ready(function(){
      $('[data-toggle="tooltip"]').tooltip();
      $(window).on('beforeunload', function() {
        $(window).scrollTop(0); 
      });
    });
  }
  
  
  getPatientDetailGraph(patientId,trialId,PhaseId) {
    console.log('Call Patient Graph..........');
        cookies.save('patient_trial_id',  trialId, {path: '/' });
        cookies.save('patient_phase_id',  PhaseId, {path: '/' });
        cookies.save('patient_id',  patientId, {path: '/' });
      browserHistory.push('/patientDetail/')
    }

  getLoggedInUserRoleName() {
    this.props.roleActions.loadUsersRolesName().then(()=>this.getTrial()).then(() =>  this.getTrialstatus());
  }

  getNotification() {
    if(this.props.userRoleName.name == 'DSMB' || this.props.userRoleName.name == 'CRO Coordinator') {
      this.props.notification.loadNotification();
    }
    else {
      console.log('CRO ...........');
      this.props.notification.loadNotificationCRO();
    }
    
  }

  getfallOutPatient(){
     if(this.props.falloutPatientCount == 0) {

    } else {
      browserHistory.push('/falloutpatientList/0');    
    }
  }

  getEnrolledPatientList(){
    if(this.props.trialMetrics.participantCountResult == 0) {

    } else {
      browserHistory.push('/patientTrialList');    
    }
  }

  getTrialstatus() {
    
    this.props.patientActions.loadFalloutPatients(0);

    if(this.props.userRoleName.name == 'CRO') {
      this.props.actions.loadTrialsMetrics();
      this.props.dsmbActions.loadActiveDsmbs();
      this.props.actions.loadTrialsPieChartStatus().then(() => this.OnPageLoad())
      .catch(error => {
        toastr.error(error);
        this.setState({saving: false});
      });  
    } else if(this.props.userRoleName.name == 'DSMB') {
      this.props.actions.loadTrialsMetricsDSMB();
      this.props.dsmbActions.loadActiveDsmbs();
      this.props.actions.loadTrialsPieChartStatusDSMB().then(() => this.OnPageLoad())
      .catch(error => {
        toastr.error(error);
        this.setState({saving: false});
      });
    } else if(this.props.userRoleName.name == 'CRO Coordinator') {
      this.props.actions.loadTrialsMetricsCRO();
      this.props.actions.loadTrialsPieChartStatusCoordinator().then(() => this.OnPageLoad())
      .catch(error => {
        toastr.error(error);
        this.setState({saving: false});
      });
    }
  }

  getTrial() {
    if(this.props.userRoleName.name == 'CRO') {
      this.props.actions.loadTrialsStatus().then(() =>  this.OnPageLoadBarChart())
      .catch(error => {
        //toastr.error(error);
        this.setState({saving: false});
      });
      this.props.sponsorsActions.loadSponsorsList();  
    } else if(this.props.userRoleName.name == 'DSMB') {
      this.props.actions.loadTrialsStatusDSMB().then(() =>  this.OnPageLoadBarChart())
      .catch(error => {
        //toastr.error(error);
        this.setState({saving: false});
      });
      this.props.sponsorsActions.loadSponsorsListForDSMB();
    } else if(this.props.userRoleName.name == 'CRO Coordinator') {
      this.props.actions.loadTrialsStatusCoordinator().then(() =>  this.OnPageLoadBarChart())
      .catch(error => {
        //toastr.error(error);
        this.setState({saving: false});
      });
      this.props.sponsorsActions.loadSponsorsListForCRO();
    }
    
  }

  OnPageLoad() {
    google.charts.setOnLoadCallback(drawChart);
    let onTime = this.props.piechartStatus.onTimeCount;
    let onDelayed = this.props.piechartStatus.onDelayedCount;
    
    function drawChart() {
      
      if(onTime || onDelayed ) {

        var total = parseInt(onTime) + parseInt(onDelayed);
        var onTimePercent = (onTime * 100) / total;
        var onDelayedPercent = (onDelayed * 100) / total;

        var datatableArray = [];
        datatableArray[0] = ['Trial', '','id'];

        if((onTimePercent - Math.floor(onTimePercent)) == 0.5) {
          datatableArray[1] = [onTime+' On Time', onTime,1];
          datatableArray[2] = [onDelayed+' Delayed', onDelayed,3];
          
        } else {
          onTimePercent = Math.round(onTimePercent);
          onDelayedPercent = Math.round(onDelayedPercent);
          
          datatableArray[1] = [onTime+' On Time', onTimePercent,1];
          datatableArray[2] = [onDelayed+' Delayed', onDelayedPercent,3];
        }
      

        var data = google.visualization.arrayToDataTable(datatableArray);


        var options = {
          pieHole: 0.4,
          colors: ['#83CE7E' , '#EAC945'],
          legend: {position: 'bottom'},
          tooltip: {text : 'percentage'}        
        };
        
          
        var chart = new google.visualization.PieChart(document.getElementById('donutchart'));
        chart.draw(data, options);
        
        function selectHandler() {
          var selectedItem = chart.getSelection()[0];
          if (selectedItem) {
            var statusId = data.getValue(selectedItem.row, 2);
            
            cookies.save('trial_status',  statusId, {path: '/' });
            browserHistory.push('trials')
          }
        }
        google.visualization.events.addListener(chart, 'select', selectHandler);    
        chart.draw(data, options);

      } else {

        document.getElementById("donutchart").innerHTML = "No Data Found";

      }
      
    }
  }

  OnPageLoadBarChart() {
         
    this.status = this.props.trialStatus.length;
    
    let barchartheight = 100 * (parseInt(this.status)/4);
    let chartareaheight = ( 80 + ( (barchartheight - 300) / 46.875 ) );

    google.charts.load('current', {
      callback: function () {
          var chartWidth = $(".db-box").width();
          console.log(chartWidth);
          drawStuff(chartWidth);
      },
      packages:['corechart']
    });
   // google.charts.setOnLoadCallback(drawStuff);
    let resultData = [];
    let resultData3 = [];
    let resultData2 = [];
    resultData[0] = ["", "Weeks"];

    for(var i=0;i<this.props.trialStatus.length;i++)
    {
      resultData[i+1] = [
            this.props.trialStatus[i].name,
            Math.round((this.props.trialStatus[i].dayDifference/7) * 100)/ 100
      ]
      resultData2[i] = Math.round(this.props.trialStatus[i].dayDifference/7);             
    }
    var maxVal = 4;
    for(var i=0;i<resultData2.length;i++){
      if(maxVal<resultData2[i]){
          maxVal=resultData2[i]
      }
    }

    for(var i=0;i<=maxVal;i++){
      var obj = {
          'v': i,
          'f': "Week "+i
        }
        resultData3.push(obj);
    }

   
    function drawStuff(chartWidth) {
    if(resultData.length > 1)
      {
      var data = new google.visualization.arrayToDataTable(resultData);
      var options = {
        width: chartWidth,
        height: 300,
        hAxis: {
          ticks: resultData3,
          slantedText:true,
          slantedTextAngle:30,
        },
        legend: 'none',
        bar: {groupWidth: "25%"},
        colors: ['#34A0CF'],
        chartArea: {left: 210, top: 13}
      }
      
        var chart = new google.visualization.BarChart(document.getElementById('top_x_div'));
        chart.draw(data, options);
      }
      else
      {
        document.getElementById("top_x_div").innerHTML = "No Data Found"; 
      }
    };
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
      
  onsearchClick(event){

    var statusId = this.state.statusId;
    var phaseId = this.state.phaseId;
    var sponsorId = this.state.sponsorId;
    var trialId = this.state.trialId;
    cookies.save('trial_statusId',  statusId, {path: '/' });
    cookies.save('trial_phase',  phaseId, {path: '/' });
    cookies.save('trial_sponsor',  sponsorId, {path: '/' });
    cookies.save('trial_Id',  trialId, {path: '/' });
    browserHistory.push('/trials');
  }

  redirect() {
    this.state = { 
      trialData : '',
      sponsorId : '',
      trialId : '',
      phaseId : '',
      statusId : '',
      search: {
        params: {
          "pageNumber": 1,
          "pageSize": 10,
          "sortBy": "createdAt",
          "sortOrder": "desc"
        }
      }
    }
    this.props.actions.loadtrialsSelectList(this.state)
    this.getAllTrialList(this.state);
    this.setState({saving: false});
  }

  render() {
    return (
      <div>
        <Header/>
        <section id="container" className="container-wrap nav-is-close">
          <Leftmenu/>
          <section className="container-fluid">
            <section className="page-title">
              <div className="pull-left">
                <h1>Home</h1>
                <div className="breadcrumbs">
                  <span>Home</span><a href="javascript:void(0)">Dashboard</a>
                </div>
              </div>
            </section>
            <div className="db-four-box">
              <ul>
                <li><a className="color-01" href="javascript:void(0)"><span>{this.props.trialMetrics.activeTrialCount ? this.props.trialMetrics.activeTrialCount : 0}</span><b>Active Trials</b></a></li>
                <li onClick={this.getEnrolledPatientList}><a className="color-02" href="javascript:void(0)"><span>{this.props.trialMetrics.participantCountResult ? this.props.trialMetrics.participantCountResult : 0}</span><b>Total Participants</b></a></li>
              <Conditional condition={this.props.userRoleName.name == 'CRO'}>
                <li><a className="color-03" href="javascript:void(0)"><span>{this.props.dsmbCount ? this.props.dsmbCount : 0}</span><b>Total DSMb’s</b></a></li>
              </Conditional>
              <Conditional condition={this.props.userRoleName.name == 'CRO' || this.props.userRoleName.name == 'DSMB'}>  
                <li onClick={this.getfallOutPatient}><a className="color-04" href="javascript:void(0)"><span>{this.props.falloutPatientCount ? this.props.falloutPatientCount : 0}</span><b>Patient at risk of fallout</b></a></li>
              </Conditional>
              <Conditional condition={this.props.userRoleName.name == 'DSMB'}>
                <li><a className="color-03" href="javascript:void(0)"><span>42</span><b>Side Effects</b></a></li>
              </Conditional>
              <Conditional condition={this.props.userRoleName.name == 'CRO Coordinator'}>
                <li onClick={this.getfallOutPatient}><a className="color-04" href="javascript:void(0)"><span>{this.props.falloutPatientCount ? this.props.falloutPatientCount : 0}</span><b>Patient Fallout Risk</b></a></li>
              </Conditional>
              <Conditional condition={this.props.userRoleName.name == 'CRO Coordinator'}>
                <li><a className="color-03" href="javascript:void(0)"><span>85%</span><b>Drug Adherence</b></a></li>
              </Conditional>
              </ul>
            </div>
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
            <section className="row">
              <div className="col l5 m12">
                <div className="db-box bot-space">
                  <div className="head">
                    <h2>Trial Status</h2>
                  </div>
                  <div className="db-upcoming-box">
                    <div id="donutchart" style={{width: 500 +'px', height: 300+'px'}}>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col l7 m12">
                <div className="col 18 m12">
                <div className="db-box">
                  <div className="head">
                    <h2>Trial Progress</h2>
                  </div>
                  <div className="barchart-box">
                    <div id="top_x_div" style={{width: 500 +'px', height: 300+'px'}}>
                    </div>
                  </div>
                </div>
              </div>
              </div>
            </section>
            <section className="row">
              <Conditional condition={this.props.userRoleName.name == 'DSMB' || this.props.userRoleName.name == 'CRO Coordinator'}>
                <div className="col l6 m12">
                  <div className="db-box bot-space">
                    <div className="head">
                      <h2>Patients At Risk Of Fallout</h2>
                    </div>
                    <div className="notifications-box scroll-bar">
                      <table id="example" className="table table-striped table-bordered" cellspacing="0" width="100%">
                        <tbody>
                        {this.props.falloutPatient.map(data =>
                          <tr className="grey">
                            <td >
                              { data.patients[0].id } &nbsp; 
                              { data.firstname + "  " + data.lastname } &nbsp;
                              { data.patients[0].vital_dosage_statuses[0].phase.trial.name } &nbsp;
                              { 'Phase# ' + data.patients[0].vital_dosage_statuses[0].phase.sr_no } &nbsp;
                              <a href="javascript:void(0)" onClick={() => this.getPatientDetailGraph(data.patients[0].id,data.patients[0].vital_dosage_statuses[0].phase.trial.id,data.patients[0].vital_dosage_statuses[0].phase.id) }>View Details</a>
                            </td>
                          </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </Conditional>
              <Conditional condition={this.props.userRoleName.name == 'DSMB' || this.props.userRoleName.name == 'CRO Coordinator'}>
                <div className="col l6 m12">
                  <div className="col 18 m12">
                    <div className="db-box">
                      <div className="head">
                      <h2>Notifications</h2>
                    </div>
                    <div className="notifications-box scroll-bar">
                      <ul className="notifications-list">
                        <Conditional condition={this.props.notificationData.length == 0}>
                        <li>
                          <i className="red"></i> 
                          <span className="dosage">&nbsp; &nbsp; &nbsp; No Notification Found</span>
                        </li>
                        </Conditional>
                        {this.props.notificationData.map(data =>
                          <li>
                          <a>
                            <i className="red"></i> 
                            {data.patient.user.firstname} &nbsp; 
                            {data.patient.user.lastname} &nbsp;
                            ({data.trial.name}) 
                            <span className="dosage">
                              {data.description}
                            </span>
                            <span className="date-time">
                              {UTCtoUser.UTCtoUserTimezoneWithTime(data.createdAt,UsertimeZone)}
                            </span>
                          </a>
                        </li>
                      )}
                      </ul>
                    </div>
                    </div>
                  </div>
                </div>
              </Conditional>
              <Conditional condition={this.props.userRoleName.name == 'CRO'}>
                <div className="col l12 m12">
                  <div className="db-box bot-space">
                    <div className="head">
                      <h2>Notifications</h2>
                    </div>
                    <div className="notifications-box scroll-bar">
                      <ul className="notifications-list">
                        <Conditional condition={this.props.notificationData.length == 0}>
                        <li>
                          <i className="red"></i> 
                          <span className="dosage">&nbsp; &nbsp; &nbsp; No Notification Found</span>
                        </li>
                        </Conditional>
                        {this.props.notificationData.map(data =>
                          <li>
                          <a>
                            <i className="red"></i> 
                            {data.patient.user.firstname} &nbsp; 
                            {data.patient.user.lastname} &nbsp;
                            ({data.trial.name}) 
                            <span className="dosage">
                              {data.description}
                            </span>
                            <span className="date-time">
                              {UTCtoUser.UTCtoUserTimezoneWithTime(data.createdAt,UsertimeZone)}
                            </span>
                          </a>
                        </li>
                      )}
                      </ul>
                    </div>
                  </div>
                </div>
              </Conditional>
            </section>
          </section>
          <Footer/>
        </section>
      </div>
    );
  }
}


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
    trialStatus: state.TrialStatus,
    notificationData: state.NotificationData,
    piechartStatus: state.PiechartStatus,
    userRoleName: state.UserRoleName,
    trialMetrics: state.TrialMetrics,
    dsmbCount: state.ActiveDSMB.count,
    falloutPatientCount : state.falloutPatients.count,
    sponsors: sponsorsFormattedForDropdown(state.sponsorsSelectList),
    trialsSelectList: trialsFormattedForDropdown(state.trialsSelectList),
    phaseLists: phasesFormattedForDropdown(phaseList),
    statusLists: statusesFormattedForDropdown(statusList),
    timeZone : UsertimeZone,
    falloutPatient : !_.isUndefined(state.falloutPatients.data) ? state.falloutPatients.data : state.falloutPatients
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(trialActions, dispatch),
    notification: bindActionCreators(notificationActions, dispatch),
    roleActions: bindActionCreators(roleActions, dispatch),
    sponsorsActions: bindActionCreators(sponsorsActions, dispatch),
    dsmbActions: bindActionCreators(dsmbActions, dispatch),
    patientActions: bindActionCreators(patientActions, dispatch)
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(Profile);