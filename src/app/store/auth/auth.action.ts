import { IAuthStore } from '@core/interfaces/IAuth';
import { createAction, props } from '@ngrx/store';

export const authDataStore = createAction(
  '[Login Page] Authenticate',
  props<{ authData: IAuthStore }>()
);
