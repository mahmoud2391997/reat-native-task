import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import counterReducer from './counterSlice';
import productReducer from './productSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    counter: counterReducer,
    products: productReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;