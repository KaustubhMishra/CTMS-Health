import React, {PropTypes} from 'react';
import SponsorListRow from './SponsorListRow';

const SponsorList = ({sponsors,onDeletSponsor}) => {
  return (
    <table id="example" className="table table-striped table-bordered" cellspacing="0" width="100%">
      <thead>
      <tr>
        <th>Company</th>
        <th>Name</th>
        <th>Email</th>
        <th>City</th>
        <th>State</th>
        <th>Action</th>
      </tr>
      </thead>
      <tbody>
      {sponsors.map(sponsor =>
        <SponsorListRow key={sponsor.id} sponsor={sponsor} onDeletSponsor={onDeletSponsor}/>
      )}
      </tbody>
    </table>
  );
};

SponsorList.propTypes = {
  sponsors: PropTypes.array.isRequired,
  onDeletSponsor: PropTypes.func.isRequired
};

export default SponsorList;
