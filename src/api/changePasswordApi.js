import axios from 'axios';
import cookies from 'react-cookie';

class ChangePasswordApi {
  
  static changePassword(data) {
    console.log(data);
    var userPassword = {
        currentpassword: data.oldPassword,
        newpassword: data.newPassword
    };
    console.log(data);
    var basicToken = "Bearer "+ cookies.load('access_token');
    var config = {
      headers: {
            'Content-Type': 'application/json',
            'Authorization': basicToken
          }
    };
    console.log(basicToken);
    return new Promise((resolve, reject) => {
      axios.post("/api/site/updatePassword",userPassword,config)
      .then(function(response) {
        if(response.data.status == true)
          {
            resolve(response.data.data);
          }
          else
            {
              reject(response.data.message);
            }
      })
    });
  }
}

export default ChangePasswordApi;





