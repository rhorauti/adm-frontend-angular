import { IAddress } from './address.interface';
import { PartialDept } from './department.interface';
import { PartialEmployeePosition } from './employee.interface';
import { IBaseResponse } from './response.interface';

export type PartialCompany = Pick<ICompanyHome, 'idCompany' | 'name'>;

export interface ICompanyHome {
  idCompany: number | null;
  nickname: string;
  name: string;
  cnpj?: string;
  ie?: string;
  im?: string;
}

export interface IEmployeeCompany {
  idEmployee: number | null;
  isDefault: boolean;
  name: string;
  email?: string;
  deskphone?: string;
  cellphone?: string;
  department?: PartialDept;
  employeePosition?: PartialEmployeePosition;
}

export interface ICompanyForm {
  idCompany: number | null;
  nickname: string;
  name: string;
  cnpj?: string;
  ie?: string;
  im?: string;
  address: IAddress;
  employee: IEmployeeCompany[];
  employeePositionList?: PartialEmployeePosition[];
  departmentList?: PartialDept[];
}

export interface ICompanyResponse extends IBaseResponse {
  data: ICompanyHome | ICompanyHome[];
}

export interface IResponseCompanyForm extends IBaseResponse {
  data: ICompanyForm | ICompanyForm[];
}
