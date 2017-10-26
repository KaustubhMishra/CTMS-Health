import React from 'react';
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
import * as UTCtoUser from '../common/generalFunctions';
import cookies from 'react-cookie';
import { Router, Route, Link, browserHistory, IndexRoute  } from 'react-router';
import SelectInput from '../common/SelectInput';
import {sponsorsFormattedForDropdown} from '../../selectors/selectors';
import {trialsFormattedForDropdown} from '../../selectors/selectors';
import {phasesFormattedForDropdown} from '../../selectors/selectors';
import {statusesFormattedForDropdown} from '../../selectors/selectors';
import { Conditional } from 'react-conditional-render';
import toastr from 'toastr';


let search = {
  params: {
    "pageNumber": 1,
    "pageSize": 10,
    "sortBy": "createdAt",
    "sortOrder": "desc"
  }
};

let trialId ='';
let UsertimeZone = '';
let falloutpatientListCount = 0;

class TrialDetailPage extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.notificationData =[];
    this.getTrial();
    this.getMilestoneStatus();
    this.getTrialPatient =  this.getTrialPatient.bind(this);
    this.props.trialMetrics.ExpectedResultDays ='';
    this.getfallOutPatient =  this.getfallOutPatient.bind(this); 
   } 
  

   getfallOutPatient(){
     if(this.props.falloutPatientCount == 0) {

    } else {
      browserHistory.push('/falloutpatientList/'+ trialId);    
    }
  }

  getTrial() {
    let that = this;
    this.props.patientActions.loadFalloutPatientById(trialId).then(responseFalloutData => {
      falloutpatientListCount = responseFalloutData.count
    });

    this.props.notification.loadTrialsNotification(trialId).then(responseDeviceData=>{
      this.notificationData = _.sortBy(responseDeviceData, 'createdAt').reverse();
    });
    this.props.actions.loadTrialsDetailMetrics(trialId);  
  }

  getMilestoneStatus() {
    $(document).ready(function(){
      $('[data-toggle="tooltip"]').tooltip();
      $(window).scrollTop(0);
      $(window).on('beforeunload', function() {
        $(window).scrollTop(0); 
      });
    });
    this.props.actions.loadTrialsMilestoneStatus(trialId).then(()=> this.OnPageLoadBarChart());
  }

  getTrialPatient() {
    this.props.patientActions.loadTrialsPatient(trialId).then(()=>this.redirect());
  }

  redirect() {
    if(this.props.trialMetrics.participantCountResult == 0) {

    } else {
      browserHistory.push('/patientList/'+ trialId);  
    }
    
  }

  OnPageLoadBarChart() {
    
    let resultData = [];
    let resultData3 = [];
    let resultData2 = [];
    resultData[0] = ["", "Weeks"];
    if(this.props.trialMilestoneStatus.length <= 0 ) {
      google.charts.setOnLoadCallback(drawChart);
      function drawChart() {
        var data = google.visualization.arrayToDataTable([
          [{
              f: 'Date',
              type: 'date'
          }, {
              f: 'Line',
              type: 'number'
          }], ]);

        var options = {
          title: 'Milestone'
        };

        if (data.getNumberOfRows() == 0) {
          data.addRow([new Date(), 0])
          options.series = {
            0: {
              color: 'transparent'
            }
          }
        }
        var chart = new google.visualization.AreaChart(document.getElementById('top_x_div'));
        chart.draw(data, options);
      }
    } else {
      google.charts.setOnLoadCallback(drawStuff);
      for(var i=0;i<this.props.trialMilestoneStatus.length;i++)
      {
        resultData[i+1] = [
          this.props.trialMilestoneStatus[i].milestoneName,
          Math.round((this.props.trialMilestoneStatus[i].dayDifference/7) * 100)/ 100
        ]
        resultData2[i] = Math.round(this.props.trialMilestoneStatus[i].dayDifference/7);             
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

      function drawStuff() {    
      
        var data = new google.visualization.arrayToDataTable(resultData);
        var options = {
          width: 500,
          hAxis: {ticks: resultData3,
            slantedText:true,
            slantedTextAngle:30
          },
          legend: 'none',
          bar: {groupWidth: "50%"},
          colors: ['#34A0CF', '#F8695F'],
          isStacked: true
        }
        var chart = new google.visualization.BarChart(document.getElementById('top_x_div'));
        chart.draw(data, options);
      };  
    }
  }

  render() {
    return (
      <div id="myDIV">
        <Header/>
        <section id="container" className="container-wrap nav-is-close">
          <Leftmenu/>
          <section className="container-fluid">
            <section className="page-title">
              <div className="pull-left">
                <h1>Trial</h1>
                <div className="breadcrumbs">
                  <span>Trial</span><a href="javascript:void(0)">Trial Detail</a>
                </div>
              </div>
            </section>
            <div className="db-four-box">
              <ul>
                <li onClick={this.getTrialPatient}><a className="color-02" href="javascript:void(0)"><span>{this.props.trialMetrics.participantCountResult}</span><b>Total Participants</b></a></li>
                <li onClick={this.getfallOutPatient}><a className="color-04" href="javascript:void(0)"><span>{falloutpatientListCount}</span><b>Total Patient Fallout Risk</b></a></li>
                <li><a className="color-03" href="javascript:void(0)"><span>1</span><b>Total Site Coordinator</b></a></li>
                <li><a className="color-01" href="javascript:void(0)"><span>85%</span><b>Drug Adherence</b></a></li>
              </ul>
            </div>
            <div className="row">
              <div className="col m12">
                <div className="db-box bot-space" style={{ minHeight: 0}}>
                <div className="trial-details-page">

                    <div className="head">
                      <h2>Trial Name: <i>{this.props.trialMetrics.trialName}</i> &nbsp;&nbsp;&nbsp;Phase: <i>{this.props.trialMetrics.activeTrialPhase}</i></h2>
                    </div>
                    <ul className="trial-status ">
                      <li>
                        <div className="status_phase">
                          <b style={{ width: this.props.trialMetrics.ExpectedResultDays + '%' }} className="green">
                          </b>
                          <b className="demoTest" data-toggle="tooltip" data-placement="bottom" data-original-title={this.props.trialMetrics.TotalDelay+ ' Days Delayed'} style={{ width: this.props.trialMetrics.ExpectedDelayedDays + '%' }} className="red">
                          </b>
                        </div>
                      </li>
                      </ul>
                      <div className="test1">
                          <div>
                            <h2>Start Date</h2>
                          </div>
                        <Conditional condition={this.props.trialMetrics.phaseStartDate == 'undefined'}>
                          <div>
                            <h2>{UTCtoUser.UTCtoUserTimezone(this.props.trialMetrics.phaseStartDate,UsertimeZone)}</h2>
                          </div>
                        </Conditional>
                        <Conditional condition={this.props.trialMetrics.phaseStartDate}>
                          <div>
                            <h2>{UTCtoUser.UTCtoUserTimezone(this.props.trialMetrics.phaseStartDate,UsertimeZone)}</h2>
                          </div>
                        </Conditional>
                      </div>
                      <div className="test" style={{ paddingRight: this.props.trialMetrics.ExpectedDelayedDays + '%' }}>
                        <div>
                          <h2>End Date</h2>
                        </div>
                        <Conditional condition={this.props.trialMetrics.phaseEndDate == 'undefined'}>
                          <div>
                            <h2>{UTCtoUser.UTCtoUserTimezone(this.props.trialMetrics.phaseEndDate,UsertimeZone)}</h2>
                          </div>
                        </Conditional>
                        <Conditional condition={this.props.trialMetrics.phaseEndDate}>
                          <div>
                            <h2>{UTCtoUser.UTCtoUserTimezone(this.props.trialMetrics.phaseEndDate,UsertimeZone)}</h2>
                          </div>
                        </Conditional>
                    </div>      
                  </div>
                  
                </div>
              </div>
            </div>
            <section className="row">
              <div className="col l12 m12">
                <div className="db-box bot-space">
                  <div className="head">
                    <h2>Milestone Status</h2>
                  </div>
                  <div className="db-upcoming-box">
                    <div id="top_x_div" style={{width: 500 +'px', height: 300+'px'}}>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section className="row">
              <div className="col l12 m12">
                <div className="db-box bot-space">
                  <div className="head">
                    <h2>Notifications</h2>
                  </div>
                  <div className="notifications-box scroll-bar">
                    <ul className="notifications-list">
                      <Conditional condition={this.notificationData.length == 0}>
                      <li>
                        <i className="red"></i> 
                        <span className="dosage">&nbsp; &nbsp; &nbsp; No Notification Found</span>
                      </li>
                      </Conditional>
                        {this.notificationData.map(data =>
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
                            { UTCtoUser.UTCtoUserTimezoneWithTime(data.createdAt,this.props.timeZone) }
                          </span>
                        </a>
                      </li>
                    )}
                    </ul>
                  </div>
                </div>
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
  UsertimeZone = state.userData.timezone;

  return {
    trialMilestoneStatus: state.TrialMilestoneStatus,
    notificationData: state.NotificationData,
    trialMetrics: state.TrialMetrics,
    timeZone: UsertimeZone,
    falloutPatientCount : state.falloutPatients.count
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


export default connect(mapStateToProps, mapDispatchToProps)(TrialDetailPage);