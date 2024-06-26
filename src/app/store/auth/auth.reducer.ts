import { createReducer, on } from '@ngrx/store';
import * as authActions from './auth.action';
import { IAuthStore } from '@core/api/interfaces/IAuth';

export const initialState: IAuthStore = {
  id: 0,
  name: '',
  email: '',
};

export const authReducer = createReducer(
  initialState,
  on(authActions.authDataStore, (state, { authData: userAuthData }) => ({
    id: userAuthData.id,
    name: userAuthData.name,
    email: userAuthData.email,
  }))
);
