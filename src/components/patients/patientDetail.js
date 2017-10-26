import React, {PropTypes} from 'react';
import ReactDOM from "react-dom";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {browserHistory, Link} from 'react-router';
import toastr from 'toastr';
import Header from '../common/Header';
import Leftmenu from '../common/Leftmenu';
import Footer from '../common/Footer';
import { MonthView } from 'react-date-picker';
import 'react-date-picker/index.css';
import * as sensorDataActions from '../../actions/sensorDataActions';
import * as vitalDataActions from '../../actions/vitalDataActions';
import * as trialActions from '../../actions/trialActions';
import * as patientActions from '../../actions/patientActions';
import * as notificationActions from '../../actions/notificationActions';
import moment from 'moment';
import _ from 'lodash';
import DatePicker from 'react-datepicker';
import async from 'async';
import cookies from 'react-cookie';
import * as UTCtoUser from '../common/generalFunctions';
import TextArea from '../common/TextArea';
import { Conditional } from 'react-conditional-render';
import * as roleActions from '../../actions/roleActions';

let events = [];
let patient_trial_id;
let patient_phase_id;
let patient_id;

class PatientDetail extends React.Component {
  constructor(props, context) {
    super(props, context);

    events = [];
    patient_trial_id = cookies.load('patient_trial_id');
    patient_phase_id = cookies.load('patient_phase_id');
    patient_id = cookies.load('patient_id');

    this.state = {
      patientDetail: {},
      trialDetail: {},
      phaseDetail: {},
      sensorDetail: Object.assign({}, this.props.sensorDetail),
      vitalData : Object.assign({}, this.props.vitalData),
      NotificationData : Object.assign({}, this.props.NotificationData),
      calendarData : Object.assign([], this.props.calendarData),
      sendPushMessage:{}
    };
    this.updatePatientMessage = this.updatePatientMessage.bind(this);
    this.sendPushNotification = this.sendPushNotification.bind(this);
    
    this.getpatientDetail();
  }


  componentWillMount() {
    this.props.roleActions.loadUsersRolesName();
    this.OnPageLoadBarChart();
  }

  getpatientDetail()
  {
    
    let that = this;
    let props= this.props;
    let notificationList = [];

    async.series([
                    function(callback){
                       props.notificationActions.loadNotificationCRO();
                       callback();
                    },
                    function(callback) 
                    {  
                      if(patient_trial_id)
                         {
                          props.trialActions.fetchDataById(patient_trial_id).then(function(response){
                              that.state.trialDetail = response[0];
                              const phaseDetail = response[0].phases.filter(phaseList => phaseList.id == patient_phase_id); 
                              that.state.phaseDetail = phaseDetail[0];
                              callback();
                          });
                        }
                        
                    },
                    function(callback) 
                    {
                        props.patientActions.loadAllPatients().then(function(response)
                        {
                              const patient = response.filter(patient => patient.patients[0].id == patient_id);
                              if (patient) {
                                  that.state.patientDetail = patient[0];
                                  that.state.sendPushMessage.Message  = "Hi " + that.state.patientDetail.firstname+ "\n\n"+ that.props.userObject.firstname;
                              }
                              callback();
                          });
                    },
                    function(callback)
                    {
                            let reqParam = {
                              "trial_id" : patient_trial_id,
                              "phase_id" : patient_phase_id,
                              "company_id" : that.state.trialDetail.company_id,
                              "patient_id" : that.state.patientDetail.id
                            }

                            let vitalreqParam = {
                              "type" : 2,
                              "trial_id" : patient_trial_id,
                              "patient_user_id" : that.state.patientDetail.id,
                              "phase_id" : patient_phase_id,
                              "start_date": that.state.phaseDetail.start_date,
                              "end_date": that.state.phaseDetail.tentitive_end_date,
                              "patient_id" : that.state.patientDetail.id
                            }

                          props.vitalactions.loadvitalData(vitalreqParam).then((response) => 
                                     that.CalenderData()
                                 )
                            .catch(error => {
                              toastr.error(error);
                              console.log(error);
                              //this.setState({saving: false});
                            });
                          callback();  
                    },
                    function(callback){
                         let reqParam = {
                              "trial_id" : patient_trial_id,
                              "phase_id" : patient_phase_id,
                              "company_id" : that.state.trialDetail.company_id,
                              "patient_id" : that.state.patientDetail.id
                            }

                        props.actions.loadCassndraData(reqParam).then(function(){
                                  props.actions.loadsensorData(that.state).then((response) => 
                                       that.OnPageLoadDyGraph()
                                   )
                              .catch(error => {
                                toastr.error(error)
                              });
                        });

                        callback();
                    }
                 ])

    this.state.trialDetail = that.state.trialDetail;
    this.state.phaseDetail = that.state.phaseDetail;
    this.state.patientDetail = that.state.patientDetail;
    this.state.sendPushMessage = that.state.sendPushMessage;

  } 
  
  CalenderData(){
    let timeZone = this.props.timeZone;
    if(this.props.calendarData.length > 0)
    {
      let calendarDataList = this.props.calendarData;
      
      
      for(var c=0;c<calendarDataList.length;c++)
      {
        let eventList = {
            "start" : UTCtoUser.UTCtoUserTimezone(calendarDataList[c].schedule_on,timeZone),
            "title" : '',
            className: calendarDataList[c].isUpcoming ? calendarDataList[c].status == true ? ["fc-event-green"] : ["fc-event-gray"] : calendarDataList[c].status == false ? ["fc-event-red"] : ["fc-event-green"] 
        }

        events.push(eventList);
        
      }
      
    }

    $(document).ready(function() {
            $('#calendar').fullCalendar({
              header: {
                left: 'prev,next',
                center: 'title',
                right: 'today'
                //right: 'month,agendaWeek,agendaDay,listWeek'
              },
              defaultDate:  UTCtoUser.UTCtoUserTimezone(moment(),timeZone),
              navLinks: false, // can click day/week names to navigate views
              editable: false,
              eventLimit: 2,
              events: events
            });
        
      });
  }


  OnPageLoadDyGraph(){
      if(this.props.vitalData.length > 0 && !_.isUndefined(this.props.sensorDetail))
      {
        let templateDetail = this.props.sensorDetail;
        let vitalData = _.sortBy(this.props.vitalData, 'receiveddate').reverse();
        let timeZone = this.props.timeZone;
        
        for(let t=0;t<templateDetail.length;t++)
        {
            let dataArray = [];
                dataArray[0] = ["", ""];
            let id = "dye_div" + t; 

            for(var v=0;v<vitalData.length;v++)
              { 

                var myObject = JSON.parse(vitalData[v].data);
                var date = UTCtoUser.UTCtoUserTimezoneWithUnixTime(myObject.date,timeZone)
                
                _.forOwn(myObject, function(num, key) {
                            key == templateDetail[t].name ?  dataArray.push([date,parseFloat(num)]) : 0;
                      });
                  
              }

          
          
            if(dataArray.length > 1)
                {
                  google.charts.setOnLoadCallback(drawChart);
                    

                      function drawChart() 
                        {
                          var data = google.visualization.arrayToDataTable(dataArray.splice(0,11));
                          var options = {
                                legend: {position: 'none'},
                                title: templateDetail[t].description,
                                hAxis: {
                                  slantedText:true,
                                  slantedTextAngle:30,
                                },
                                pointSize: 5
                              };

                            let chart = new google.visualization.AreaChart(document.getElementById(id));
                            chart.draw(data, options);   
                        
                      } 

                }
                else
                {
                    //document.getElementById(id).innerHTML = "<b>" + templateDetail[t] + "</b>";
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
                              title: templateDetail[t].name
                          };

                          if (data.getNumberOfRows() == 0) {
                              data.addRow([new Date(), 0])
                              options.series = {
                                  0: {
                                      color: 'transparent'
                                  }
                              }
                          }


                          var chart = new google.visualization.AreaChart(document.getElementById(id));

                          chart.draw(data, options);
                      }
                }
        
           
        }

      }
      else if(!_.isUndefined(this.props.sensorDetail))
      {
        let templateDetail = this.props.sensorDetail;

            for(let t=0;t<templateDetail.length;t++)
            {
                let dataArray = [];
                    dataArray[0] = ["", ""];
                let id = "dye_div" + t; 

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
                              title: templateDetail[t].name
                          };

                          if (data.getNumberOfRows() == 0) {
                              data.addRow([new Date(), 0])
                              options.series = {
                                  0: {
                                      color: 'transparent'
                                  }
                              }
                          }


                          var chart = new google.visualization.AreaChart(document.getElementById(id));

                          chart.draw(data, options);
                      }

           }
      }
  }

  OnPageLoadBarChart() {      
    google.charts.setOnLoadCallback(drawStacked);

    function drawStacked() {
     var data1 = google.visualization.arrayToDataTable([
         ['Element', '', { role: 'style' }],
         ['Fatigue', 8, '#27b7ee'],            
         ['Diarrhea', 10, '#27b7ee'],           
         ['Headache', 14, '#27b7ee'],
         ['Shortness of breath', 13, '#27b7ee'],
         ['Cold hands', 11, '#27b7ee'],
         ['Upset stomach', 12, '#27b7ee'],
         ['Constipation', 10, '#27b7ee'],
         ['Dizziness', 9, '#27b7ee'] 
      ]);

      var options = {
        title: 'Side Effects',
        chartArea: {width: '40%'},
        legend: { position: 'none' },
        isStacked: true,
        hAxis: {
          title: 'Total',
          minValue: 0,
        },
        vAxis: {
          title: 'Effects'
        }
      };
      var chart = new google.visualization.BarChart(document.getElementById('chart_div'));
      chart.draw(data1, options);
    }
  }

  updatePatientMessage(event) {
    const field = event.target.name;
    let patientMessage = this.state.sendPushMessage;
    patientMessage[field] = event.target.value;
    return this.setState({sendPushMessage: patientMessage});
  }
  
  sendPushNotification() {
    var patientObject = {
      userId: this.state.patientDetail.id,
      trialId: this.state.phaseDetail.trial_id,
      phaseId: this.state.phaseDetail.id,
      companyId: this.state.trialDetail.company_id,
      patientId: this.state.patientDetail.patients[0].id,
      Message: this.state.sendPushMessage.Message
    };
    this.props.notificationActions.sendNotification(patientObject);
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
                          <span>Patient</span><a>Patient Detail</a>
                        </div>
                      </div>
                      <Conditional condition={this.props.userRole.name == 'CRO Coordinator' || this.props.userRole.name == 'DSMB'}>
                        <div className="pull-right">
                          <button type="button" className="btn btn-info btn" data-toggle="modal" data-target="#myModal" style={{width: 131 + 'px'}}>Send Message</button>
                        </div>
                      </Conditional>
                    </section>
                    <div className="modal fade" id="myModal" role="dialog">
                      <div className="modal-dialog"> 
                        <div className="modal-content">
                          <div className="profile-form-row1">
                            <label>Message:</label>    
                            <div className="textarea-field pull-left">
                              <TextArea
                                name="Message"
                                value={this.state.sendPushMessage.Message}
                                onChange={this.updatePatientMessage}
                                maxLength="100"
                              />
                            </div>
                          </div>
                          <div className="modal-footer">
                            <button type="button" className="btn btn-info btn" onClick={this.sendPushNotification}>Send</button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="db-search-wrap">
                      <div className="db-search-form">
                           <div className="trial-field-row">
                            <label>Patient:</label>
                            <div className="span-text-field">
                                <span>{this.state.patientDetail.firstname}</span>
                            </div>
                           </div>
                           <div className="trial-field-row">
                              <label>Age :</label>
                              <div className="span-text-field">
                                <span>{this.state.patientDetail.patients ? this.state.patientDetail.patients[0].age : ""}</span>
                              </div>
                            </div>
                            <div className="trial-field-row">
                                <label>Gender :</label>
                                <div className="span-text-field">
                                  <span>{this.state.patientDetail.patients ? this.state.patientDetail.patients[0].gender : "" }</span>
                                </div>
                            </div>
                            <div className="trial-field-row">
                                <label>Email :</label>
                                <div className="span-text-field">
                                  <span>{this.state.patientDetail.email}</span>
                                </div>
                            </div>
                            <div className="trial-field-row">
                                <label>Trial :</label>
                                <div className="span-text-field">
                                  <span>{this.state.trialDetail.name}</span>
                                </div>
                            </div>
                      </div>
                    </div>
                    <section className="row">
                          
                              <div className="col l6">
                                <div className="calenderArea">
                                  <div id='calendar'></div>
                                </div>
                              </div>
                          
                          <div className="col l6">
                            <div className="sideeffectArea">  
                              <div id="chart_div" style={{width: 100 +'%', height: 310+'px'}}></div>
                            </div>
                          </div>
                    </section> 
                      <section className="row">
                        
                        { (!_.isUndefined(this.props.sensorDetail)) && (

                          
                          <div className="db-box">
                            <div className="head">
                              <h2>Vitals Chart</h2>
                            </div>
                            <div className="chart-box">
                                  {
                                    
                                      this.props.sensorDetail.map((Data, index) =>
                                                <div className="col l6 m6 bot-space">
                                                  <div id={"dye_div" + index}  style={{width: 100 +'%', height: 300+'px', color: 'black'}}></div>
                                              </div>
                                            )
                                  }
                            </div>
                          </div>
                       )}
                    </section> 
                     <section className="row">
                        <div className="db-box">
                            <div className="head">
                              
                              <h2>Notifications</h2>
                            </div>
                            <div className="notifications-box scroll-bar">
                            <ul className="notifications-list">
                              <Conditional condition={this.props.NotificationData.length == 0}>
                                <li>
                                  <i className="red"></i> 
                                  <span className="dosage">&nbsp; &nbsp; &nbsp; No Notification Found</span>
                                </li>
                              </Conditional>
                              {
                                this.props.NotificationData.map(data =>
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
                  </section>

               </section>
               <Footer/>
        </section>
      </div>
    );
  }
}

function getNotification(AllNotificationData,patientId,trialId,phaseId){
  console.log(AllNotificationData);
   const notificationList = AllNotificationData.filter(notification => notification.patient.id == patientId && notification.trial.id == trialId && notification.phase.id == phaseId);
  if (notificationList) {
    return notificationList;
  }
  return null;
}

function mapStateToProps(state, ownProps) {
  let sendPushMessage= {
    Message: ''
  };

  return {
          NotificationData : getNotification(state.NotificationData,patient_id,patient_trial_id,patient_phase_id),
          sensorDetail: state.sensorData,
          vitalData : state.cassandraData,
          calendarData : state.vitalDataList,
          timeZone : state.userData.timezone,
          sendPushMessage: sendPushMessage,
          userObject: state.userData,
          userRole: state.UserRoleName
    };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(sensorDataActions, dispatch),
    vitalactions: bindActionCreators(vitalDataActions, dispatch),
    trialActions: bindActionCreators(trialActions, dispatch),
    patientActions: bindActionCreators(patientActions, dispatch),
    notificationActions: bindActionCreators(notificationActions, dispatch),
    roleActions: bindActionCreators(roleActions, dispatch)
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(PatientDetail);

