import React, {PropTypes} from 'react';
import {Link} from 'react-router';

const SideEffectsListRow = ({sideEffect,onDeletesideEffect}) => {
  return (
    <tr className="grey">
      <td>{sideEffect.name}</td>
       <td>
        <Link to={'/sideEffect/' + sideEffect.id}><i className="fa fa-pencil" aria-hidden="true"></i></Link> &nbsp;&nbsp;
        <button type="button" className="btn-btn-danger js-open-modal" href="javascript:void(0)" 
                                data-toggle="modal" data-target="#deleteModal" data-modal-id="deleteModal" 
             onClick={() => onDeletesideEffect(sideEffect)}>
            <i className="fa fa-trash" aria-hidden="true"></i></button>
      </td>
    </tr>
  );
};

SideEffectsListRow.propTypes = {
  sideEffect: PropTypes.object.isRequired,
  onDeletesideEffect: PropTypes.func.isRequired
};

export default SideEffectsListRow;
