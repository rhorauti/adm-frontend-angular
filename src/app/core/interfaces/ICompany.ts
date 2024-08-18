import { IAddress } from './IAddress';
import { IProject } from './IProject';
import { ITableHeader } from './ITableHeader';
import { IEmployee } from './IEmployee';
import { IBaseGroup } from './IBase';

export interface ICompany {
  idCompany: number | null;
  type: number;
  date: string;
  nickname: string;
  name: string;
  cnpj: string;
}

export interface ICompanyGroup extends IBaseGroup {
  companyType: number | null;
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
