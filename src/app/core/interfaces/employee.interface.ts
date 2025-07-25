import { IBaseResponse } from './response.interface';

export interface IEmployee {
  isDefault: boolean;
  idEmployee: number;
  name: string;
  cpf?: string;
  department?: string;
  position?: string;
  email?: string;
  deskphone?: string;
  cellphone?: string;
}

export interface IResponseEmployee extends IBaseResponse {
  data?: IEmployee;
}
