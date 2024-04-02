import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import authReducer from './authReducer';

const rootReducer = {
  auth: authReducer,
  // Add more reducers as needed
};

const store = configureStore({
  reducer: rootReducer,
  middleware: [thunk],
});

export default store;
