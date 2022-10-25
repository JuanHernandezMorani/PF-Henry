import axios from "axios";
import Swal from "sweetalert2";
import {
  GET_OWNERSHIPS,
  GET_USERS,
  LOADING,
  GET_DETAIL,
  CLEAR_DETAIL,
  REMOVE_OWNERSHIP,
  REMOVE_USER,
  FILTER_BY,
  ORDER_OWNERSHIPS,
  POST_PROPERTY,
  GET_STATUS_LOGIN,
  FILTER_CARDS,
  MERCADO_PAGO,
  MERCADO_PAGO_ID,
  MERCADO_PAGO_PAYMENT_SATUS,
  LOGIN_USER,
  EXIT_SESSION,
  LOGIN_USER_AUTH0,
  USER_STATUS,
} from "./common";

export function GetOwnerships() {
  return async function (dispatch) {
    dispatch({ type: LOADING });
    const res = await axios.get(`https://proyecto-final.up.railway.app/ownerships`);
    return dispatch({
      type: GET_OWNERSHIPS,
      payload: res.data,
    });
  };
}

export function GetUsers() {
  return async function (dispatch) {
    dispatch({ type: LOADING });
    const res = await axios.get(`https://proyecto-final.up.railway.app/users`);
    return dispatch({
      type: GET_USERS,
      payload: res.data,
    });
  };
}

export function filterBy(filters) {
  return function (dispatch) {
    return dispatch({
      type: FILTER_BY,
      payload: filters,
    });
  };
}

// export function filterByType(type) {
//   return function (dispatch) {
//     return dispatch({
//       type: FILTER_BY_TYPE,
//       payload: type,
//     });
//   };
// }

export function orderOwnerships(payload) {
  return function (dispatch) {
    return dispatch({
      type: ORDER_OWNERSHIPS,
      payload: payload,
    });
  };
}

export function postProperty(payload) {
  console.log(payload);
  return async function (dispatch) {
    const response = await axios.post("https://proyecto-final.up.railway.app/ownerships/", {
      name: payload.name,
      location: payload.location,
      rooms: payload.rooms,
      garage: payload.garage,
      type: payload.type,
      m2: payload.m2,
      rating: 5,
      expenses: payload.expenses,
      seller: "Enzo",
      description: "De chill",
      images: payload.images,
      state: payload.state,
      price: payload.price,
      floors: payload.floors,
      reviews: ["a", "b"],
      address: payload.address,
    });
    return dispatch({
      type: POST_PROPERTY,
      payload: response.data,
    });
  };
}

export function getDetail(id) {
  return async function (dispatch) {
    try {
      const response = await axios.get(`https://proyecto-final.up.railway.app/ownerships/${id}`);
      return dispatch({
        type: GET_DETAIL,
        payload: response.data,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error 404",
        text: "Ownership info dont found, see if it exist first.",
      });
    }
  };
}

export function clearDetail() {
  return {
    type: CLEAR_DETAIL,
  };
}
export function removeOwnership(id) {
  return async function (dispatch) {
    try {
      const response = await axios.delete(`https://proyecto-final.up.railway.app/deleteOwnerships/${id}`);
      return dispatch({
        type: REMOVE_OWNERSHIP,
        payload: response.data,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error 412",
        text: "Cant delete ownership",
        footer: "Check if ownership id is correct, and try again",
      });
    }
  };
}

export function GetStatusLogin(e) {
  return {
    type: GET_STATUS_LOGIN,
    payload: e,
  };
}

export function filterCards(search) {
  return async function (dispatch) {
    try {
      const newHouses = await axios.get(`https://proyecto-final.up.railway.app/ownerships?${search}`);
      if (newHouses.data.length === 0) throw new Error("No se encontró ninguna casa");
      return dispatch({
        type: FILTER_CARDS,
        payload: newHouses.data,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error 412",
        text: "No se encontro ninguna casa",
        footer: "Check if ownership id is correct, and try again",
      });
    }
  };
}

export function UserRegister(payload) {
  return async function (dispatch) {
    const newUser = await axios.post("https://proyecto-final.up.railway.app/users/register", payload);
    return newUser;
  };
}

export function LoginUser(payload) {
  return async function (dispatch) {
    const LoginUser = await axios.post("https://proyecto-final.up.railway.app/login", payload);
    localStorage.setItem("UserLogin", JSON.stringify(LoginUser.data));
    return dispatch({
      type: LOGIN_USER,
      payload: "USUARIO LOGUEADO",
    });
  };
}

export function ExitSession() {
  return async function (dispatch) {
    const ExitSession = await axios.get("https://proyecto-final.up.railway.app/logout");
    localStorage.removeItem("UserLogin");
    return dispatch({
      type: EXIT_SESSION,
      payload: "USUARIO NO LOGUEADO",
    });
  };
}

export function mercadoPago(payload) {
  return async function (dispatch) {
    console.log(payload);
    try {
      const response = await axios.post("https://proyecto-final.up.railway.app/payment", payload);
      console.log(response.data.preferenceId);
      return dispatch({
        type: MERCADO_PAGO,
        payload: response.data.preferenceId,
      });
    } catch (error) {
      console.log(error);
    };
  };
};

export function mercadoPagoId() {
  return async function (dispatch) {
    try {
      const response = await axios.get("http://localhost:3001/payment/paymentId");
      return dispatch({
        type: MERCADO_PAGO_ID,
        payload: response.data.id
      });
    }catch (error){
      console.log(error);
    };
  };
};

export function mercadoPagoPayment(id) {
  return async function (dispatch) {
    try {
      const response = await axios.get(`https://api.mercadopago.com/v1/payments/${id}/?access_token=${process.env.ACCESS_TOKEN}`);
      const paymentStatus = {
        status: response.status,
        status_detail: response.status_detail,
      };
      return dispatch({
        type: MERCADO_PAGO_PAYMENT_SATUS,
        payload: paymentStatus
      })
    } catch (error) {
      console.log(error);
    };
  };
};

export function LoginUserAuth0(payload) {
  return async function (dispatch) {
    const LoginUserAuth0 = await axios.post("https://proyecto-final.up.railway.app/login/auth0", payload);
    localStorage.setItem("UserLogin", JSON.stringify(LoginUserAuth0.data));
    console.log(LoginUserAuth0.data);
    return {
      type: LOGIN_USER_AUTH0,
      payload: "USUARIO AUTH0 LOGUEADO",
    };
  };
}
export function LoginStatus() {
  const userLogin = JSON.parse(localStorage.getItem("UserLogin"));
  if (!userLogin) {
    return {
      type: USER_STATUS,
      payload: "No Logueado",
    };
  } else {
    return {
      type: USER_STATUS,
      payload: "Logueado",
    };
  }
}
