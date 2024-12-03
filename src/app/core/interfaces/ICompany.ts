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

export interface IModalForm {
  isActive: boolean;
  isInputClear: boolean;
  isEditForm: boolean;
}

export interface IModalCheck {
  isActive: boolean;
  isActionOk: boolean;
}

export interface ICompanyGroup extends IBaseGroup {
  companyType: TableTypeNumber;
  companyTableHeaders: ITableHeader[];
  companiesData: ICompany[];
  companyData: ICompany;
  initialTableData: ICompany[];
  modalFormCompany: IModalForm;
  modalCheckCompany: IModalCheck;
}

export interface ICompanyItemGroup extends IBaseGroup {
  adressTableHeaders: ITableHeader[];
  employeeTableHeaders: ITableHeader[];
  initialAddressTableData: IAddress[];
  addressesData: IAddress[];
  addressData: IAddress;
  initialEmployeeTableData: IEmployee[];
  employeesData: IEmployee[];
  employeeData: IEmployee;
  modalFormAddress: IModalForm;
  modalFormEmployee: IModalForm;
  modalCheckAddress: IModalCheck;
  modalCheckEmployee: IModalCheck;
}
