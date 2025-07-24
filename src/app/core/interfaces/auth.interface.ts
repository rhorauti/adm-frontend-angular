import { WritableSignal } from '@angular/core';
import { IBaseResponse } from './response.interface';

export interface IRequestlogin {
  email: string;
  password: string;
}

export interface IResponseLogin extends IBaseResponse {
  data: {
    id: number;
    name: string;
    email: string;
    photoUrl?: string;
    token: string;
  };
}

export interface IRequestSignUp {
  name: string;
  email: string;
  password: string;
  photoUrl?: string;
}

export interface IResponseSignUp extends IBaseResponse {
  data: {
    id: number;
    name: string;
    email: string;
    photoUrl?: string;
    createdAt: string;
  };
}

export interface IRequestNewPassword {
  token: string | null;
  password: WritableSignal<string>;
  confirmPassword: WritableSignal<string>;
}
