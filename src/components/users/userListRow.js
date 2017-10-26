import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import * as sponsorActions from '../../actions/sponsorActions';
import cookies from 'react-cookie';
import { Conditional } from 'react-conditional-render';


const UserListRow = ({user, DeleteUser, HandleChange, disableUser}) => {

  return (
    <tr className="grey">
      <td>{user.firstname} {user.lastname}</td>
      <td>{user.email}</td>
      <td>{user.role.name}</td>
      <td>
        <label className="switch1">
          <Conditional condition={user.role.name != 'CRO'}>
            <input type="checkbox"
              name="disableUser"
              onChange={e=>HandleChange(e, user.id )}
              checked={user.active}
            />
          </Conditional>
          <div className="slider round">
          </div>
        </label>
      </td>
      <td>
        <Link to={'/user/' + user.id}><i className="fa fa-pencil" aria-hidden="true"></i></Link> &nbsp;&nbsp;
        <Conditional condition={user.role.name != 'CRO'}>  
          <button className="btn-btn-danger" data-modal-id="compeleteModal" onClick={() => DeleteUser(user)}>
            <i className="fa fa-trash" aria-hidden="true"></i>
          </button>
        </Conditional>
      </td>
    </tr>
  );

};

UserListRow.propTypes = {
  user: PropTypes.object.isRequired
};

export default UserListRow;
