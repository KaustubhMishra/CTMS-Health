import delay from './delay';
import axios from 'axios';
import _ from 'lodash';
import * as types from '../actions/actionTypes';
import cookies from 'react-cookie';

const request = require('superagent-bluebird-promise');
var basicToken = "Basic "+ cookies.load('basicToken');

let deviceList = [];
let deviceListData =[];

class deviceApi {
  static getAllDeviceList() {
    return new Promise((resolve, reject) => {
        axios.get('/getdevicelist').then(response => {
          deviceList = Object.assign([], response.data.data);
          resolve(deviceList);
        }).catch(error => {
          throw(error);
        });
    });
  }

  static saveDeviceDataInfo(deviceData, imageData) {
    return new Promise((resolve, reject) => {
      if (deviceData.id) {
        let data = new FormData();
        data.append('file', imageData);
        data.append('deviceData', JSON.stringify(deviceData));
        request.put(`/api/site/updateDevice/${deviceData.id}`)
          .send(data)
          .set({'Authorization': basicToken})
          .then(response => {
            resolve(Object.assign({}, response));
          }).catch(error => {
            throw(error);
          });
      } 
      else {
        let req = request.post('/api/site/saveDeviceData')
        .attach('file', imageData, imageData.name)
        .field(deviceData)
        .set({'Authorization': basicToken});
        req.then(response => {
          resolve(response.body.data);
        }).catch(error => {
            console.log(error);
        });
      }
      
    });
  }

  static getAllDeviceData(search) {
    return new Promise((resolve, reject) => {
        axios.post('/api/site/getDeviceList', search).then(response => {
          deviceListData = Object.assign([], response.data.data);
          resolve(deviceListData);
        }).catch(error => {
          throw(error);
        });
    });
  }

  static getDeviceById(id) {
    console.log(id);
    var data = {
      id: id
    };
    return new Promise((resolve, reject) => {
      axios.post('/getdeviceById', data).then(response => {
        console.log(response.data);
        resolve(response.data);
      }).catch(error => {
        throw(error);
      });
    });
  }

  static deleteDeviceData(device) {
    return new Promise((resolve, reject) => {
      axios.delete(`/api/site/deleteDevice/${device.id}`).then(response => {
        resolve(Object.assign({}, device));
      })
      .catch(error => {
        throw(error);
      });
    });
  }
}

export default deviceApi;
