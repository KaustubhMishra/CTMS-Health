import delay from './delay';
import axios from 'axios';
import _ from 'lodash';
import * as types from '../actions/actionTypes';
import cookies from 'react-cookie';
import toastr from 'toastr';

let sponsors = [];
let sponsorsSelectList = [];
let sponsorsSelectListDSMB = [];

class SponsorApi {
  static getAllSponsors(search) {
    return new Promise((resolve, reject) => {
        axios.post('/getsponsor', search).then(response => {
          sponsors = Object.assign([], response.data.data);
          resolve(sponsors);
        }).catch(error => {
          throw(error);
        });

      //}, delay);
    });
  }

  static getSponsorsById(id) {
    var data = {
      id: id
    };
    return new Promise((resolve, reject) => {
        axios.post('/getsponsorById', data).then(response => {
          //sponsors = Object.assign([], response.data.data);
          //console.log(sponsors);
          resolve(response.data);
        }).catch(error => {
          throw(error);
        });

      //}, delay);
    });
  }
  
  static getAllSelectSponsors() {
    return new Promise((resolve, reject) => {
        axios.get('/getallsponsors').then(response => {
          sponsorsSelectList = Object.assign([], response.data.data);
          resolve(sponsorsSelectList);
        }).catch(error => {
          throw(error);
        });

      //}, delay);
    });
  }

  static saveSponsor(sponsor) {
    return new Promise((resolve, reject) => {
        let userCompanyID = cookies.load('usercompanyid');
        sponsor.company_id = userCompanyID;
        if (sponsor.id) {
          //const existingSponsorIndex = sponsors.findIndex(a => a.id == sponsor.id);
          //sponsors.splice(existingSponsorIndex, 1, sponsor);

          axios.put(`/updatesponsor/${sponsor.id}`,sponsor).then(response => {
            //sponsors.splice(existingSponsorIndex, 1, sponsor);
            if(response.data.status == true) {
                resolve(Object.assign({}, sponsor));
                resolve(response.data.data);
            } else {
                reject(response.data.message);
            }

          }).catch(error => {
            throw(error);
          });
        } else {
          axios.post('/addsponsor',sponsor).then(response => {
            //sponsors.push(response.data.data);
            if(response.data.status == true)
              {
                resolve(response.data.data);
              }

            else
                {
                  reject(response.data.message);
                }
          })
        }
    });
  }

  static deleteSponsor(sponsor) {
    return new Promise((resolve, reject) => {
          axios.delete(`/deletesponsor/${sponsor.id}`).then(response => {
            if(response.data.status != false)
            {
              resolve(Object.assign({}, sponsor));
            }
            else {
              toastr.error(response.data.message);
            }
              
            }).catch(error => {
              throw(error);
          });
    });
  }

  static getStateList(id) {
    var data = {
      id: id
    };
    return new Promise((resolve, reject) => {
      axios.post("/getStateList", data).then(function(response) {
        if(response.data.status == true)
          {
            resolve(response.data.data);
          }
          else
            {
              reject(response.data);
            }
      })
    });
  }

  static getDSMBSponsors() {
    var basicToken = "Bearer "+ cookies.load('access_token');

    var config = {
      headers: {
            'Content-Type': 'application/json',
            'Authorization': basicToken
          }
    };

    return new Promise((resolve, reject) => {
        axios.get('/getSponsorsDSMB', config).then(response => {
          sponsorsSelectList = Object.assign([], response.data.data);
          resolve(sponsorsSelectList);
        }).catch(error => {
          throw(error);
        });

      //}, delay);
    });
  }

  static getCROSponsors() {
    var basicToken = "Bearer "+ cookies.load('access_token');

    var config = {
      headers: {
            'Content-Type': 'application/json',
            'Authorization': basicToken
          }
    };

    return new Promise((resolve, reject) => {
        axios.get('/getSponsorsCRO', config).then(response => {
          sponsorsSelectList = Object.assign([], response.data.data);
          resolve(sponsorsSelectList);
        }).catch(error => {
          throw(error);
        });

      //}, delay);
    });
  }

  
  
}

export default SponsorApi;
