import { IAddress } from './IAddress';
import { IProject } from './IProject';
import { ITableHeader } from './ITableHeader';
import { IEmployee } from './IEmployee';
import { IBaseGroup, TableTypeNumber } from './IBase';

export interface ICompany {
  idCompany: number;
  date: string;
  nickname: string;
  name: string;
  cnpj: string;
}

export interface ICompanyGroup extends IBaseGroup {
  companyType: TableTypeNumber;
  companyTableHeaders: ITableHeader[];
  companiesData: ICompany[];
  companyData: ICompany;
}

export interface ICompanyItemGroup extends IBaseGroup {
  adressTableHeaders: ITableHeader[];
  projectTableHeaders: ITableHeader[];
  employeeTableHeaders: ITableHeader[];
  addressData: IAddress;
  projectData: IProject;
  employeeData: IEmployee;
}
