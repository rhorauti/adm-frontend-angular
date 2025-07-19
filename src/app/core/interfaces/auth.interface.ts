import { WritableSignal } from '@angular/core';

export interface IRequestlogin {
  email: string;
  password: string;
}

export interface IResponseLogin {
  date: string;
  status: boolean;
  message: string;
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

export interface IResponseSignUp {
  date: string;
  status: boolean;
  message: string;
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

export interface IAuthStore {
  id: number;
  name: string;
  email: string;
}
