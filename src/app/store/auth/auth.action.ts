import { IAuthStore } from '@core/api/interfaces/IAuth';
import { createAction, props } from '@ngrx/store';

export const authDataStore = createAction(
  '[Login Page] User Auth',
  props<{ authData: IAuthStore }>()
);
