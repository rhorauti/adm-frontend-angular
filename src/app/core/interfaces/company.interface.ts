import { IAddress } from './address.interface';
import { IEmployee } from './employee.interface';
import { IBaseResponse } from './response.interface';

export interface ICompany {
  idCompany: number;
  type: number;
  nickname: string;
  name: string;
  cnpj?: string;
  ie?: string;
  im?: string;
}

export interface ICompanyRequest {
  company: ICompany;
  address: IAddress;
  employee: IEmployee;
}

export interface IResponseCompany extends IBaseResponse {
  data: ICompany[];
}
