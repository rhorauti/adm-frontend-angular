import { IBaseResponse } from './response.interface';

export interface IEmployee {
  idEmployee: number;
  isDefault: boolean;
  name: string;
  cpf?: string;
  department?: string;
  position?: string;
  email?: string;
  deskphone?: string;
  cellphone?: string;
  photoUrl?: string;
}

export interface IResponseEmployee extends IBaseResponse {
  data?: IEmployee;
}

export interface IEmployeePosition {
  idEmployeePosition: number;
  name: string;
  comment: string;
}

export interface IEmployeePositionResponse extends IBaseResponse {
  data?: IEmployeePosition;
}

export interface IEmployeePositionListResponse extends IBaseResponse {
  data?: IEmployeePosition[];
}
