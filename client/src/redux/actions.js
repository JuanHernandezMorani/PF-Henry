import axios from 'axios';
import Swal from 'sweetalert2';
import { GET_OWNERSHIPS, GET_USERS, LOADING, GET_DETAIL, CLEAR_DETAIL, REMOVE_OWNERSHIP, REMOVE_USER } from "./common";

export default function GetOwnerships() {
  return async function (dispatch) {
    dispatch({ type: LOADING, payload });
    const res = await axios.get(`http://localhost:3001/ownerships`);
    return dispatch({
      type: GET_OWNERSHIPS,
      payload: res.data,
    });
  };
}


export function GetUsers(){
    return async function (dispatch){
        dispatch({type: LOADING, payload});
        const res = await axios.get(`http://localhost:3001/users`)
        return dispatch({
            type: GET_USERS,
            payload: res.data,
        })
    }
}

export function getDetail(id) {
  return async function(dispatch){
      try{
      const response = await axios.get(`http://localhost:3001/ownerships/${id}`)
      return dispatch({
          type: GET_DETAIL,
          payload: response.data
      })
      } catch (error) {
          Swal.fire({
              icon: 'error',
              title: 'Error 404',
              text: 'Ownership info dont found, see if it exist first.'
          })
      }
  }
}

  export function clearDetail(){
    return {
        type: CLEAR_DETAIL
    }
  }
  export function removeOwnership(id){
    return async function(dispatch){
        try{        
        const response = await axios.delete(`http://localhost:3001/deleteOwnerships/${id}`);
        return dispatch({
            type: REMOVE_OWNERSHIP,
            payload: response.data
        })}
        catch(error){
            Swal.fire({
                icon: 'error',
                title: 'Error 412',
                text: 'Cant delete ownership',
                footer: 'Check if ownership id is correct, and try again'
            })
        }
    }
  }
  
  export function removeUser(id){
    return async function(dispatch){
        try{        
        const response = await axios.delete(`http://localhost:3001/deleteUsers/${id}`);
        return dispatch({
            type: REMOVE_USER,
            payload: response.data
        })}
        catch(error){
            Swal.fire({
                icon: 'error',
                title: 'Error 412',
                text: 'Cant delete user',
                footer: 'Check if user id is correct, and try again'
            })
        }
    }
  }