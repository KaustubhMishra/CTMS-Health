import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as deviceGroupActions from '../../actions/deviceGroupActions';
import * as deviceActions from '../../actions/deviceActions';
import DeviceForm from './DeviceForm';
import {browserHistory, Link} from 'react-router';
import toastr from 'toastr';
import Header from '../common/Header';
import Leftmenu from '../common/Leftmenu';
import validateInput from '../common/validations/deviceGroupValidation';
import cookies from 'react-cookie';
import Footer from '../common/Footer';
import { Conditional } from 'react-conditional-render';
import {deviceGroupFormattedForDropdown} from '../../selectors/selectors';

let showimagePreview = false;
let deviceId = '';
export class ManageDevicePage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      device: Object.assign({}, this.props.device),
      file:'',
      imagePreviewUrl: '',
      errors: {},
      saving: false
    };

    this.getDeviceGroup();
    this.getDeviceById();
    this.saveDevice = this.saveDevice.bind(this);
    this.updateDeviceState = this.updateDeviceState.bind(this);
    this._handleImageChange = this._handleImageChange.bind(this);
  }

  isValid() {
    const { errors, isValid } = validateInput(this.state.device);

    if (!isValid) {
      this.setState({ errors });
    }

    return isValid;
  }

  updateDeviceState(event) {
    const field = event.target.name;
    let device = this.state.device;
    device[field] = event.target.value;
    return this.setState({device: device});
  }
    
  saveDevice(event) {
    console.log("Save Device Request Come");
    event.preventDefault();
    if (this.isValid()) {
      console.log('validations success');
    this.setState({ errors: {} });
    this.props.deviceActions.addDevice(this.state.device, this.state.file)
      .then(() => this.redirect())
      .catch(error => {
        toastr.error(error);
        this.setState({saving: false});
      });
    }
  }

  getDeviceById() {
    if(deviceId) {
      this.props.deviceActions.loadDeviceById(deviceId).then(response =>{
        if(response.status == false){
          this.context.router.push('/deviceList');
        }else{
          console.log(response.data);
          if(response.data.device_image == '') {
            showimagePreview = false;
          } else {
            showimagePreview = true;
          }
          this.setState({device: response.data});
        }
      })
      .catch(error => {console.log('ERROR');
        toastr.error(error);
      });
    } 
  }


  redirect() {
    this.setState({saving: false});
    console.log(this.state);
    if(this.props.params.id)
      toastr.success('Device Updated.');
    else
      toastr.success('Device Saved.');
    
    this.context.router.push('/deviceList');
  }

  _handleImageChange(e) {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    showimagePreview = true;
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

  getDeviceGroup() {
    $(document).ready(function(){
      $('[data-toggle="tooltip"]').tooltip();   
    });
    this.props.deviceGroupActions.loadDeviceGroupList();
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
                <Conditional condition={this.props.params.id == undefined}>
                  <div className="breadcrumbs">
                    <span>Device</span><a>Add Device</a>
                  </div>
                </Conditional>
                <Conditional condition={this.props.params.id != undefined}>
                  <div className="breadcrumbs">
                    <span>Device</span><a>Update Device</a>
                  </div>
                </Conditional>
              </div>
            </section>
            <div className="ma-box">
              <Conditional condition={this.props.params.id == undefined}>
                <div className="head">
                  <h2>Add Device</h2>
                </div>
              </Conditional>
              <Conditional condition={this.props.params.id != undefined}>
                <div className="head">
                  <h2>Update Device</h2>
                </div>
              </Conditional>
              <div className="account-box">
                <div className="row">
                  <div className="col s12">
                    <DeviceForm
                      device={this.state.device}
                      onChange={this.updateDeviceState}
                      fileEvent={this._handleImageChange}
                      onSave={this.saveDevice}
                      errors={this.state.errors}
                      saving={this.state.saving}
                      deviceGroupData={this.props.deviceGroupData}
                      imagePreviewUrl={this.state.imagePreviewUrl}
                      showimagePreview= {showimagePreview}
                    />
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

ManageDevicePage.propTypes = {
  device: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
};


ManageDevicePage.contextTypes = {
  router: PropTypes.object
};

function mapStateToProps(state, ownProps) {
  deviceId = ownProps.params.id;
  let device = {
    id: '', 
    name: '', 
    manufacturer: '', 
    firmware: '', 
    version:'',
    device_group_id:''
  };

  
  return {
    device: device,
    deviceGroupData: deviceGroupFormattedForDropdown(state.DeviceGroupList)
  }
}


function mapDispatchToProps(dispatch) {
  return {
    deviceActions: bindActionCreators(deviceActions, dispatch),
    deviceGroupActions: bindActionCreators(deviceGroupActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageDevicePage);
