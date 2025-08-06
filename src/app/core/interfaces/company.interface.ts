import { IAddress } from './address.interface';
import { IEmployee } from './employee.interface';
import { IFilterBoxCompany, IFilterHelpCompany } from './filter.interface';
import { IPagination } from './pagination.interface';
import { IBaseResponse } from './response.interface';
import { ITableCheckbox, ITableHeader } from './table.interface';

export interface ICompany {
  idCompany: number;
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

export interface ICompanyStore {
  /**
   * An input search value used to filter the table.
   */
  inputSearchValue: string;
  /**
   * A flag used to toggle the table´s header filter box.
   */
  isTableHeaderBoxActive: boolean;
  /**
   * Table´s headers object
   */
  tableHeaders: ITableHeader<ICompany>[];
  /**
   * Table´s header and body checkbox object.
   */
  tableCheckbox: ITableCheckbox;
  /**
   * An array of booleans used to toggle each table row´s context menu.
   */
  tableItemsBox: boolean[];
  /**
   * An initial companiesData that retrieve data from database.
   */
  initialTableData: ICompany[];
  /**
   * A array of objects used to display data in the table.
   */
  companiesData: ICompany[];
  /**
   * A flag used to toggle the delete button´s disabled property.
   */
  isDelBtnDisabled: boolean;
  /**
   * An object used to retrieve information from forms.
   */
  companyData: ICompany;
  /**
   * A flag used to toggle the table´s data filter box.
   */
  isFilterBoxActive: boolean;
  /**
   * A flag used to display a message to the user when filter result has no match.
   */
  isFilterResultZeroRegister: boolean;
  /**
   * An object used to retrieve information from filter sidebar form.
   */
  filterBox: IFilterBoxCompany;
  /**
   * An object used to display help information about what was searched in the filter side bar form.
   */
  filterHelp: IFilterHelpCompany;
  /**
   * An object used to display the table´s pagination information.
   */
  pagination: IPagination;
}
