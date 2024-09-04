import { IAddress } from './IAddress';
import { ITableHeader } from './ITableHeader';
import { IEmployee } from './IEmployee';
import { IBaseGroup, TableTypeNumber } from './IBase';

export interface ICompany {
  idCompany: number;
  date: string;
  type: number;
  nickname: string;
  name: string;
  cnpj: string;
  ie: string;
  im: string;
}

export interface ICompanyGroup extends IBaseGroup {
  companyType: TableTypeNumber;
  companyTableHeaders: ITableHeader[];
  companiesData: ICompany[];
  companyData: ICompany;
}

export interface ICompanyItemGroup extends IBaseGroup {
  adressTableHeaders: ITableHeader[];
  employeeTableHeaders: ITableHeader[];
  addressesData: IAddress[];
  addressData: IAddress;
  employeesData: IEmployee[];
  employeeData: IEmployee;
}
