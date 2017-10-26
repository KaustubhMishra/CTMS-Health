import React from 'react';
import {connect} from 'react-redux';
import cookies from 'react-cookie';
import { Router, Route, Link, browserHistory, IndexRoute  } from 'react-router'
import { Conditional } from 'react-conditional-render';
import * as RolesandPermission from './RolesandPermission';

const user= ['/users', '/addUsers', '/user'];
const trial= ['/trials', '/trial', '/trialDetail', 'trials'];
const sponsor= ['/sponsors', '/sponsor'];
const device= ['/deviceList', '/deviceListData', '/addDevice'];
const patient= ['/patientList', '/patientTrialList', '/falloutpatientList'];
const sideEffect= ['/sideEffects', '/sideEffect'];
const report= ['/reports'];
const notification= ['/notificationList'];


class Leftmenu extends React.Component {

  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <aside>
        <ul className="nav-right">
          <li style={{background : cookies.load('active') == '/dashboard' ? '#272b35' : ''}}>
            <Link to="/dashboard" className="demoTest" data-toggle="tooltip" data-placement="right" title="Home"><i className="icon-01"></i><span>Home</span></Link>
          </li>
          <Conditional condition={RolesandPermission.permissionCheck("USER_VIEW") ==true}>
            <li  style={{background : user.indexOf(cookies.load('active')) >= 0 ? '#272b35' : ''}}>
              <Link to="/users" className="demoTest" data-toggle="tooltip" data-placement="right" title="Users"><i className="icon-11"></i><span>Users</span></Link>
            </li>
          </Conditional>
          <Conditional condition={RolesandPermission.permissionCheck("TRAIL_VIEW") ==true}>
            <li style={{background : trial.indexOf(cookies.load('active')) >= 0 ? '#272b35' : ''}}>
              <Link to="/trials" className="demoTest" data-toggle="tooltip" data-placement="right" title="Trials"><i className="icon-02"></i><span>Manage Trials</span></Link>
            </li>
          </Conditional>
          <Conditional condition={RolesandPermission.permissionCheck("SPONSOR_VIEW") ==true}>
            <li style={{background : sponsor.indexOf(cookies.load('active')) >= 0 ? '#272b35' : ''}}>
              <Link to="/sponsors" className="demoTest" data-toggle="tooltip" data-placement="right" title="Sponsors"><i className="icon-11"></i><span>Sponsors</span></Link>
            </li>
          </Conditional>
          <Conditional condition={RolesandPermission.permissionCheck("DEVICE_VIEW") ==true}>
            <li style={{background : device.indexOf(cookies.load('active')) >= 0 ? '#272b35' : ''}}>
              <Link to="/deviceList" className="demoTest" data-toggle="tooltip" data-placement="right" title="Devices"><i className="icon-12"></i><span>Devices</span></Link>
            </li>
          </Conditional>
          <Conditional condition={RolesandPermission.permissionCheck("IMPORT_PATIENT") ==true}>
            <li style={{background : patient.indexOf(cookies.load('active')) >= 0 ? '#272b35' : ''}}>
              <a href="/patientList" className="demoTest" data-toggle="tooltip" data-placement="right" title="Patients"><i className="icon-03"></i><span>Patients</span></a>
            </li>
          </Conditional>
          
          <Conditional condition={RolesandPermission.permissionCheck("SIDE_EFFECT_VIEW") ==true}>
            <li style={{background : sideEffect.indexOf(cookies.load('active')) >= 0 ? '#272b35' : ''}}>
              <Link to="/sideEffects" className="demoTest"  data-toggle="tooltip" data-placement="right" title="Side Effects"><i className="icon-06"></i><span>Side Effects Pool</span></Link>
            </li>  
          </Conditional>
          <Conditional condition={RolesandPermission.permissionCheck("REPORT_VIEW") ==true}>
            <li style={{background : report.indexOf(cookies.load('active')) >= 0 ? '#272b35' : ''}}>
              <Link to="/reports" className="demoTest" data-toggle="tooltip" data-placement="right" title="Reports"><i className="icon-09"></i><span>Reports</span></Link>
            </li>  
          </Conditional>
          <Conditional condition={RolesandPermission.permissionCheck("NOTIFICATION_VIEW") ==true}>
            <li style={{background : notification.indexOf(cookies.load('active')) >= 0 ? '#272b35' : ''}}>
              <Link to="/notificationList" className="demoTest" data-toggle="tooltip" data-placement="right" title="Notifications"><i className="icon-10"></i><span>Notifications</span></Link>
            </li>
          </Conditional>
        </ul>
      </aside>
    );
  }
}



export default Leftmenu;

