import deviceApi from '../api/deviceApi';
import * as types from './actionTypes';
import {beginAjaxCall} from './ajaxStatusActions';

export function loadDeviceListSuccess(deviceList) {
  return {type: types.LOAD_DEVICE_SUCCESS, deviceList};
}

export function loadAllDeviceListDataSuccess(deviceData) {
  return {type: types.LOAD_ALL_DEVICE_LIST_DATASUCCESS, deviceData};
}

export function createDevice(device) {
  return {type:types.CREATE_DEVICE, device};
}

export function deleteDeviceSuccess(device) {
  return {type: types.DELETE_DEVICE_SUCCESS, device};
}

export function updateDeviceSuccess(device) {
  return {type: types.UPDATE_DEVICE_SUCCESS, device};
}

export function loadDeviceList() {
  return dispatch => {
    dispatch(beginAjaxCall());
    return deviceApi.getAllDeviceList().then(deviceList => {
     // dispatch(loadDeviceListSuccess(deviceList));
     return deviceList;
    }).catch(error => {
      throw(error);
    });
  };
}

export function addDevice(deviceData, imageData) {
  console.log(deviceData.id);
  return dispatch => {
    dispatch(beginAjaxCall());
    return deviceApi.saveDeviceDataInfo(deviceData, imageData).then(deviceList => {
      deviceData.id ? dispatch(updateDeviceSuccess(deviceList)) : dispatch(createDevice(deviceList));
    }).catch(error => {
      throw(error);
    });
  };
}

export function loadDeviceById(id) {
  console.log(id);
  return function (dispatch) {
    dispatch(beginAjaxCall());
    return deviceApi.getDeviceById(id).then(user => {
      return user;
    }).catch(error => {
      throw(error);
    });
  };
}

export function loadDeviceData(search) {
  return dispatch => {
    dispatch(beginAjaxCall());
    return deviceApi.getAllDeviceData(search).then(response => {
      dispatch(loadAllDeviceListDataSuccess(response));
    }).catch(error => {
      throw(error);
    });
  };
}

export function deleteDevice(device) {
  console.log("Delete device Actions Comes");
  console.log(device);
  return function (dispatch, getState) {
    dispatch(beginAjaxCall());
    return deviceApi.deleteDeviceData(device).then(() => {
      dispatch(deleteDeviceSuccess(device));
      return;
    }).catch(error => {
      //ispatch(ajaxCallError(error));
      //throw(error);
    });
  }
}