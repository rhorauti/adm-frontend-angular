import { IAdress } from './IAdress';
import { IProject } from './IProject';
import { ITableHeader } from './ITableHeader';
import { IEmployee } from './IEmployee';

export interface ICompany {
  idCompany: number;
  type: number;
  date: string;
  nickname: string;
  name: string;
  cnpj: string;
}

export interface IResponseCompany {
  date: string;
  status: boolean;
  message: string;
  data: ICompany[];
}

export interface ICompanyGroup {
  companyType: number | null;
  arrayTab: string[];
  arraySelectFilter: string[];
  inputValueFilter: string;
  selectValueFilter: string;
  placeholderFilter: string;
  tabIndex: number;
  isHeaderBoxActive: boolean;
  tableHeaders: ITableHeader[];
  initialTableData: ICompany[];
  companiesData: ICompany[];
  companyData: ICompany;
  tableIdx: number;
  qtyPerPage: number;
}

export interface ICompanyItemGroup {
  arrayTab: string[];
  arraySelectFilter: string[];
  inputValueFilter: string;
  selectValueFilter: string;
  placeholderFilter: string;
  tabIndex: number;
  isHeaderBoxActive: boolean;
  tableHeaderSelected: ITableHeader[];
  adressTableHeaders: ITableHeader[];
  projectTableHeaders: ITableHeader[];
  employeeTableHeaders: ITableHeader[];
  initialTableData: ICompany[] | IAdress[] | IProject[] | IEmployee[];
  tableDataSelected: ICompany[] | IAdress[] | IProject[] | IEmployee[];
  adressData: IAdress;
  projectData: IProject;
  employeeData: IEmployee;
  tableIdx: number;
  qtyPerPage: number;
}

export type ICompanyPageGroup = ICompany | IAdress | IProject | IEmployee;
