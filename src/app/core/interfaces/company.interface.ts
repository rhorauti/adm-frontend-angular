import { IAddress } from './address.interface';
import { IEmployeeHome, IEmployeePayload } from './employee.interface';
import { IBaseResponse } from './response.interface';

export type PartialCompany = Pick<ICompany, 'idCompany' | 'name'>;

export interface ICompany {
  idCompany: number | null;
  nickname: string;
  name: string;
  cnpj?: string;
  ie?: string;
  im?: string;
}

export interface ICompanyDetail {
  company: ICompany;
  address: IAddress;
  employee: IEmployeeHome | IEmployeePayload;
}

export interface ICompanyResponse extends IBaseResponse {
  data: ICompany[];
}

export interface ICompanyDetailedDataResponse extends IBaseResponse {
  data: ICompanyDetail;
}
