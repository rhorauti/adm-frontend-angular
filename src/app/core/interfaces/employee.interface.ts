import { PartialCompany } from './company.interface';
import { IDepartment, PartialDept } from './department.interface';
import { IBaseResponse } from './response.interface';

export interface IEmployeeHome {
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

export interface IEmployeeForm {
  idEmployee: number | null;
  isDefault: boolean;
  name: string;
  cpf?: string | null;
  email?: string | null;
  deskphone?: string | null;
  cellphone?: string | null;
  photoUrl?: string | null;
  company?: PartialCompany | null;
  departmentList?: PartialDept[];
  department?: PartialDept | null;
  employeePositionList?: PartialEmployeePosition[];
  employeePosition?: PartialEmployeePosition | null;
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

export type PartialEmployee = Pick<IEmployeeHome, 'idEmployee' | 'name'>;

export interface IResponseEmployee extends IBaseResponse {
  data?: IEmployeeHome | IEmployeeHome[];
}

export type PartialEmployeePosition = Pick<IEmployeePosition, 'idEmployeePosition' | 'name'>;

export interface IEmployeePosition {
  idEmployeePosition: number | null;
  name: string;
  comment: string;
}

export interface IEmployeePositionResponse extends IBaseResponse {
  data?: IEmployeePosition | IEmployeePosition[];
}
