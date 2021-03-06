import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import TextInput from '../common/TextInput';
import TextArea from '../common/TextArea';
import SelectInput from '../common/SelectInput';
import DeviceListRow from '../device/DeviceListRow';

const DeviceList = ({deviceList,onDeviceChanged,onAddDevices,device,onDeleteDevice,onCancelDevices,trial,UsertimeZone}) => {
  return (
    <div>
         <div className="overflow">
         <a id="btnAddDevice"
              className="js-open-modal btn btn-border set-width mb-10 btn-sm" 
              data-toggle="modal" 
              data-target="#AddDevice" 
              data-modal-id="AddDevice" >
             <i className="fa fa-plus mr-5"></i>Add More Devices
         </a> 
        </div>

        <div className="modal fade" id="AddDevice" role="dialog">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title">Add Devices</h4>
                </div>
                <div className="modal-body">
                   <div className="pt-data-table">
                    <table id="grdDevice" className="table table-striped table-bordered" width="100%" cellspacing="0">
                        <thead>
                            <tr>
                                <th>Select</th>
                                <th>Name</th>
                                <th>Manufacturer</th> 
                                <th>Firmware</th> 
                                <th>Version</th>  
                            </tr>
                        </thead>
                        <tbody>
                                  {

                                    deviceList.map((DeviceData, index) =>
                                              <tr>
                                                <td>
                                                  <div className="checkbox-field">
                                                    <input type="checkbox" 
                                                          id={ "device" + index} className="css-checkbox"
                                                          onChange={ e=> onDeviceChanged(e, index,DeviceData)}
                                                    />
                                                    <label htmlFor={ "device" + index } className="css-label">&nbsp;</label>
                                                    </div>
                                                </td>
                                                <td>{DeviceData.name}</td>
                                                <td>{DeviceData.manufacturer}</td>
                                                <td>{DeviceData.firmware}</td>
                                                <td>{DeviceData.version}</td>
                                            </tr>
                                   )
                                }
                                
                        </tbody>
                    </table>
                  </div>
                
                </div>
                <div className="modal-footer">
                  <div className="btn-group">
                    <input className="btn blue set-width js-modal-close" 
                            data-dismiss="modal" id="Save" 
                            value="Save" type="submit"
                          onClick={() => onAddDevices()}
                    />
                    <input className="btn blue set-width js-modal-close" id="Cancel" 
                          data-dismiss="modal" value="Cancel" type="submit"
                          onClick={() => onCancelDevices()}/>


                  </div>
                </div>
              </div>
            </div>
    </div>
     <div className="pt-data-table">
        <table  className="table table-striped table-bordered" width="100%" cellspacing="0">
            <thead>
                <tr>
                     <th>Name</th>
                      <th>Manufacturer</th> 
                      <th>Firmware</th> 
                      <th>Version</th> 
                      <th>Delete</th>
                </tr>
            </thead>
            <tbody>
                     {
                        device.map((DeviceData, index) =>
                              <DeviceListRow key={index} 
                                  device={DeviceData} 
                                  index={index} 
                                  onDeleteDevice = {onDeleteDevice}
                                  trial = {trial}
                                  UsertimeZone = {UsertimeZone}
                              />
                        )
                    }
                    
            </tbody>
        </table>
     </div>
   </div>   
  );
};

DeviceList.propTypes = {
 onDeviceChanged : PropTypes.func.isRequired,
 onAddDevices: PropTypes.func.isRequired,
 onCancelDevices: PropTypes.func.isRequired,
};

export default DeviceList;
