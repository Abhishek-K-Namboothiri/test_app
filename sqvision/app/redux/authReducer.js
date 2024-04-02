// authReducer.js

import { LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT } from './authActions';

const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  error: null,
  is_authenticated: false,
  organization:null
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        organization:action.payload.Organization,
        error: null,
        is_authenticated:true
      };
    case LOGIN_FAIL:
      return {
        ...state,
        user: null,
        accessToken: null,
        refreshToken: null,
        organization:null,
        error: action.payload,
        is_authenticated:false
      };
    case LOGOUT:
      return {
        ...state,
        user: null,
        accessToken: null,
        refreshToken: null,
        organization:null,
        error: null,
        is_authenticated:false
      };
    default:
      return state;
  }
};

export default authReducer;
