import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import TextInput from '../common/TextInput';
import TextArea from '../common/TextArea';
import SelectInput from '../common/SelectInput';
import moment from 'moment';

const MilestoneListRow = ({milestone,Mindex,Pindex,onEditMilestone,onDeleteMilestone}) => {
  return (
    <tr>
      <td>{milestone.name}</td>
      <td>{milestone.description}</td>
      <td>{moment(milestone.start_date).format("MM/DD/YYYY")}</td>
      <td>{moment(milestone.tentitive_end_date).format("MM/DD/YYYY")}</td>
      <td>
        <button type="button" className="btn btn-primary btn-sm" 
                              data-toggle="modal" 
                              data-target={ "#Editmilestone" + Pindex } 
                              data-modal-id={ "Editmilestone" + Pindex }
                              onClick={() => onEditMilestone(milestone,Mindex,Pindex)}>Edit</button>
      </td>
      <td>
        <button type="button" className="btn btn-primary btn-sm" 
                              onClick={() => onDeleteMilestone(milestone,Mindex,Pindex)}>Delete</button>
      </td>
    </tr>
  );

};

MilestoneListRow.propTypes = {
  milestone: PropTypes.object.isRequired,
  onDeleteMilestone: PropTypes.func.isRequired,
  onEditMilestone: PropTypes.func.isRequired
};

export default MilestoneListRow;

