/*eslint-disable import/default*/
import 'babel-polyfill';
import React from 'react';
import {render} from 'react-dom';
import {Router, browserHistory} from 'react-router';
import routes from './routes';
import configureStore from './store/configureStore';
import {Provider} from 'react-redux';
import {loadCourses} from './actions/courseActions';
import {loadAuthors} from './actions/authorActions';
import {loadSponsorsList} from './actions/sponsorActions';
import {loadDrugTypes} from './actions/drugTypeActions';
import {loadDsmbs} from './actions/dsmbActions';
import {loadDosages} from './actions/dosageActions';
import {loadFrequencies} from './actions/frequencyActions';
import {loadAllPatients} from './actions/patientActions';
import {loadUsersRoles} from './actions/roleActions';
import {loadTimezoneList} from './actions/timezoneActions';
import {loadCountryList} from './actions/countryStateActions';
import {loadNotification} from './actions/notificationActions'
import {loadDeviceList} from './actions/deviceActions';
import {loadTrialsStatus} from './actions/trialActions';
import {loadTrialsPieChartStatus} from './actions/trialActions';
import {loadDeviceGroupList} from './actions/deviceGroupActions';

//import './styles/styles.css'; //Webpack can import CSS files too!

import './assets/js/zebra_datepicker.js';
import './assets/css/zebra_datepicker.css';
import './assets/css/tabs.css';

import '../node_modules/toastr/build/toastr.min.css';
import './assets/fullcalendar/fullcalendar.min.css';
import './assets/fullcalendar/fullcalendar.print.css';

//import './theme/css/lib/font-awesome/font-awesome.min.css'; //Webpack can import CSS files too!
import './assets/css/reset.css'; //Webpack can import CSS files too!
import './assets/css/grid.css'; //Webpack can import CSS files too!
import './assets/css/jktCuteDropdown.css';
import './assets/css/jquery.mCustomScrollbar.css';
import './assets/css/master.css'; //Webpack can import CSS files too!
import './assets/js/function.js';
import './assets/js/jquery.dataTables.js';
/*import './assets/js/dataTables.bootstrap.js';*/
import './assets/js/jquery.mCustomScrollbar.concat.min.js';
import './assets/js/jktCuteDropdown.min.js';


import './assets/css/data-table-bootstrap.css';
//import './theme/js/plugins.js'; //Webpack can import JS files too!

const store = configureStore();


    
// Dispatch actions to load initial state.
store.dispatch(loadCourses());
store.dispatch(loadAuthors());

store.dispatch(loadDrugTypes());
//store.dispatch(loadDsmbs());
//store.dispatch(loadDosages());
store.dispatch(loadFrequencies());
//store.dispatch(loadAllPatients());
store.dispatch(loadUsersRoles());
store.dispatch(loadTimezoneList());
store.dispatch(loadCountryList());
//store.dispatch(loadNotification());
//store.dispatch(loadDeviceList());
//store.dispatch(loadTrialsStatus());
//store.dispatch(loadTrialsPieChartStatus());
//store.dispatch(loadDeviceGroupList());

render(
  <Provider store={store}>
    <Router history={browserHistory} routes={routes}/>
  </Provider>,
  document.getElementById('app')
);
