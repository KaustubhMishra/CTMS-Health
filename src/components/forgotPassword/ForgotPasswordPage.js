import React from 'react';
import ForgotPasswordForm from './ForgotPasswordForm';
import Footer from '../common/Footer';

class ForgotPasswordPage extends React.Component {
  render() {
    return (
      <section className="login-content-wrap">
        <section className="login-box-wrap">
          <h1 className="login-brand">
            <img src={require('../../assets/images/brand.png')} alt=""/><span>Smart Clinical Trials</span>
          </h1>
          <div className="login-box">
            <div className="head">
              <h2>Forgot Password</h2>
            </div>
            <div className="login-form">
              <ForgotPasswordForm/>
            </div>
          </div>
        </section>
        <Footer/>
      </section>
    );
  }
}
export default ForgotPasswordPage;
