import { IBaseResponse } from './response.interface';

export interface IEmployee {
  idEmployee: number;
  isDefault: boolean;
  name: string;
  cpf?: string;
  email?: string;
  deskphone?: string;
  cellphone?: string;
  photoUrl?: string;
  idDepartment?: number;
  idCompany?: number;
  employeePosition?: IEmployeePosition;
}

export type IEmployeePayload = Omit<IEmployee, 'photoUrl'> & {
  imgPreviewUrl?: File | null;
  employeePosition?: IEmployeePosition;
};

export interface IResponseEmployee extends IBaseResponse {
  data?: IEmployee | IEmployee[];
}

export interface IEmployeePosition {
  idEmployeePosition: number;
  name: string;
  comment: string;
}

export interface IEmployeePositionResponse extends IBaseResponse {
  data?: IEmployeePosition | IEmployeePosition[];
}
