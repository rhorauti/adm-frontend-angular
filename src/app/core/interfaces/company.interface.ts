import { IAddress } from './address.interface';
import { IEmployee } from './employee.interface';
import { IBaseResponse } from './response.interface';

export interface ICompany {
  idCompany: number;
  nickname: string;
  name: string;
  cnpj?: string;
  ie?: string;
  im?: string;
}

export interface ICompanyDetail {
  company: ICompany;
  address: IAddress;
  employee: IEmployee;
}

export interface ICompanyResponse extends IBaseResponse {
  data: ICompany[];
}

export interface ICompanyDetailedDataResponse extends IBaseResponse {
  data: ICompanyDetail;
}
