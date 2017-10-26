import React from 'react';
import LoginForm from './LoginForm';
import Footer from '../common/Footer';


class LoginPage extends React.Component {
  render() {
    return (
    	<section className="login-content-wrap">
			<section className="login-box-wrap">
				<h1 className="login-brand">
					<img src={require('../../assets/images/brand.png')} alt=""/><span>Smart Clinical Trials</span>
				</h1>
				<div className="login-box">
					<div className="head">
						<h2>Admin Login</h2>
					</div>
					<div className="login-form">
						<LoginForm />
					</div>
				</div>
			</section>
			<Footer/>
		</section>
    );
  }
}

export default LoginPage;
