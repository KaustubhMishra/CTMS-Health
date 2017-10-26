import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as RolePermissionActions from '../../actions/RolePermissionActions';
import * as StateListActions from '../../actions/stateListActions';
import * as UserProfileActions from '../../actions/userProfileActions';
import toastr from 'toastr';
import validateInput from '../common/validations/userProfileValidation';
import Header from '../common/Header';
import Footer from '../common/Footer';
import Leftmenu from '../common/Leftmenu';
import { Conditional } from 'react-conditional-render';
import cookies from 'react-cookie';
import { Router, Route, Link, browserHistory, IndexRoute  } from 'react-router';
import MyProfileForm from './myProfileForm';
import {countryFormattedForDropdown} from '../../selectors/selectors';
import {stateFormattedForDropdown} from '../../selectors/selectors';
let showStateTextbox = false;
let hideStateSelectbox = true;
let userDataArray = {};


class MyProfile extends React.Component {

	constructor(props, context) {
    super(props, context);
    this.state = {
      user: Object.assign({}, userDataArray),
      file:'',
      imagePreviewUrl: '',
      errors: {},
      saving: false
    };
    this.getUserProfile();
    hideStateSelectbox = true;
    showStateTextbox = false;
    this.updateUserState = this.updateUserState.bind(this);
    this.updateCountry = this.updateCountry.bind(this);
    this.saveUserProfile = this.saveUserProfile.bind(this);
    this._handleImageChange = this._handleImageChange.bind(this);
  }

  isValid() {
    const { errors, isValid } = validateInput(this.state.user);

    if (!isValid) {
      this.setState({ errors });
    }

    return isValid;
  }

  /*componentWillMount() {
    this.OnPageLoad();
  }
  
  OnPageLoad() {
    $(document).ready(function(){
      $(".scroll-bar").mCustomScrollbar({
        autoHideScrollbar:true,
        autoDraggerLength: false
      });
      $(window).on('beforeunload', function() {
        $(window).scrollTop(0); 
      });
    });
  }*/

  updateUserState(event) {
    const field = event.target.name;
    let user = this.state.user;
    user[field] = event.target.value;
    return this.setState({user: user});
  }


  updateCountry(event) {
    const field = event.target.name;
    let user = this.state.user;
    user[field] = event.target.value;
    console.log(user[field]);
    if(user[field] == '1') {
      hideStateSelectbox = true;
      showStateTextbox= false;
      this.state.user.state= '';
      this.props.stateListActions.loadStateList(user[field]);
      return this.setState({user: user});
    } else{
      showStateTextbox= true;
      hideStateSelectbox = false;
      this.state.user.state= '';
      return this.setState({user: user});
    }
  }

  saveUserProfile(event) {
    event.preventDefault();
    if (this.isValid()) {
    this.setState({ errors: {} });
    console.log(this.state.user);
    this.props.userProfileActions.updateUserProfile(this.state.user, this.state.file)
      .then(() => this.redirect())
      .catch(error => {
        toastr.error(error);
        this.setState({saving: false});
      });
    }
  }

  _handleImageChange(e) {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    reader.onloadend = () => {
      this.setState({
        file: file,
        errorFile: false,
        checkErrorFile: false,
        imagePreviewUrl: reader.result
      });
    };
    reader.readAsDataURL(file);
  }

  getUserProfile() {
    this.props.userProfileActions.getUserUpdatedInfo().then(response =>{
      if(response.status == false){
        this.context.router.push('/users');
      }else{
        
        if(response.data.user_contact_infos.length <= 0) {
          userDataArray = {
            firstname: response.data.firstname,
            lastname: response.data.lastname,
            profile_image: response.data.profile_image,
            email: response.data.email,
            contact_address: '',
            phone: response.data.phone,
            country: '',
            state: '',
            city: '',
            fax: ''
          };
        } else {
            userDataArray = {
            firstname: response.data.firstname,
            lastname: response.data.lastname,
            profile_image: response.data.profile_image,
            email: response.data.email,
            contact_address: response.data.user_contact_infos[0].contact_address1,
            phone: response.data.phone,
            country: response.data.user_contact_infos[0].country,
            state: response.data.user_contact_infos[0].state,
            city: response.data.user_contact_infos[0].city,
            fax: response.data.user_contact_infos[0].fax
          };
        }
        
        
        if(userDataArray.country == '1') {
          this.props.stateListActions.loadStateList(userDataArray.country);
          this.setState({user: userDataArray});
        } else if(userDataArray.country == '2'){
          hideStateSelectbox = false;
          showStateTextbox = true;
          this.setState({user: userDataArray});
        }
      }
    })
    .catch(error => {console.log('ERROR');
      toastr.error(error);
    });
  }

  redirect() {
    this.setState({saving: false});
    toastr.success('User Profile Updated Successfully.');
    browserHistory.push('/dashboard');
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
                <h1>Profile</h1>
                <div className="breadcrumbs">
                  <span>Profile</span><a href="javascript:void(0)">My Profile</a>
                </div>
              </div> 
            </section>
            <div className="ma-box">
              <div className="head">
                <h2>Profile</h2>
              </div>
              <div className="account-box">
                <div className="row">
                  <div className="col s3">
                    <div className="user-avatar">
                      {this.state.imagePreviewUrl ? (
                        <img src={this.state.imagePreviewUrl}/>
                      ) : (
                        <img src={'/upload/profilepicture/' + this.state.user.profile_image}/>
                      )}
                    </div>
                    <div className="file-upload">
                      <a>
                        <input
                          type="file"
                          onChange={this._handleImageChange}
                          className="form-control"
                        />
                      </a>
                      <span>Change Picture</span>
                    </div>
                  </div>
                  <div className="col s9">
                    <div className="profile-details">
                      <div className="profile-wrap">
                        <div className="profile-head">
                          <h2>{this.state.user.firstname} {this.state.user.lastname}</h2>
                          <div className="head-info"> 
                            <span className="cp-link">
                              <Link to="changePassword" ><i><img src={require('../../assets/images/icon-cp.png')} alt=""/></i>Change Password</Link>
                            </span>
                          </div>
                        </div>
                        <MyProfileForm
                          user={this.state.user}
                          countryList={this.props.countryList}
                          errors={this.state.errors}
                          stateList={this.props.stateList}
                          onChange={this.updateUserState}
                          updateCountry={this.updateCountry}
                          showStateTextbox={showStateTextbox}
                          hideStateSelectbox={hideStateSelectbox}
                          onSave={this.saveUserProfile}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <Footer/>
        </section>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  let user= {
    firstname: '',
    lastname:'',
    email: '',
    contact_address: '',
    phone: '',
    country: '',
    state: '',
    city: '',
    fax: ''
  }
  return {
    user: user,
    countryList: countryFormattedForDropdown(state.CountryList),
    stateList: stateFormattedForDropdown(state.StateList)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(RolePermissionActions, dispatch),
    stateListActions: bindActionCreators(StateListActions, dispatch),
    userProfileActions: bindActionCreators(UserProfileActions, dispatch)
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(MyProfile);

