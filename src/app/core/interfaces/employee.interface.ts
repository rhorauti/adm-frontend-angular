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
