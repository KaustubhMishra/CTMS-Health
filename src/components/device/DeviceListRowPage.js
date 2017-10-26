import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import * as sponsorActions from '../../actions/sponsorActions';
import cookies from 'react-cookie';

const DeviceListRowPage = ({deviceListData, DeleteDevice}) => {
  return (
    <tr className="grey">
      <td>{deviceListData.name}</td>
      <td>{deviceListData.manufacturer}</td>
      <td>{deviceListData.firmware}</td>
      <td>{deviceListData.version}</td>
      <td>
        <Link to={'/deviceListData/' + deviceListData.id}><i className="fa fa-pencil" aria-hidden="true"></i></Link> &nbsp;&nbsp;
        <button className="btn-btn-danger" data-modal-id="compeleteModal" onClick={() => DeleteDevice(deviceListData)} >
          <i className="fa fa-trash" aria-hidden="true"></i>
        </button>
      </td>
    </tr>
  );

};

DeviceListRowPage.propTypes = {
  deviceListData: PropTypes.object.isRequired
};

export default DeviceListRowPage;
