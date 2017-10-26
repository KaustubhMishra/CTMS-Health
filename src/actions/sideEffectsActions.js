import sideEffectsApi from '../api/sideEffectsApi';
import * as types from './actionTypes';
import {beginAjaxCall, ajaxCallError} from './ajaxStatusActions';
import {createStore} from 'redux';
import sideEffects from '../reducers/sideEffectsReducer';


const store =  createStore(sideEffects);

export function loadSideEffectsSuccess(sideEffects) {
  return {type: types.LOAD_SIDE_EFFECTS_SUCCESS, sideEffects};
}

export function createSideEffectSuccess(sideEffect) {
  return {type: types.CREATE_SIDE_EFFECT_SUCCESS, sideEffect};
}

export function updateSideEffectSuccess(sideEffect) {
  console.log(sideEffect);
  return {type: types.UPDATE_SIDE_EFFECT_SUCCESS, sideEffect};
}

export function deleteSideEffectSuccess(sideEffect) {
  return {type: types.DELETE_SIDE_EFFECT_SUCCESS, sideEffect};
}

export function loadSideEffects(search) {
  console.log(search);
  return function (dispatch) {
    dispatch(beginAjaxCall());
    return sideEffectsApi.getAllSideEffects(search).then(sideEffects => {
      dispatch(loadSideEffectsSuccess(sideEffects));
    }).catch(error => {
      throw(error);
    });
  };
}

export function saveSideEffect(sideEffect) {
  console.log(sideEffect);
  return function (dispatch, getState) {
    dispatch(beginAjaxCall());
    return sideEffectsApi.saveSideEffect(sideEffect).then(response => {
      console.log(response);
      sideEffect.id ? dispatch(updateSideEffectSuccess(response)) : dispatch(createSideEffectSuccess(response));
    }).catch(error => {
      dispatch(ajaxCallError(error));
      throw(error);
    });
  };
}

export function loadSideEffectById(id) {
  console.log(id);
  return function (dispatch) {
    dispatch(beginAjaxCall());
    return sideEffectsApi.getSideEffectById(id).then(sideEffect => {
      return sideEffect;
    }).catch(error => {
      throw(error);
    });
  };
}

export function deleteSideEffect(sideEffect) {
  return function (dispatch, getState) {
    dispatch(beginAjaxCall());
    return sideEffectsApi.deleteSideEffect(sideEffect).then(() => {
      console.log(sideEffect);
      dispatch(deleteSideEffectSuccess(sideEffect));
      //deleteSideEffectSuccess(sideEffect);
      return;
    }).catch(error => {
      /*dispatch(ajaxCallError(error));
      throw(error);*/
    });
  }
}

