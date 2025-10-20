export interface ITableHeader<T> {
  id: number;
  isHeaderActive: boolean;
  sortDirection: number;
  icon: string;
  headerName: string;
  databaseField: keyof T;
}

export interface ITableCheckbox {
  header: boolean;
  body: boolean[];
}

export interface ITableBody<T> {
  /**
   * Data that is received from parent component
   */
  data: T;
  /**
   * Icon shown in case of a status from a task
   */
  statusIcon?: {
    /**
     * Status of the task
     */
    status: string;
    /**
     * Icon of the status
     */
    iconName: string;
    /**
     * Background color of the status
     */
    backgroundColor: string;
  };
  /**
   * Property that controls check status of body checkbox
   */
  isBodyCheckboxChecked: boolean;
  /**
   * Property that controls visibility of pop up of each table row.
   */
  isRowPopUpActive: boolean;
  /**
   * Property that controls visibility of modal check icon in case of a selection modal.
   */
  isModalCheckIconChecked: boolean;
}
