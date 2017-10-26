import React from 'react';
import EditableCell from './EditableCell';

const MedicationRow = ({medicationTime,onRowDel,onRowUpdate,index}) => {
   return (
      <div>
        <EditableCell onRowUpdate = {onRowUpdate} index={index} medicationTime={medicationTime}/>
      </div>
    );
};

MedicationRow.propTypes = {
 
};

export default MedicationRow;