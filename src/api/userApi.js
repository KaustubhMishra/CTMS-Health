import axios from 'axios';

let users = [];

class UserApi {
  
  static getUserList(search) {
    return new Promise((resolve, reject) => {
      axios.post("/getUserLists", search).then(function(response) {
        if(response.data.status == true)
          {
            users = Object.assign([], response.data.data);
            resolve(users);
          }
          else
            {
              reject(response.data);
            }
      })
    });
  }

  static saveUsersData(user) {
    console.log("Add User Api Request Come");

    return new Promise((resolve, reject) => {
      if(user.id) {
        console.log("Updated");
        axios.put(`/updateUser/${user.id}`,user).then(response => {
            //sponsors.splice(existingSponsorIndex, 1, sponsor);
            resolve(Object.assign({}, response));
          }).catch(error => {
            throw(error);
          });
      } else {
          console.log("Request Come for Save User ");
          axios.post("/addUser", user).then(function(response) {
            if(response.data.status == true)
              {
                resolve(response.data.data);
              }
              else
                {
                  console.log("Rejection");
                  console.log(response.data);
                  reject(response.data.message);
                }
          })
        }
    });
  }

  static getUserById(id) {
    console.log(id);
    var data = {
      id: id
    };
    return new Promise((resolve, reject) => {
      axios.post('/getuserById', data).then(response => {
        resolve(response.data);
      }).catch(error => {
        throw(error);
      });
    });
  }

  

  static deleteUser(user) {
    return new Promise((resolve, reject) => {
      axios.delete(`/deleteuser/${user.id}`).then(response => {
        resolve(Object.assign({}, user));
      })
      .catch(error => {
        throw(error);
      });
    });
  }

  static userEnableDisable(user, id) {
    var userData ={
      user: user,
      id: id
    };

    return new Promise((resolve, reject) => {
      axios.post("/disableEnable", userData).then(response => {
        resolve(response.data.data);
      })
      .catch(error => {
        throw(error);
      });
    });
  }

}

export default UserApi;
