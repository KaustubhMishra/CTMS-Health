import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { Link } from 'react-router';
import {signIN} from '../../actions/signInActions';
import validateInput from '../common/validations/login';
import TextFieldGroup from '../common/TextFieldGroup';
import axios from 'axios';
import cookies from 'react-cookie';

class LoginForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      rememberMe: '',
      errors: {}
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onRememberMeChange = this.onRememberMeChange.bind(this);
    this.OnPageLoad = this.OnPageLoad.bind(this);
  }

  componentWillMount(){
      this.OnPageLoad();
  }

   onRememberMeChange(event){
   const signIn = this.state;
    signIn.rememberMe = event.target.checked;
    this.setState({ signIn });
  }
  
   OnPageLoad(event) {

        var cookieEmail = cookies.load('cookieEmail');
        var cookiePassword = cookies.load('cookiePassword');
        var rememberMe = cookies.load('rememberMe');
        

       var EncryCookieData = { cookieEmail: cookieEmail, 
                               cookiePassword: cookiePassword, 
                               rememberMe: (rememberMe =='true' || rememberMe == true)
                             };

       if(EncryCookieData && (EncryCookieData.cookieEmail || EncryCookieData.cookiePassword)) {
        axios.post('/api/site/auth/dec', EncryCookieData).then(function(response) {
            let signIn = {
                               email: response.data.decEmail, 
                               password: response.data.decPass, 
                               rememberMe: (rememberMe =='true' || rememberMe == true)
                      }
   
            this.setState(signIn);       
            }.bind(this)).catch(function(err) {
                console.log(err);
            });   

             
        
       }        
    };

  isValid() {
    const { errors, isValid } = validateInput(this.state);

    if (!isValid) {
      this.setState({ errors });
    }

    return isValid;
  }

  onSubmit(e) {
    e.preventDefault();
    if (this.isValid()) {
      this.setState({ errors: {}, isLoading: true });
      this.props.signIN(this.state);
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { errors, email, password, isLoading } = this.state;

    return (
      <form onSubmit={this.onSubmit}>

        <TextFieldGroup
          error={errors.email}
          label="Email"
          onChange={this.onChange}
          value={this.state.email}
          field="email"
        />

        <TextFieldGroup
          field="password"
          label="Password"
          value={this.state.password}
          error={errors.password}
          onChange={this.onChange}
          type="password"
        />
        <div className="login-last-field">
          <div className="checkbox-field">
            <input type="checkbox" name="rememberMe"
              onChange={this.onRememberMeChange}
              value={this.state.rememberMe}
              checked= { this.state.rememberMe }
              id="remember-me"
              className="css-checkbox"
            />
            <label htmlFor="remember-me" className="css-label">Remember me</label>
          </div>
          <Link to="forgotPassword" className="forgot">Forgot Password</Link>
        </div>
        <div className="login-action-field">
          <button className="btn blue" >Login</button>
        </div>
      </form>
    );
  }
}

LoginForm.propTypes = {
  signIN: React.PropTypes.func.isRequired
}


export default connect(null, { signIN })(LoginForm);


