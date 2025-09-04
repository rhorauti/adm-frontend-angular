import { IPagination } from './pagination.interface';
import { ITableCheckbox, ITableHeader } from './table.interface';

export type FilterHelp<T> = { inputSearch: string } & Record<keyof T, string>;

export interface IBaseRegisterStore<T> {
  /**
   * A flag used to indicate that the data is a copy to insert new data.
   */
  isCopiedData: boolean;
  /**
   * A flag used to indicate that the data is a edit data.
   */
  isEditData: boolean;
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
  tableHeaders: ITableHeader<T>[];
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
  initialData: T[];
  /**
   * A array of objects used to display data in the table.
   */
  dataList: T[];
  /**
   * An object used to retrieve information from forms.
   */
  data: T;
  /**
   * A flag used to toggle the delete button´s disabled property.
   */
  isDelBtnDisabled: boolean;
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
  filterBox: T;
  /**
   * An object used to display help information about what was searched in the filter side bar form.
   */
  filterHelp: FilterHelp<T>;
  /**
   * An object used to display the table´s pagination information.
   */
  pagination: IPagination;
}
