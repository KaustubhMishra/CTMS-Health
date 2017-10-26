import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import TextInput from '../common/TextInput';
import TextArea from '../common/TextArea';
import TextDate from '../common/TextDate';
import SelectInput from '../common/SelectInput';
import MilestoneListRow from '../milestone/MilestoneListRow';
import moment from 'moment';
import DateTimeField from 'react-bootstrap-datetimepicker';

const MilestoneList = ({Phaseindex,onMilestoneChange,singleMilestone,singleUpdateMilestone,
                          phaseInfo,onEditMilestone,onDeleteMilestone,addMileStone,updateMileStone,
                          onMilestoneEditChange,
                          clearMilestone}) => {
  return (
    <div>
        <div className="overflow">
         <a className="js-open-modal btn btn-border set-width mb-10 btn-sm" 
              data-toggle="modal" 
              data-target={ "#Addmilestone" + Phaseindex } 
              data-modal-id={ "Addmilestone" + Phaseindex } >
             <i className="fa fa-plus mr-5"></i>Add More Milestones
         </a> 
        </div>
     <div className="modal fade" id={ "Addmilestone" + Phaseindex } role="dialog">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal">&times;</button>
                  <h4 className="modal-title">Add Milestones</h4>
                </div>
                <div className="modal-body">
                    <div className="phase-form-row">
                       <label>Milestone Name:</label>
                       <div className="input-field">
                          <TextInput name="name" 
                                     placeholder="Milestone Name"
                                     onChange={ e=> onMilestoneChange(e, Phaseindex)}
                                     error={phaseInfo.milestoneerrors.name} 
                                     value={singleMilestone.name}
                                      />
                        </div>
                  </div>
                  <div className="phase-form-row">
                      <label>Milestone Description:</label>
                      <div className="textarea-field pull-left">
                              <TextArea name="description" 
                                        placeholder="Milestone Description"
                                        onChange={ e=> onMilestoneChange(e, Phaseindex)} 
                                        error={phaseInfo.milestoneerrors.description}
                                        value={singleMilestone.description}
                                       />
                      </div>
                  </div>
                <div className="clearfix">
                  <div className="phase-form-row pull-left overflow-visible start-date-field">
                    <label>Start Date:</label>
                    <div className="date-picker">
                      <div id="datetimeMilestoneStart" className={"input-group date milestone-startDate" + Phaseindex}>
                        <TextDate 
                          type="text" 
                          name="start_date"
                          value={singleMilestone.start_date} 
                          onBlur={e=> onMilestoneChange(e, Phaseindex)}
                          error={phaseInfo.milestoneerrors.start_date}
                        />
                        <span className="input-group-addon">
                          <i className="glyphicon glyphicon glyphicon-calendar"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="phase-form-row pull-left overflow-visible end-date-field">
                    <label>End Date:</label>
                    <div className="date-picker">
                      <div id="datetimeMilestoneEnd" className={"input-group date milestone-endDate" + Phaseindex}>
                        <TextDate 
                          type="text" 
                          name="tentitive_end_date"
                          value={singleMilestone.tentitive_end_date} 
                          onBlur={e=> onMilestoneChange(e, Phaseindex)}
                          error={phaseInfo.milestoneerrors.tentitive_end_date}
                        />
                        <span className="input-group-addon">
                          <i className="glyphicon glyphicon glyphicon-calendar"></i>
                        </span>
                      </div>
                    </div>
                  </div> 
                </div>  
                </div>
                <div className="modal-footer">
                  <div className="btn-group">
                    <input className="btn blue set-width"  id="Save" value="Save" type="submit"
                          onClick={() => addMileStone(Phaseindex)}
                    />
                    <input className="btn blue set-width js-modal-close" 
                          id="Cancel" data-dismiss="modal" value="Cancel" type="submit"
                          onClick={() => clearMilestone(Phaseindex)}/>
                  </div>
                </div>
              </div>
            </div>
    </div>
    <div className="modal fade" id={ "Editmilestone" + Phaseindex } role="dialog">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal">&times;</button>
                  <h4 className="modal-title">Update Milestones</h4>
                </div>
                <div className="modal-body">
                    <div className="phase-form-row">
                       <label>Milestone Name:</label>
                       <div className="input-field">
                          <TextInput name="name" 
                                     placeholder="MileStone Name"
                                     onChange={ e=> onMilestoneEditChange(e, Phaseindex)}
                                     error={phaseInfo.milestoneerrors.name} 
                                     value={singleUpdateMilestone.name}
                                      />
                        </div>
                  </div>
                  <div className="phase-form-row">
                      <label>Milestone Description:</label>
                      <div className="textarea-field pull-left">
                              <TextArea name="description" 
                                        placeholder="Milestone Description"
                                        onChange={ e=> onMilestoneEditChange(e, Phaseindex)} 
                                        error={phaseInfo.milestoneerrors.description}
                                        value={singleUpdateMilestone.description}
                                       />
                      </div>
                  </div>
                  <div className="clearfix">
                  <div className="phase-form-row pull-left overflow-visible start-date-field">
                    <label>Start Date:</label>
                    <div className="date-picker">
                      <div id="datetimeMilestoneStart" className={"input-group date milestone-startDate" + Phaseindex}>
                        <TextDate 
                          type="text" 
                          name="start_date"
                          value={singleUpdateMilestone.start_date} 
                          onBlur={e=> onMilestoneEditChange(e, Phaseindex)}
                          error={phaseInfo.milestoneerrors.start_date}
                        />
                        <span className="input-group-addon">
                          <i className="glyphicon glyphicon glyphicon-calendar"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="phase-form-row pull-left overflow-visible end-date-field">
                    <label>End Date:</label>
                    <div className="date-picker">
                      <div id="datetimeMilestoneEnd" className={"input-group date milestone-endDate" + Phaseindex}>
                        <TextDate 
                          type="text" 
                          name="tentitive_end_date"
                          value={singleUpdateMilestone.tentitive_end_date} 
                          onBlur={e=> onMilestoneEditChange(e, Phaseindex)}
                          error={phaseInfo.milestoneerrors.tentitive_end_date}
                        />
                        <span className="input-group-addon">
                          <i className="glyphicon glyphicon glyphicon-calendar"></i>
                        </span>
                      </div>
                    </div>
                  </div> 
                </div>   
                </div>
                <div className="modal-footer">
                  <div className="btn-group">
                    <input className="btn blue set-width"  id="Save" value="Save" type="submit"
                          onClick={() => updateMileStone(Phaseindex)}
                    />
                    <input className="btn blue set-width js-modal-close" id="Cancel" data-dismiss="modal" 
                          value="Cancel" type="submit"
                          onClick={() => clearMilestone(Phaseindex)}/>
                  </div>
                </div>
              </div>
            </div>
    </div>
     <div className="pt-data-table">
        <table id="grdMilestone" className="table table-striped table-bordered" width="100%" cellspacing="0">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Description</th> 
                    <th>Start Date</th> 
                    <th>End Date</th>   
                    <th>Edit</th>
                    <th>Delete</th>
                </tr>
            </thead>
            <tbody>
                     {
                        phaseInfo.milestone.map((MilestoneData, Mindex) =>
                              <MilestoneListRow key={Mindex} 
                                  milestone={MilestoneData} 
                                  Mindex={Mindex}
                                  Pindex={Phaseindex} 
                                  onEditMilestone = {onEditMilestone} 
                                  onDeleteMilestone = {onDeleteMilestone} 
                              />
                       )
                    }
                    
            </tbody>
        </table>
     </div>  
   </div>   
  );
};

MilestoneList.propTypes = {
  onDeleteMilestone: PropTypes.func.isRequired,
  onEditMilestone: PropTypes.func.isRequired,
};

export default MilestoneList;

