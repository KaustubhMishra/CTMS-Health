import React, {PropTypes} from 'react';
import {Link} from 'react-router';

const SponsorListRow = ({sponsor, onDeletSponsor}) => {
  return (
    <tr className="grey">
      <td>{sponsor.sponsor_company}</td>
      <td>{sponsor.contact_name}</td>
      <td>{sponsor.email_address}</td>
      <td>{sponsor.city}</td>
      <td>{sponsor.state}</td>
      <td>
        <Link to={'/sponsor/' + sponsor.id}><i className="fa fa-pencil" aria-hidden="true"></i></Link> &nbsp;&nbsp;
        <button type="button" className="btn-btn-danger" 
             data-toggle="modal" data-target="#myModal" onClick={() => onDeletSponsor(sponsor)} >
            <i className="fa fa-trash" aria-hidden="true"></i></button>
      </td>
    </tr>
  );
};

SponsorListRow.propTypes = {
  sponsor: PropTypes.object.isRequired
};

export default SponsorListRow;
