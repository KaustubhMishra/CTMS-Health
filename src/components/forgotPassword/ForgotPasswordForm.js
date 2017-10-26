import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { Link } from 'react-router';
import { forgotPassword } from '../../actions/forgotPasswordActions';
import validateInput from '../common/validations/ForgotPassword';
import TextFieldGroup from '../common/TextFieldGroup';

class ForgotPasswordForm extends React.Component {

  constructor(props, context) {
    super(props, context);

     this.state = {
      email: '',
      errors: {}
    };

    this.onSubmit = this.onSubmit.bind(this);

    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  onSubmit(event) {
    event.preventDefault();
    if (this.isValid()) {
      this.setState({ errors: {}, isLoading: true });
      this.props.forgotPassword(this.state);
    }
  }

  isValid() {
    const { errors, isValid } = validateInput(this.state);

    if (!isValid) {
      this.setState({ errors });
    }

    return isValid;
  }

  render() {
     const { errors, email } = this.state;
    return (
      <form onSubmit={this.onSubmit}>
        <TextFieldGroup
          error={errors.email}
          label="Email"
          onChange={this.onChange}
          value={this.state.email}
          field="email"
        />
        <div className="forgot-action-field">
          <button className="btn blue" >Submit</button>
          <Link to="login" className="btn btn-border">Cancel</Link>
        </div>
      </form>
    );
  }
}

ForgotPasswordForm.propTypes = {
  forgotPassword: React.PropTypes.func.isRequired
}

export default connect(null, { forgotPassword })(ForgotPasswordForm);

