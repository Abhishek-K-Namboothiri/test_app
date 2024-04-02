import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as  api from '../constants/apiConf';

// Action types
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAIL = 'LOGIN_FAIL';
export const LOGOUT = 'LOGOUT';


// Store tokens
const storeTokens = async (accessToken, refreshToken) => {
  try {
    await AsyncStorage.setItem('access_token', accessToken);
    await AsyncStorage.setItem('refresh_token', refreshToken);
  } catch (error) {
    console.error('Error storing tokens:', error);
  }
};

// Retrieve tokens
const getTokens = async () => {
  try {
    const accessToken = await AsyncStorage.getItem('access_token');
    const refreshToken = await AsyncStorage.getItem('refresh_token');
    return { accessToken, refreshToken };
  } catch (error) {
    console.error('Error retrieving tokens:', error);
    return { accessToken: null, refreshToken: null };
  }
};

// Clear tokens (e.g., on logout)
const clearTokens = async () => {
  try {
    await AsyncStorage.removeItem('access_token');
    await AsyncStorage.removeItem('refresh_token');
  } catch (error) {
    console.error('Error clearing tokens:', error);
  }
};

// Action creators
export const login = (credentials) => {
  console.log(credentials)
  return async (dispatch) => {
    try {
      // Make an API request to authenticate
      const response = await axios.post(api.LOGIN, credentials);
      
      // Assuming the API returns a user object on success
      // const user = response.data;
      console.log(123,response)
      const user  = response.data;
      const accessToken = user.access_token
      const refreshToken =user.refresh_token
      // console.log(accessToken, refreshToken, user)
      storeTokens(accessToken, refreshToken);
      
      dispatch({
        type: LOGIN_SUCCESS,
        payload: { user, accessToken, refreshToken },
      });
    } catch (error) {
      console.log(api.LOGIN)
      console.log(error)
      dispatch({
        type: LOGIN_FAIL,
        payload: error.response.data.message?error.response.data.message:"invalid user/role",
      });
    }
  };
};

export const logout = () => {
  clearTokens();
  return {
  type: LOGOUT,

}
};
