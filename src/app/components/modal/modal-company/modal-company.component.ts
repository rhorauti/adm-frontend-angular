import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Inject, Input, OnInit, Signal, signal } from '@angular/core';
import { ButtonComponent } from '@components/button/button.component';
import { InputAddonsComponent } from '@components/input/input-addons/input-addons.component';
import { TableHeaderBoxComponent } from '@components/table-header-box/table-header-box.component';
import { TableComponent } from '@components/table/table.component';
import { HttpRequestService } from '@core/api/http-request.service';
import { ICompany, ICompanyGroup } from '@core/interfaces/ICompany';
import { ModalBaseComponent } from '../modal-base/modal-base.component';
import { InputStandardComponent } from '@components/input/input-standard/input-standard.component';
import { ModalAskComponent } from '../modal-ask/modal-ask.component';
import { ModalInfoComponent } from '../modal-info/modal-info.component';
import { LoadingComponent } from '@components/loading/loading.component';
import { NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { IBaseGroup, TableItemType, TableTypeObject } from '@core/interfaces/IBase';
import { REGISTER_TYPE } from 'src/app/enum/register.enum';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-modal-company',
  standalone: true,
  imports: [
    CommonModule,
    InputAddonsComponent,
    TableComponent,
    ButtonComponent,
    TableHeaderBoxComponent,
    ModalBaseComponent,
    InputStandardComponent,
    ModalAskComponent,
    ModalInfoComponent,
    LoadingComponent,
    NgxMaskPipe,
  ],
  providers: [provideNgxMask()],
  templateUrl: './modal-company.component.html',
  styleUrl: './modal-company.component.scss',
})
export class ModalCompanyComponent implements OnInit {
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private httpRequestService: HttpRequestService
  ) {}
  version = 'v1';

  public company = signal<ICompanyGroup>({
    tabList: ['Clientes', 'Fornecedores', 'MyCompany'],
    arraySelectFilter: [],
    inputValueFilter: '',
    selectValueFilter: 'Id',
    placeholderFilter: '',
    tabIdx: 0,
    isHeaderBoxActive: false,
    tableHeaderSelected: [],
    companyTableHeaders: [
      { id: 0, showHeader: true, name: 'Id' },
      { id: 1, showHeader: true, name: 'Apelido' },
      { id: 2, showHeader: true, name: 'Razão Social' },
      { id: 3, showHeader: true, name: 'CNPJ/CPF' },
      { id: 4, showHeader: false, name: 'Inscr. Estadual' },
      { id: 5, showHeader: false, name: 'Inscr. Municipal' },
      { id: 6, showHeader: true, name: 'Ações' },
    ],
    tableDataSelected: [],
    tableItemSelected: {
      idCompany: 0,
      date: new Date().toISOString(),
      type: 0,
      nickname: '',
      name: '',
      cnpj: '',
      ie: '',
      im: '',
    },
    initialTableData: [],
    companiesData: [],
    companyData: {
      idCompany: 0,
      type: 0,
      nickname: '',
      name: '',
      cnpj: '',
      ie: '',
      im: '',
    },
    modalFormCompany: {
      isActive: false,
      isInputClear: false,
      isEditForm: false,
    },
    modalCheckCompany: {
      isActive: false,
      isActionOk: false,
    },
    tableIdx: 0,
    qtyPerPage: 12,
    isTableExpanded: false,
  });

  @Input() isModalCompany = true;
  arrayIsBtnDisabled = signal<boolean[]>([]);

  fillCompanyBtnDisableBooleanArray(dataLength: number): void {
    this.arrayIsBtnDisabled.set(Array.from({ length: dataLength }, () => true));
  }

  arrayIsArrowUp = signal<boolean[]>([]);

  fillCompanyBtnDetailBooleanArray(dataLength: number): void {
    this.arrayIsArrowUp.set(Array.from({ length: dataLength }, () => false));
  }

  ngOnInit(): void {
    this.onShowCompanyList();
    this.company().tableHeaderSelected = this.company().companyTableHeaders;
    this.showOptionList(this.company);
    this.showInputPlaceholder(this.company);
  }

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

  filterTable(): void {
    this.setAllBtnRowDisabled(this.arrayIsBtnDisabled);
    this.clearSelectionTableRow('company-table-row');
    this.company().companiesData = this.company().initialTableData.filter(company => {
      if (this.company().inputValueFilter == '') {
        return company.type == this.company().tabIdx;
      } else {
        const key = this.setCompanyKeyValueFilter() as keyof ICompany;
        return (
          company?.[key]
            ?.toString()
            .toLowerCase()
            .trim()
            .includes(this.company().inputValueFilter.toLowerCase().trim()) &&
          company.type == this.company().tabIdx
        );
      }
    });
  }

  setCompanyKeyValueFilter(): string {
    const selectValue = this.company().selectValueFilter;
    switch (selectValue) {
      case 'Id': {
        return 'idCompany';
      }
      case 'Data': {
        return 'date';
      }
      case 'Apelido': {
        return 'nickname';
      }
      case 'Razão Social': {
        return 'name';
      }
      case 'CNPJ/CPF': {
        return 'cnpj';
      }
      case 'Inscr. Estadual': {
        return 'ie';
      }
      case 'Inscr. Municipal': {
        return 'im';
      }
      default:
        return '';
    }
  }

  setMask(type: string, idx?: number): string {
    if (type == 'cnpj') {
      if ((this.company()?.companiesData?.[idx || 0]?.cnpj || '')?.length > 11) {
        return '00.000.000/0000-00';
      } else {
        return '000.000.000-00';
      }
    } else {
      return '';
    }
  }

  clearCompanyInfo(): void {
    this.company().companyData.idCompany = 0;
    this.company().companyData.nickname = '';
    this.company().companyData.name = '';
    this.company().companyData.cnpj = '';
    this.company().companyData.ie = '';
    this.company().companyData.im = '';
  }

  onCloseModalForm(): void {
    if (this.company().modalFormCompany.isActive) {
      if (this.company().modalFormCompany.isEditForm)
        this.company().modalFormCompany.isEditForm = false;
      this.clearCompanyInfo();
      this.company().modalFormCompany.isInputClear = true;
      this.company().modalFormCompany.isActive = false;
    }
  }

  setAllBtnRowDisabled(array: Signal<boolean[]>): void {
    array().forEach((value, index) => {
      array()[index] = true;
    });
  }

  convertNumberValueToBoolean(value: number): boolean {
    if (value == 1) return true;
    else return false;
  }

  clearSelectionTableRow(className: string): void {
    const rows = this.document.getElementsByClassName(className);
    Array.from(rows).forEach(row => {
      if (row.classList.contains('is-active')) row.classList.remove('is-active');
    });
  }

  setBtnRowAble(index: number): void {
    this.arrayIsBtnDisabled.update(currentArray =>
      currentArray.map((value, idx) => (idx == index ? false : true))
    );
  }

  highlightRow(index: number, className: string): void {
    const rows = this.document.getElementsByClassName(className);
    rows[index].classList.add('is-active');
  }

  selectedTableRow(index: number, className: string): void {
    this.setAllBtnRowDisabled(this.arrayIsBtnDisabled);
    this.setBtnRowAble(index);
    this.clearSelectionTableRow(className);
    this.highlightRow(index, className);
    this.company().companyData.idCompany = this.company().companiesData[index].idCompany;
    this.company().companyData.nickname = this.company().companiesData[index].nickname;
  }

  /**
   * isTypeValid
   * Type guard that check if received data is equal to interface provided.
   * @param data unknown. Data can change according to tab selection.
   * @returns boolean. If data is equals to interface provided, it returns true or else false.
   */
  isTypeValid<T extends keyof TableTypeObject>(data: unknown, type: T): data is TableTypeObject[T] {
    switch (type) {
      case REGISTER_TYPE.COMPANY: {
        return (data as ICompany).idCompany != undefined;
      }
      default:
        return false;
    }
  }

  onShowModalEditForm(dataSelected: TableItemType): void {
    if (this.isTypeValid(dataSelected, REGISTER_TYPE.COMPANY)) {
      this.company.update(state => ({
        ...state,
        companyData: { ...dataSelected },
        modalFormCompany: { ...state.modalFormCompany, isActive: true, isEditForm: true },
      }));
    }
  }

  modalAskInfo = signal({
    isActive: false,
  });

  modalInfo = signal({
    isActive: false,
    type: '',
    description: '',
    isActionOk: false,
  });

  onHandleModalInfo(type: string, description: string): void {
    this.modalInfo().type = type;
    this.modalInfo().description = description;
  }

  onCloseModalInfo(): void {
    if (this.company().modalCheckCompany.isActionOk) {
      this.onShowCompanyList();
      this.onCloseModalForm();
      this.company().modalCheckCompany.isActive = false;
      this.company().modalCheckCompany.isActionOk = false;
      this.clearSelectionTableRow('company-table-row');
    }
    this.modalInfo().isActive = false;
  }

  registerItem = '';

  onShowModalAskToDelete(registerItem: string, dataSelected: TableItemType): void {
    this.registerItem = registerItem;
    switch (registerItem) {
      case REGISTER_TYPE.COMPANY: {
        this.company().companyData = dataSelected as ICompany;
        this.onHandleModalInfo(
          'confirmation',
          `Deseja excluir ${(dataSelected as ICompany).name}?`
        );
        break;
      }
    }
    this.modalAskInfo().isActive = true;
  }

  onActionOk(): void {
    switch (this.registerItem) {
      case REGISTER_TYPE.COMPANY: {
        this.deleteCompany();
        this.clearCompanyInfo();
        break;
      }
    }
    this.registerItem = '';
  }

  showLoading = signal(false);

  /**
   * showTableDataList
   *
   * Request datas to backend to fill table information.
   * @param groupType number - type of the group (1 - Customer, 2 - Supplier, 3 - MyCompany)
   * @param baseGroupSignal WritableSignal - Data of the group informed.
   * @param baseGroupName string - Name of the group informed (ex. company, product, etc)
   */
  async onShowCompanyList(): Promise<void> {
    try {
      this.showLoading.set(true);
      const response = await this.httpRequestService.sendHttpRequest(
        `${environment.apiUrl}/${this.version}/company`,
        'GET'
      );
      this.company.update(state => ({
        ...state,
        initialTableData: response.data,
        companiesData: response.data,
      }));
      this.fillCompanyBtnDisableBooleanArray(
        this.company().companiesData.filter(company => company.type == this.company().tabIdx).length
      );
      this.fillCompanyBtnDetailBooleanArray(
        this.company().companiesData.filter(company => company.type == this.company().tabIdx).length
      );

      this.filterCompanyType();
    } catch (e: any) {
      this.onHandleModalInfo('failure', e?.error?.msg);
    } finally {
      this.showLoading.set(false);
    }
  }

  filterCompanyType(): void {
    this.company().companiesData = this.company().initialTableData.filter(company => {
      return company.type == this.company().tabIdx;
    });
  }

  companyData = {
    idCompany: 0,
    date: '',
    type: 0,
    nickname: '',
    name: '',
    cnpj: '',
    ie: '',
    im: '',
  } as ICompany;

  removeMask(data: string): string {
    return (data ?? '').replace(/[\D]/g, '');
  }

  setCompanyData(): void {
    this.companyData.idCompany = this.company().companyData.idCompany;
    this.companyData.type = this.company().companyData.type;
    this.companyData.nickname = this.company().companyData.nickname;
    this.companyData.name = this.company().companyData.name;
    this.companyData.cnpj = this.removeMask(this.company().companyData?.cnpj || '');
    this.companyData.ie = this.removeMask(this.company().companyData.ie || '');
    this.companyData.im = this.removeMask(this.company().companyData.im || '');
  }

  async addNewCompany(): Promise<void> {
    try {
      this.showLoading.set(true);
      this.setCompanyData();
      console.log(this.companyData);
      const response = await this.httpRequestService.sendHttpRequest(
        `${environment.apiUrl}/${this.version}/company`,
        'POST',
        this.companyData
      );
      this.company().modalCheckCompany.isActionOk = true;
      this.onHandleModalInfo('success', response.msg);
      this.modalInfo().isActive = true;
    } catch (e: any) {
      this.onHandleModalInfo('failure', e?.error?.msg);
      this.modalInfo().isActive = true;
    } finally {
      this.showLoading.set(false);
    }
  }

  async updateCompany(): Promise<void> {
    try {
      this.showLoading.set(true);
      this.setCompanyData();
      const response = await this.httpRequestService.sendHttpRequest(
        `${environment.apiUrl}/${this.version}/company/${(this.company().companyData as ICompany).idCompany}`,
        'PUT',
        this.companyData
      );
      this.onHandleModalInfo('success', response.msg);
      this.company().modalCheckCompany.isActionOk = true;
      this.modalInfo().isActive = true;
    } catch (e: any) {
      this.onHandleModalInfo('failure', e?.error?.msg);
      this.modalInfo().isActive = true;
    } finally {
      this.showLoading.set(false);
    }
  }

  async deleteCompany(): Promise<void> {
    try {
      this.showLoading.set(true);
      const response = await this.httpRequestService.sendHttpRequest(
        `${environment.apiUrl}/${this.version}/company/${(this.company().companyData as ICompany).idCompany}`,
        'DELETE'
      );
      this.modalAskInfo.update(state => ({ ...state, isActive: false }));
      this.onHandleModalInfo('success', response.msg);
      this.company().modalCheckCompany.isActionOk = true;
      this.modalInfo().isActive = true;
    } catch (e: any) {
      this.onHandleModalInfo('failure', e?.error?.msg);
      this.modalInfo().isActive = true;
    } finally {
      this.showLoading.set(false);
    }
  }
}
