import delay from './delay';
import axios from 'axios';
import _ from 'lodash';
import * as types from '../actions/actionTypes';
import cookies from 'react-cookie';

let sideEffects = [];


class sideEffectsApi {
  static getAllSideEffects(search) {
    return new Promise((resolve, reject) => {
        axios.post('/getsideEffect', search).then(response => {
          sideEffects = Object.assign([], response.data.data);
          console.log(sideEffects);
          resolve(sideEffects);
        }).catch(error => {
          throw(error);
        });

      //}, delay);
    });
  }

  static getSideEffectById(id) {
    console.log(id);
    var data = {
      id: id
    };
    return new Promise((resolve, reject) => {
      axios.post('/getSideEffectById', data).then(response => {
        console.log(response.data);
        resolve(response.data);
      }).catch(error => {
        throw(error);
      });
    });
  }
  
  static saveSideEffect(sideEffect) {
    console.log(sideEffect);
    return new Promise((resolve, reject) => {
        if (sideEffect.id) {
          axios.put(`/updatesideEffect/${sideEffect.id}`,sideEffect).then(response => {
            console.log(sideEffect);
            resolve(Object.assign({}, sideEffect));
          }).catch(error => {
            throw(error);
          });
        } else {
          axios.post('/addsideEffect',sideEffect).then(response => {
            resolve(response.data.data);
          }).catch(error => {
            throw(error);
          });
        }
    });
  }

  static deleteSideEffect(sideEffect) {
    return new Promise((resolve, reject) => {
            axios.delete(`/deletesideEffect/${sideEffect.id}`).then(response => {
              console.log(sideEffects);
              resolve(Object.assign({}, sideEffect));
            }).catch(error => {
              throw(error);
            });
    });
  }

}

export default sideEffectsApi;
