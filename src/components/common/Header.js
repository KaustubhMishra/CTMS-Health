import React from 'react';
import {connect} from 'react-redux';
import cookies from 'react-cookie';
import { Router, Route, Link, browserHistory, IndexRoute  } from 'react-router'
import * as getLoggedUserActions from '../../actions/getLoggedUserActions';
import {bindActionCreators} from 'redux';
import { Conditional } from 'react-conditional-render';

class Header extends React.Component  { 

  constructor(props, context) {
    super(props, context);

    this.getLoggedInUser();
    this.Logout = this.onClickLogout.bind(this);
    this.OnPageLoad();
  }

  componentWillMount(){
      //this.OnPageLoad();
  }

  OnPageLoad() {
    $(document).ready(function(){
      
      let isOpen = false;
      $('.nav-icon').click(function(){
        if(isOpen == false) {
          $('[data-toggle="tooltip"]').tooltip('hide');
          $("#container").removeClass("nav-is-close");
          $("#container").addClass("nav-is-open");
          isOpen = true;
        }
        else {
          $('[data-toggle="tooltip"]').tooltip();
          $("#container").removeClass("nav-is-open");
          $("#container").addClass("nav-is-close");
          isOpen = false;
        }
      });
    });
  }

  onClickLogout(event) {
    cookies.remove('access_token', { path: '/' });
    cookies.remove('refresh_token', { path: '/' });
    cookies.remove('keyName', { path: '/' });
    cookies.remove('basicToken', { path: '/' });
    cookies.remove('userData', { path: '/' });
    cookies.remove('usercompanyid', { path: '/' });

    browserHistory.push('/login');
  }

  getLoggedInUser() {
    this.props.actions.getUserInfo();
  } 

render() {
    return (
      <header>
        <a className="nav-icon"><img src={require('../../assets/images/icon-nav.svg')} alt=""/></a>
        <div className="container-fluid">
          <h1 className="brand"><a href="javascript:void(0)"><img src={require('../../assets/images/brand.png')} /></a> 
            <span>Smart Clinical Trials</span>
          </h1>
          <div className="pull-right">
            <ul className="head-right">
              
              <li className="notification demo dropdown">
                <div className="dropdown-menu pull-right jktCD-main jktCD-style-one" aria-labelledby="dLabel">
                  <ul>
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
                            {data.createdAt}
                          </span>
                        </a>
                      </li>
                    )}
                  </ul>
                </div>
              </li>
              <li className="user demo jktCD dropdown"> 
                <a className=" jktCD-click" href="javascript:void(0)" id="user" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <span>
                    <img src={'/upload/profilepicture/' + this.props.user.profile_image} alt="" style={{width: 39 + 'px', height: 39 + 'px'}}/>
                  </span>{ this.props.user.firstname } <i className="fa fa-caret-down"></i>
                </a>
                <div className="dropdown-menu pull-right jktCD-main jktCD-style-one" aria-labelledby="user">
                  <ul>
                    <li className="item">
                      <Link to="/viewProfile"><i className="fa fa-info-circle"></i> Profile</Link>
                    </li>
                    <li className="pemisah">
                      </li>
                    <li className="item">
                      <a onClick={this.Logout}><i className="fa fa-power-off"></i> Sign Out</a>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </header>
    );
  };
  };

function mapStateToProps(state, ownProps) {
  return {
    user: state.userData,
    notificationData: state.NotificationData,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(getLoggedUserActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);