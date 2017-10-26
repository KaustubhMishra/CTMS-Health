import * as types from '../actions/actionTypes';
import initialState from './initialState';
import {browserHistory} from 'react-router';
// IMPORTANT: Note that with Redux, state should NEVER be changed.
// State is considered immutable. Instead,
// create a copy of the state passed and set new values on the copy.
// Note that I'm using Object.assign to create a copy of current state
// and update values on the copy.
export default function sideEffects(state = initialState.sideEffects, action) {
  switch (action.type) {
    case types.LOAD_SIDE_EFFECTS_SUCCESS:
      return action.sideEffects;

    case types.CREATE_SIDE_EFFECT_SUCCESS:
      return [
        ...state,
        Object.assign({}, action.sideEffect)
      ];

    /*case types.UPDATE_SIDE_EFFECT_SUCCESS:{
      console.log(state);
      console.log(action);
      const newState = Object.assign([], state);
      return [
        ...state.filter(sideEffect => sideEffect.id !== action.sideEffect.id),
        Object.assign({}, action.sideEffect)
      ];
    }*/

    case types.DELETE_SIDE_EFFECT_SUCCESS:{
      const newState = Object.assign([], state);
      const indexOfProductionLineToDelete = state.rows.findIndex(sideEffect => {
          return sideEffect.id === action.sideEffect.id;
        });
        newState.rows.splice(indexOfProductionLineToDelete, 1);
        return newState;
    }

    /*case types.DELETE_SIDE_EFFECT_SUCCESS:{
      console.log(state);
      console.log(action);
      return state.filter(sideEffect =>
        sideEffect.id !== action.sideEffect.id
      );
    }*/

    case types.LOAD_STATE_LIST:
      return action.stateList;

    default:
      return state;
  }
}
