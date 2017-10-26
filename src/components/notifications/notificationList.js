import React from 'react';
import { Link } from 'react-router';
import Header from '../common/Header';
import Leftmenu from '../common/Leftmenu';
import Footer from '../common/Footer';


class NotificationList extends React.Component {
    
    render() {
      return (
        <div>
          <Header/>
          <section id="container" className="container-wrap">
          <Leftmenu/>
            <section className="container-fluid">
              <section className="page-title">
                <div className="pull-left">
                  <h1>Notification</h1>
                  <div className="breadcrumbs">
                   <span>Notification</span><a>Notification List </a>
                  </div>
                </div>
              </section>
              <section className="box-trials">
                <div className="head">
                  <h2>Notifications</h2>
                </div>
                <div className="at-panel">
                  <div className="at-panel-body">
                    <p>Hey John you missed to take the Morning dose on 10/06/2017.</p>
                    <div className="ending-on">
                      <span>27 February, 2017</span>
                    </div>
                  </div>
                </div>
                <div className="at-panel">
                  <div className="at-panel-body">
                    <p>Hey John you missed to take the Afternoon dose on 10/06/2017.</p>
                    <div className="ending-on">
                      <span>27 February, 2017</span>
                    </div>
                  </div>
                </div>
                <div className="at-panel">
                  <div className="at-panel-body">
                    <p>Hey John you missed to take the Night dose on 10/06/2017.</p>
                    <div className="ending-on">
                      <span>27 February, 2017</span>
                    </div>
                  </div>
                </div>
                <div className="at-panel">
                  <div className="at-panel-body">
                    <p>Hey John you missed to take the Afternoon dose on 11/06/2017.</p>
                    <div className="ending-on">
                      <span>27 February, 2017</span>
                    </div>
                  </div>
                </div>
                <div className="at-panel">
                  <div className="at-panel-body">
                    <p>Hey John you missed to take the Night dose on 101/06/2017.</p>
                    <div className="ending-on">
                      <span>27 February, 2017</span>
                    </div>
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

export default NotificationList;
