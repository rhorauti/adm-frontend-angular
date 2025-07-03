import { WritableSignal } from '@angular/core';

export interface IRequestlogin {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface IResponseLogin {
  date: string;
  status: boolean;
  message: string;
  data: {
    id: number;
    name: string;
    email: string;
    token: string;
  };
}

export interface IRequestSignUp {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface IResponseSignUp {
  date: string;
  status: boolean;
  message: string;
  data: {
    id: number;
    name: string;
    email: string;
    avatar: string;
    createdAt: string;
  };
}

export interface IFormValidationNewPassword {
  passwordLettersValidation: boolean;
  passwordUpperCaseValidation: boolean;
  passwordNumberValidation: boolean;
  passwordSymbolValidation: boolean;
  confirmPasswordValidation: boolean;
}

export interface IFormValidationSignUp extends IFormValidationNewPassword {
  nameValidation: boolean;
  emailValidation: boolean;
}

export interface IRequestNewPassword {
  token: string | null;
  password: WritableSignal<string>;
  confirmPassword: WritableSignal<string>;
}

export interface IRequestNewPasswordHttp {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface IAuthStore {
  id: number;
  name: string;
  email: string;
}
