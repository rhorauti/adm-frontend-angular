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
    email: string;
    token: string;
  };
}

export interface IRequestSignUp {
  name: WritableSignal<string>;
  email: WritableSignal<string>;
  password: WritableSignal<string>;
  confirmPassword: WritableSignal<string>;
}

export interface IRequestSignUpHttp {
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
    email: string;
    avatar: string;
    createdAt: string;
  };
}

export interface IFormValidation {
  nameValidation: WritableSignal<boolean>;
  emailValidation: WritableSignal<boolean>;
  passwordLettersValidation: WritableSignal<boolean>;
  passwordUpperCaseValidation: WritableSignal<boolean>;
  passwordNumberValidation: WritableSignal<boolean>;
  passwordSymbolValidation: WritableSignal<boolean>;
  confirmPasswordValidation: WritableSignal<boolean>;
}

export interface IFormValidationNewPassword {
  passwordLettersValidation: WritableSignal<boolean>;
  passwordUpperCaseValidation: WritableSignal<boolean>;
  passwordNumberValidation: WritableSignal<boolean>;
  passwordSymbolValidation: WritableSignal<boolean>;
  confirmPasswordValidation: WritableSignal<boolean>;
}

export interface IRequestNewPassword {
  token: string | null;
  password: WritableSignal<string>;
  confirmPassword: WritableSignal<string>;
}

export interface IRequestResetPassword {
  email: string;
}

export interface IRequestNewPasswordHttp {
  token: string;
  password: string;
  confirmPassword: string;
}
