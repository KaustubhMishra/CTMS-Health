import React from 'react';
import { Link } from 'react-router';
import Header from '../common/Header';
import Leftmenu from '../common/Leftmenu';
import Footer from '../common/Footer';


class Reports extends React.Component {

  render() {
    return (
      <div>
        <Header/>
        <section id="container" className="container-wrap">
        <Leftmenu/>
          <section className="container-fluid">
            <section className="page-title">
              <div className="pull-left">
                <h1>Report</h1>
                <div className="breadcrumbs">
                 <span>Report</span><a>Reports </a>
                </div>
              </div>
            </section>
            <section className="box-trials">
              <div className="head">
                <h2>Coming Soon</h2>
              </div>
            </section>
          </section>
          <Footer/>
        </section>
      </div>
    );
  }
}

export default Reports;
