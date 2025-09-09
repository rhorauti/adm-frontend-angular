import { IDepartment } from './department.interface';
import { IBaseResponse } from './response.interface';

export interface IEmployee {
  idEmployee: number | null;
  isDefault: boolean;
  name: string;
  cpf?: string;
  email?: string;
  deskphone?: string;
  cellphone?: string;
  photoUrl?: string;
  company?: string;
  department?: string | null;
  position?: string | null;
}

export interface IEmployeePayload {
  idEmployee: number | null;
  isDefault: boolean;
  name: string;
  cpf?: string;
  email?: string;
  deskphone?: string;
  cellphone?: string;
  photoUrl?: string;
  department?: IDepartment | null;
  employeePosition?: IEmployeePosition | null;
}

// export type IEmployeePayload = Omit<IEmployee, 'photoUrl' | 'employeePosition'> & {
//   imgPreview?: FormData | null;
//   employeePosition?: IEmployeePosition;
// };

export interface IResponseEmployee extends IBaseResponse {
  data?: IEmployee | IEmployee[];
}

export interface IEmployeePosition {
  idEmployeePosition: number | null;
  name: string;
  comment: string;
}

export interface IEmployeePositionResponse extends IBaseResponse {
  data?: IEmployeePosition[];
}
