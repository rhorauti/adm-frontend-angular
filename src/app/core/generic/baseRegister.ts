import { signal, Signal, WritableSignal } from '@angular/core';
import { HttpRequestService } from '@core/api/http-request.service';
import { IAddress } from '@core/interfaces/IAddress';
import {
  TableDataTypeString,
  TableItemType,
  TableTypeNumber,
  IBaseGroup,
} from '@core/interfaces/IBase';
import { ICompany } from '@core/interfaces/ICompany';
import { IEmployee } from '@core/interfaces/IEmployee';
import { IModal } from '@core/interfaces/IModal';
import { IProject } from '@core/interfaces/IProject';
import { ITableHeader } from '@core/interfaces/ITableHeader';
import { environment } from '@environments/environment';

interface TableTypeObject {
  company: ICompany;
  address: IAddress;
  project: IProject;
  employee: IEmployee;
}

export class BaseRegister {
  constructor(public httpRequestService: HttpRequestService) {}

  /**
   * showOptionList
   *
   * Define option list according to table header selected.
   * @param group
   */
  showOptionList(group: Signal<IBaseGroup>): void {
    group().arraySelectFilter = [];
    group().tableHeaderSelected.forEach(header => {
      if (header.showHeader) {
        group().arraySelectFilter.push(header.name);
        this.showInputPlaceholder(group);
      }
    });
  }

  /**
   * showInputPlaceholder
   *
   * Change filter´s input placeholder when change select value.
   * @param group
   */
  showInputPlaceholder(group: Signal<IBaseGroup>): void {
    group().placeholderFilter = `Digite um(a) ${group().selectValueFilter}`;
  }

  /**
   * changeSelectPlaceHolder
   * Get select value from app-input-addons component and change placeholder
   * @param value string. Value received from app-input-addons component
   */
  changeSelectPlaceHolder(baseGroup: Signal<IBaseGroup>, value: string) {
    baseGroup().placeholderFilter = `Digite um(a) ${value}`;
    baseGroup().selectValueFilter = value;
  }

  /**
   * showTableHeader
   * Show or hide column´s table according to checkbox click in table-header-box component.
   * @param header ITableHeader
   */
  showTableHeader(header: ITableHeader): void {
    header.showHeader = !header.showHeader;
  }

  isCompanySelected = false;
  companyId: number | null = 0;

  checkSelectedType(tableItemSelected: TableItemType): void {
    if (this.isTypeValid(tableItemSelected, 'company')) {
      this.isCompanySelected = true;
      this.companyId = tableItemSelected.idCompany;
    }
  }

  /**
   * isTypeValid
   * Type guard that check if received data is equal to interface provided.
   * @param data unknown. Data can change according to tab selection.
   * @returns boolean. If data is equals to interface provided, it returns true or else false.
   */
  isTypeValid<T extends keyof TableTypeObject>(data: unknown, type: T): data is TableTypeObject[T] {
    switch (type) {
      case 'company': {
        return (data as ICompany).idCompany != undefined;
      }
      case 'address': {
        return (data as IAddress).idAddress != undefined;
      }
      case 'employee': {
        return (data as IEmployee).idEmployee != undefined;
      }
      case 'project': {
        return (data as IProject).idProject != undefined;
      }
      default:
        return false;
    }
  }

  isModalCheckActive = signal(false);

  onModalFormBtnOkClick(): void {}

  isModalFormActive = signal(false);
  isEditForm = signal(false);

  showModalForm(): void {
    this.isModalFormActive.set(true);
  }

  closeModalForm(): void {
    if (this.isEditForm()) this.isEditForm.set(false);
    this.isClearInputForm.set(true);
    this.isModalFormActive.set(false);
  }

  /**
   *
   * @param tableItemSelected Object - Data related to table data selected
   * @param data Object - Data provided by the loop in HTML file
   */
  showModalEditForm(tableItemSelected: TableItemType, data: TableItemType): void {
    tableItemSelected = { ...data };
    this.isEditForm.set(true);
    this.isModalFormActive.set(true);
  }

  isClearInputForm = signal(false);

  showModalAskToDeleteCompany(
    tableItemSelected: TableItemType,
    tableItemNameSelected: TableDataTypeString
  ): void {
    switch (tableItemNameSelected) {
      case 'company': {
        if (this.isTypeValid(tableItemSelected, 'company')) {
          this.handleModal('confirmation', `Deseja excluir ${tableItemSelected.name}?`);
          this.isModalAskActive.set(true);
        }
        break;
      }
      case 'address': {
        if (this.isTypeValid(tableItemSelected, 'address')) {
          this.handleModal('confirmation', `Deseja excluir ${tableItemSelected.adress}?`);
          this.isModalAskActive.set(true);
        }
        break;
      }
      case 'employee': {
        if (this.isTypeValid(tableItemSelected, 'employee')) {
          this.handleModal('confirmation', `Deseja excluir ${tableItemSelected.name}?`);
          this.isModalAskActive.set(true);
        }
        break;
      }
      case 'project': {
        if (this.isTypeValid(tableItemSelected, 'project')) {
          this.handleModal('confirmation', `Deseja excluir ${tableItemSelected.code}?`);
          this.isModalAskActive.set(true);
        }
        break;
      }
    }
  }

  isModalAskActive = signal(false);
  isModalAskClickedBtnYes = false;

  onModalAskBtnNoClick(): void {
    this.isModalAskActive.set(false);
  }

  /**
   * onModalAskBtnClick
   *
   * Handle action of modalAsk button click. If click is yes, register will be added or updated. If click is no, modal will be closed.
   * @param tableItemSelected GroupType - Data provided by the loop in HTML file
   */
  onModalAskBtnYesClick(tableItemSelected: TableItemType): void {
    if (this.isTypeValid(tableItemSelected, 'company')) {
      if (tableItemSelected.idCompany != null) {
        this.updateRegister(tableItemSelected, 'company', tableItemSelected.idCompany);
        this.isEditForm.set(false);
      } else {
        this.addRegister(tableItemSelected, 'company');
      }
    } else if (this.isTypeValid(tableItemSelected, 'address')) {
      if (tableItemSelected.idAddress != null) {
        this.updateRegister(tableItemSelected, 'address', tableItemSelected.idAddress);
        this.isEditForm.set(false);
      } else {
        this.addRegister(tableItemSelected, 'address');
      }
    } else if (this.isTypeValid(tableItemSelected, 'employee')) {
      if (tableItemSelected.idEmployee != null) {
        this.updateRegister(tableItemSelected, 'employee', tableItemSelected.idEmployee);
        this.isEditForm.set(false);
      } else {
        this.addRegister(tableItemSelected, 'employee');
      }
    } else if (this.isTypeValid(tableItemSelected, 'project')) {
      if (tableItemSelected.idProject != null) {
        this.updateRegister(tableItemSelected, 'project', tableItemSelected.idProject);
        this.isEditForm.set(false);
      } else {
        this.addRegister(tableItemSelected, 'project');
      }
    }
  }

  baseShowLoading: WritableSignal<boolean> = signal(false);

  /**
   * showTableDataList
   *
   * Request datas to backend to fill table information.
   * @param groupType number - type of the group (1 - Customer, 2 - Supplier, 3 - MyCompany)
   * @param baseGroupSignal WritableSignal - Data of the group informed.
   * @param baseGroupName string - Name of the group informed (ex. company, product, etc)
   */
  async showTableDataList(
    baseGroupSignal: WritableSignal<IBaseGroup>,
    baseGroupName: TableDataTypeString,
    groupType: TableTypeNumber
  ): Promise<void> {
    try {
      this.baseShowLoading.set(true);
      const response = await this.httpRequestService.sendHttpRequest(
        `${environment.apiUrl}/${baseGroupName}/${groupType}`,
        'GET'
      );
      baseGroupSignal().tableDataSelected = response.data;
    } catch (e) {
      this.handleModal('failure', (e as Error).message);
    } finally {
      this.baseShowLoading.set(false);
    }
  }

  baseIsModalInfoActive: WritableSignal<boolean> = signal(false);

  async addRegister(
    tableItemSelected: TableItemType,
    baseGroupName: TableDataTypeString
  ): Promise<void> {
    try {
      this.baseShowLoading.set(true);
      const response = await this.httpRequestService.sendHttpRequest(
        `${environment.apiUrl}/${baseGroupName}`,
        'POST',
        tableItemSelected
      );
      this.handleModal('success', response.message);
      this.baseIsModalInfoActive.set(true);
    } catch (e) {
      this.handleModal('failure', (e as Error).message);
      this.baseIsModalInfoActive.set(true);
    } finally {
      this.baseShowLoading.set(false);
    }
  }

  async updateRegister(
    tableItemSelected: TableItemType,
    baseGroupName: TableDataTypeString,
    id: number
  ): Promise<void> {
    try {
      this.baseShowLoading.set(true);
      const response = await this.httpRequestService.sendHttpRequest(
        `${environment.apiUrl}/${baseGroupName}/${id.toString()}`,
        'PUT',
        tableItemSelected
      );
      this.handleModal('success', response.message);
      this.baseIsModalInfoActive.set(true);
    } catch (e) {
      this.handleModal('failure', (e as Error).message);
      this.baseIsModalInfoActive.set(true);
    } finally {
      this.baseShowLoading.set(false);
    }
  }

  async deleteRegister(baseGroupName: TableDataTypeString, id: number): Promise<void> {
    try {
      this.baseShowLoading.set(true);
      const response = await this.httpRequestService.sendHttpRequest(
        `${environment.apiUrl}/${baseGroupName}/${id.toString()}`,
        'DELETE'
      );
      this.handleModal('success', response.message);
      this.baseIsModalInfoActive.set(true);
    } catch (e) {
      this.handleModal('failure', (e as Error).message);
      this.baseIsModalInfoActive.set(true);
    } finally {
      this.baseShowLoading.set(false);
    }
  }

  baseModalData: WritableSignal<IModal> = signal({ type: '', description: '' });

  handleModal(type: string, description: string): void {
    this.baseModalData().type = type;
    this.baseModalData().description = description;
  }
}
