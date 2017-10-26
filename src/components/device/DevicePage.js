import React from 'react';
import { Link, browserHistory } from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Header from '../common/Header';
import Leftmenu from '../common/Leftmenu';
import Footer from '../common/Footer';
import DeviceListPage from './DeviceListPage';
import Pagination from "react-js-pagination";
import * as deviceActions from '../../actions/deviceActions';
import toastr from 'toastr';
import { Conditional } from 'react-conditional-render';

let search = {
  params: {
    "pageNumber": 1,
    "pageSize": 10
  }
};

class DevicePage extends React.Component {
    constructor(props, context) {
      super(props, context);
      this.state ={
        search:search
      };
      this.getAllDeviceList(search);
      this.deleteSelectedDevice = this.deleteSelectedDevice.bind(this);
    }

    handlePageChange(pageNumber) {
      console.log(pageNumber)
      this.setState({activePage: pageNumber});
      this.state.search.params.pageNumber = pageNumber;
      this.getAllDeviceList(this.state.search);  
    }

    getAllDeviceList(search) {
      this.props.deviceActions.loadDeviceData(search);
     // this.props.deviceActions.loadDeviceList();
    }

    deleteSelectedDevice(device) {
      console.log(device);
      if(confirm("Are you sure you want to delete Device ?")){
        if(device)
        {
          this.props.deviceActions.deleteDevice(device)
          .then(() => this.redirect(),
         $ ('#myModal').modal("hide"))
          .catch(error => {
            toastr.error(error);
            this.setState({saving: false});
          });
        }
        else {
          return false;
        }
      }
    }

    redirect() {
      let data = {
        params: {
          "pageNumber": 1,
          "pageSize": 10
        }
      };
      this.getAllDeviceList(data);
      console.log(this.props.deviceListDataCount);
      this.setState({saving: false});
      browserHistory.push('/deviceList');
      toastr.success('Device Deleted Successfully.');
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
                      <h1>Device</h1>
                      <div className="breadcrumbs">
                       <span>Device</span><a>Device List </a>
                      </div>
                    </div>
                    <div className="pull-right right-head">
                      <Link to="/addDevice" className="btn btn-border pull-left"> Add Device</Link>                        
                    </div>
                  </section>
                  <section className="box-trials">
                    <div className="head">
                      <h2>Device List</h2>
                    </div>
                    <div className="pt-data-table">
                      <DeviceListPage deviceListData={this.props.deviceListData} DeleteDevice={this.deleteSelectedDevice} />
                    </div>
                    <div className="pull-right">
                      <Conditional condition={this.props.deviceListDataCount > 10}>
                        <Pagination
                          activePage={this.state.search.params.pageNumber}
                          itemsCountPerPage={this.state.search.params.pageSize}
                          totalItemsCount={this.props.deviceListDataCount}
                          pageRangeDisplayed={5}
                          onChange={this.handlePageChange}
                        />
                      </Conditional>
                    </div>
                  </section>
                </section>
                <Footer/>
              </section>
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {

  console.log(state);
  return {   
    deviceListData: !_.isUndefined(state.DeviceListData.rows) ? state.DeviceListData.rows : state.DeviceListData,
    deviceListDataCount: !_.isUndefined(state.DeviceListData.count) ? state.DeviceListData.count : state.DeviceListData       
  };
}


function mapDispatchToProps(dispatch) {
  return {
    deviceActions: bindActionCreators(deviceActions, dispatch)
    
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DevicePage);
