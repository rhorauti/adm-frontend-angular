import { Component, Inject, OnInit, Signal, signal } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { PaginationComponent } from '@components/pagination/pagination.component';
import { RegisterCompanyApi } from '@core/api/http/company.api';
import { HttpRequestService } from '@core/api/http-request.service';
import { ButtonComponent } from '@components/button/button.component';
import { ModalAskComponent } from '@components/modal/modal-ask/modal-ask.component';
import { ModalInfoComponent } from '@components/modal/modal-info/modal-info.component';
import { LoadingComponent } from '@components/loading/loading.component';
import { FormsModule } from '@angular/forms';
import { ICompanyItemGroup, ICompanyGroup, ICompany } from '@core/interfaces/ICompany';
import { TabComponent } from '@components/tab/tab.component';
import { InputAddonsComponent } from '../../components/input/input-addons/input-addons.component';
import { TableComponent } from '../../components/table/table.component';
import { TableHeaderBoxComponent } from '@components/table-header-box/table-header-box.component';
import { ModalBaseComponent } from '@components/modal/modal-base/modal-base.component';
import { InputStandardComponent } from '@components/input/input-standard/input-standard.component';
import { IBaseGroup, TableItemType, TableTypeObject } from '@core/interfaces/IBase';
import { environment } from '@environments/environment';
import { IAddress } from '@core/interfaces/IAddress';
import { IEmployee } from '@core/interfaces/IEmployee';
import { NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { SelectComponent } from '../../components/select/select.component';
import { ThirdPartApi } from '@core/api/http/third.part.api';
import { REGISTER_TYPE } from 'src/app/enum/register.enum';
import { ModalCompanyComponent } from '@components/modal/modal-company/modal-company.component';

@Component({
  selector: 'app-company',
  standalone: true,
  imports: [
    FormsModule,
    InputStandardComponent,
    ButtonComponent,
    CommonModule,
    ModalAskComponent,
    ModalInfoComponent,
    ModalBaseComponent,
    LoadingComponent,
    TabComponent,
    InputAddonsComponent,
    TableComponent,
    TableHeaderBoxComponent,
    NgxMaskPipe,
    SelectComponent,
    ModalCompanyComponent,
  ],
  providers: [
    RegisterCompanyApi,
    HttpRequestService,
    ThirdPartApi,
    MatIconModule,
    PaginationComponent,
    provideNgxMask(),
  ],
  templateUrl: './company.component.html',
  styleUrl: './company.component.scss',
})
export class CompanyComponent implements OnInit {
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private httpRequestService: HttpRequestService,
    private thirdPartApi: ThirdPartApi
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
  public companyItem = signal<ICompanyItemGroup>({
    tabList: ['Endereços', 'Funcionarios'],
    arraySelectFilter: [],
    inputValueFilter: '',
    selectValueFilter: 'Id',
    placeholderFilter: '',
    tabIdx: 0,
    isHeaderBoxActive: false,
    tableHeaderSelected: [
      {
        id: 0,
        showHeader: false,
        name: '',
      },
    ],
    adressTableHeaders: [
      { id: 0, showHeader: true, name: 'Id' },
      { id: 1, showHeader: true, name: 'Apelido' },
      { id: 2, showHeader: true, name: 'CEP' },
      { id: 3, showHeader: true, name: 'Endereço' },
      { id: 4, showHeader: true, name: 'Número' },
      { id: 5, showHeader: true, name: 'Complemento' },
      { id: 6, showHeader: true, name: 'Bairro' },
      { id: 7, showHeader: true, name: 'Cidade' },
      { id: 8, showHeader: true, name: 'UF' },
      { id: 9, showHeader: true, name: 'Ações' },
    ],
    employeeTableHeaders: [
      { id: 0, showHeader: true, name: 'Id' },
      { id: 1, showHeader: true, name: 'Nome' },
      { id: 2, showHeader: true, name: 'cpf' },
      { id: 3, showHeader: true, name: 'Departamento' },
      { id: 4, showHeader: true, name: 'Cargo' },
      { id: 5, showHeader: true, name: 'E-mail' },
      { id: 6, showHeader: true, name: 'Tel. fixo' },
      { id: 7, showHeader: true, name: 'Celular' },
      { id: 8, showHeader: true, name: 'Ações' },
    ],
    tableDataSelected: [],
    tableItemSelected: {
      idAddress: 0,
      nickname: '',
      isDelivery: 0,
      isBilling: 0,
      postalCode: '',
      address: '',
      number: '',
      complement: '',
      district: '',
      city: '',
      state: '',
      id_Company: 0,
    },
    initialAddressTableData: [],
    addressesData: [],
    addressData: {
      idAddress: 0,
      nickname: '',
      isDelivery: 0,
      isBilling: 0,
      postalCode: '',
      address: '',
      number: '',
      complement: '',
      district: '',
      city: '',
      state: '',
      id_Company: 0,
    },
    modalFormAddress: {
      isActive: false,
      isEditForm: false,
      isInputClear: false,
    },
    modalCheckAddress: {
      isActive: false,
      isActionOk: false,
    },
    initialEmployeeTableData: [],
    employeesData: [],
    employeeData: {
      idEmployee: 0,
      name: '',
      cpf: '',
      department: '',
      position: '',
      email: '',
      deskphone: '',
      cellphone: '',
      id_Company: 0,
    },
    modalFormEmployee: {
      isActive: false,
      isEditForm: false,
      isInputClear: false,
    },
    modalCheckEmployee: {
      isActive: false,
      isActionOk: false,
    },
    tableIdx: 0,
    qtyPerPage: 12,
    isTableExpanded: false,
  });

  arrayIsBtnDisabled = signal<boolean[]>([]);
  isDelivery = false;
  isBilling = false;

  setMask(type: string, idx?: number): string {
    switch (type) {
      case 'cnpj': {
        if ((this.company()?.companiesData?.[idx || 0]?.cnpj || '')?.length > 11) {
          return '00.000.000/0000-00';
        } else {
          return '000.000.000-00';
        }
      }
      case 'postalCode': {
        return '00000-000';
      }
      case 'phone': {
        if ((this.companyItem()?.employeesData?.[idx || 0]?.deskphone || '')?.length > 11) {
          return '+55 (00) 0000-0000';
        } else {
          return '+55 (00) 00000-0000';
        }
      }
      default:
        return '';
    }
  }

  fillCompanyBtnDisableBooleanArray(dataLength: number): void {
    this.arrayIsBtnDisabled.set(Array.from({ length: dataLength }, () => true));
  }

  arrayIsArrowUp = signal<boolean[]>([]);

  fillCompanyBtnDetailBooleanArray(dataLength: number): void {
    this.arrayIsArrowUp.set(Array.from({ length: dataLength }, () => false));
  }

  ngOnInit(): void {
    this.onShowCompanyList();
    this.onShowAddressList();
    this.onShowEmployeeList();
    this.company().tableHeaderSelected = this.company().companyTableHeaders;
    this.companyItem().tableHeaderSelected = this.companyItem().adressTableHeaders;
    this.showOptionList(this.company);
    this.showInputPlaceholder(this.company);
    this.showOptionList(this.companyItem);
    this.showInputPlaceholder(this.companyItem);
  }

  onChangeCompanyIdx(idx: number): void {
    this.setCompanyType(idx);
    this.company().selectValueFilter = 'Id';
    this.showOptionList(this.company);
    this.showInputPlaceholder(this.company);
    this.filterCompanyType();
    this.clearSelectionTableRow('company-table-row');
    this.setCompanyItemVisibility(false);
  }

  setCompanyType(idx: number): void {
    this.company().companyData.type = idx;
  }

  getCompanyId(value: string): void {
    this.company().companyData.idCompany = Number(value);
  }

  getAddressId(value: string): void {
    this.companyItem().addressData.idAddress = Number(value);
  }

  getEmployeeId(value: string): void {
    this.companyItem().employeeData.idEmployee = Number(value);
  }

  filterCompanyType(): void {
    this.company().companiesData = this.company().initialTableData.filter(company => {
      return company.type == this.company().tabIdx;
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

  filterTable(): void {
    this.resetBtnDetail();
    this.isCompanyDetailActive = false;
    this.setCompanyItemVisibility(false);
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

  onChangeCompanyItemIdx(idx: number, className: string): void {
    this.companyItem.update(state => ({
      ...state,
      tabIdx: idx,
    }));
    if (idx == 0) {
      this.companyItem().tableHeaderSelected = this.companyItem().adressTableHeaders;
    } else if (idx == 1) {
      this.companyItem().tableHeaderSelected = this.companyItem().employeeTableHeaders;
    }
    this.companyItem().selectValueFilter = 'Id';
    this.showOptionList(this.companyItem);
    this.showInputPlaceholder(this.companyItem);
    this.clearSelectionTableRow(className);
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

  showModalCompanyItem(tabIdx: number): void {
    if (tabIdx == 0) {
      this.companyItem().modalFormAddress.isActive = true;
    } else if (tabIdx == 1) {
      this.companyItem().modalFormEmployee.isActive = true;
    }
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

  setCompanyItemVisibility(isVisible: boolean): void {
    const tableCompanyItem = this.document.getElementById('table-company-item');
    if (tableCompanyItem) {
      const tableClassList = tableCompanyItem.classList;
      if (isVisible) {
        if (!tableClassList.contains('transition-all')) tableClassList.add('transition-all');
        if (!tableClassList.contains('duration-300')) tableClassList.add('duration-300');
        if (tableClassList.contains('h-0')) tableClassList.remove('h-0');
        if (!tableClassList.contains('opacity-100')) tableClassList.add('opacity-100');
        if (!tableClassList.contains('h-full')) tableClassList.add('h-full');
        if (!tableClassList.contains('mt-5')) tableClassList.add('mt-5');
      } else {
        if (tableClassList.contains('transition-all')) tableClassList.remove('transition-all');
        if (tableClassList.contains('duration-300')) tableClassList.remove('duration-300');
        if (!tableClassList.contains('h-0')) tableClassList.add('h-0');
        if (tableClassList.contains('opacity-100')) tableClassList.remove('opacity-100');
        if (tableClassList.contains('h-full')) tableClassList.remove('h-full');
        if (tableClassList.contains('mt-5')) tableClassList.remove('mt-5');
      }
    }
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

  resetBtnDetail(): void {
    this.arrayIsArrowUp.update(currentArray => currentArray.map(() => false));
  }

  highlightRow(index: number, className: string): void {
    const rows = this.document.getElementsByClassName(className);
    rows[index].classList.add('is-active');
  }

  selectedTableRow(index: number, className: string): void {
    const rows = this.document.getElementsByClassName(className);
    if (!rows[index].classList.contains('is-active')) {
      this.resetBtnDetail();
      this.isCompanyDetailActive = false;
      this.setCompanyItemVisibility(false);
    }
    this.setAllBtnRowDisabled(this.arrayIsBtnDisabled);
    this.setBtnRowAble(index);
    this.clearSelectionTableRow(className);
    this.highlightRow(index, className);
    this.company().companyData.idCompany = this.company().companiesData[index].idCompany;
  }

  isCompanyDetailActive = false;

  onShowCompanyDetails(index: number): void {
    if (!this.isCompanyDetailActive) {
      this.setCompanyItemVisibility(true);
    } else {
      this.setCompanyItemVisibility(false);
    }
    this.isCompanyDetailActive = !this.isCompanyDetailActive;
    this.arrayIsArrowUp.update(currentArray =>
      currentArray.map((value, idx) => (idx == index ? (value = !value) : value))
    );
  }

  modalAskInfo = signal({
    isActive: false,
  });

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
      case REGISTER_TYPE.ADDRESS: {
        return (data as IAddress).idAddress != undefined;
      }
      case REGISTER_TYPE.EMPLOYEE: {
        return (data as IEmployee).idEmployee != undefined;
      }
      default:
        return false;
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

  clearAddressInfo(): void {
    this.companyItem().addressData.idAddress = 0;
    this.companyItem().addressData.nickname = '';
    this.companyItem().addressData.isBilling = 0;
    this.companyItem().addressData.isDelivery = 0;
    this.isBilling = false;
    this.isDelivery = false;
    this.companyItem().addressData.postalCode = '';
    this.companyItem().addressData.address = '';
    this.companyItem().addressData.number = '';
    this.companyItem().addressData.complement = '';
    this.companyItem().addressData.district = '';
    this.companyItem().addressData.city = '';
    this.companyItem().addressData.state = '';
  }

  clearEmployeeInfo(): void {
    this.companyItem().employeeData.idEmployee = 0;
    this.companyItem().employeeData.name = '';
    this.companyItem().employeeData.cpf = '';
    this.companyItem().employeeData.department = '';
    this.companyItem().employeeData.position = '';
    this.companyItem().employeeData.email = '';
    this.companyItem().employeeData.deskphone = '';
    this.companyItem().employeeData.cellphone = '';
  }

  onCloseModalForm(): void {
    if (this.company().modalFormCompany.isActive) {
      if (this.company().modalFormCompany.isEditForm)
        this.company().modalFormCompany.isEditForm = false;
      this.clearCompanyInfo();
      this.company().modalFormCompany.isInputClear = true;
      this.company().modalFormCompany.isActive = false;
    } else if (this.companyItem().modalFormAddress.isActive) {
      if (this.companyItem().modalFormAddress.isEditForm)
        this.companyItem().modalFormAddress.isEditForm = false;
      this.clearAddressInfo();
      this.companyItem().modalFormAddress.isInputClear = true;
      this.companyItem().modalFormAddress.isActive = false;
      if (this.companyItem().modalCheckAddress.isActive) {
        this.companyItem().modalCheckAddress.isActive = false;
      }
    } else if (this.companyItem().modalFormEmployee.isActive) {
      if (this.companyItem().modalFormEmployee.isEditForm)
        this.companyItem().modalFormEmployee.isEditForm = false;
      this.clearEmployeeInfo();
      this.companyItem().modalFormEmployee.isInputClear = true;
      this.companyItem().modalFormEmployee.isActive = false;
      if (this.companyItem().modalCheckEmployee.isActive) {
        this.companyItem().modalCheckEmployee.isActive = false;
      }
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

  onShowModalEditForm(dataSelected: TableItemType): void {
    if (this.isTypeValid(dataSelected, REGISTER_TYPE.COMPANY)) {
      this.company.update(state => ({
        ...state,
        companyData: { ...dataSelected },
        modalFormCompany: { ...state.modalFormCompany, isActive: true, isEditForm: true },
      }));
    } else if (this.isTypeValid(dataSelected, REGISTER_TYPE.ADDRESS)) {
      this.companyItem.update(state => ({
        ...state,
        addressData: { ...dataSelected },
        modalFormAddress: { ...state.modalFormAddress, isActive: true, isEditForm: true },
      }));
      this.isDelivery = this.convertNumberValueToBoolean(this.companyItem().addressData.isDelivery);
      this.isBilling = this.convertNumberValueToBoolean(this.companyItem().addressData.isBilling);
    } else if (this.isTypeValid(dataSelected, REGISTER_TYPE.EMPLOYEE)) {
      this.companyItem.update(state => ({
        ...state,
        employeeData: { ...dataSelected },
        modalFormEmployee: { ...state.modalFormEmployee, isActive: true, isEditForm: true },
      }));
    }
  }

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
    } else if (this.companyItem().modalCheckAddress.isActionOk) {
      this.onShowAddressList();
      this.onCloseModalForm();
      this.companyItem().modalCheckAddress.isActive = false;
      this.companyItem().modalCheckAddress.isActionOk = false;
    } else if (this.companyItem().modalCheckEmployee.isActionOk) {
      this.onShowEmployeeList();
      this.onCloseModalForm();
      this.companyItem().modalCheckEmployee.isActive = false;
      this.companyItem().modalCheckEmployee.isActionOk = false;
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
      case REGISTER_TYPE.ADDRESS: {
        this.companyItem().addressData = dataSelected as IAddress;
        this.onHandleModalInfo(
          'confirmation',
          `Deseja excluir ${(dataSelected as IAddress).nickname}?`
        );
        break;
      }
      case REGISTER_TYPE.EMPLOYEE: {
        this.companyItem().employeeData = dataSelected as IEmployee;
        this.onHandleModalInfo(
          'confirmation',
          `Deseja excluir ${(dataSelected as IEmployee).name}?`
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
      case REGISTER_TYPE.ADDRESS: {
        this.deleteAddress();
        this.clearAddressInfo();
        break;
      }
      case REGISTER_TYPE.EMPLOYEE: {
        this.deleteEmployee();
        this.clearEmployeeInfo();
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

  async setCep(): Promise<void> {
    try {
      this.showLoading.set(true);
      const response = await this.thirdPartApi.getAddressFromCep(
        this.companyItem().addressData.postalCode
      );
      if (response) {
        this.companyItem.update(state => ({
          ...state,
          addressData: {
            ...state.addressData,
            address: response.logradouro ?? '',
            complement: response.complemento ?? '',
            district: response.bairro ?? '',
            city: response.localidade ?? '',
            state: response.uf ?? '',
          },
        }));
      }
    } catch (e: any) {
      this.onHandleModalInfo('failure', e?.error?.msg);
    } finally {
      this.showLoading.set(false);
    }
  }

  async onShowAddressList(): Promise<void> {
    try {
      this.showLoading.set(true);
      const response = await this.httpRequestService.sendHttpRequest(
        `${environment.apiUrl}/${this.version}/address`,
        'GET'
      );
      this.companyItem.update(state => ({
        ...state,
        initialAddressTableData: response.data,
        addressesData: response.data,
      }));
    } catch (e: any) {
      this.onHandleModalInfo('failure', e?.error?.msg);
    } finally {
      this.showLoading.set(false);
    }
  }

  addressData = {
    idAddress: 0,
    nickname: '',
    isDelivery: 0,
    isBilling: 0,
    postalCode: '',
    address: '',
    number: '',
    complement: '',
    district: '',
    city: '',
    state: '',
    id_Company: 0,
  } as IAddress;

  setAddressData(): void {
    this.addressData.idAddress = this.companyItem().addressData.idAddress;
    this.addressData.nickname = this.companyItem().addressData.nickname;
    this.addressData.isDelivery = this.isDelivery ? 1 : 0;
    this.addressData.isBilling = this.isBilling ? 1 : 0;
    this.addressData.postalCode = this.removeMask(this.companyItem().addressData.postalCode);
    this.addressData.address = this.companyItem().addressData.address;
    this.addressData.number = this.companyItem().addressData.number || '';
    this.addressData.complement = this.companyItem().addressData.complement || '';
    this.addressData.district = this.companyItem().addressData.district || '';
    this.addressData.city = this.companyItem().addressData.city || '';
    this.addressData.state = this.companyItem().addressData.state || '';
    this.addressData.id_Company = this.company().companyData.idCompany;
  }

  async saveAddress(): Promise<void> {
    try {
      this.setAddressData();
      this.showLoading.set(true);
      const response = await this.httpRequestService.sendHttpRequest(
        `${environment.apiUrl}/${this.version}/address`,
        'POST',
        this.addressData
      );
      this.companyItem().modalCheckAddress.isActionOk = true;
      this.onHandleModalInfo('success', response.msg);
      this.modalInfo().isActive = true;
    } catch (e: any) {
      this.onHandleModalInfo('failure', e?.error?.msg);
      this.modalInfo().isActive = true;
    } finally {
      this.showLoading.set(false);
    }
  }

  async deleteAddress(): Promise<void> {
    try {
      this.showLoading.set(true);
      const response = await this.httpRequestService.sendHttpRequest(
        `${environment.apiUrl}/${this.version}/address/${(this.companyItem().addressData as IAddress).idAddress}`,
        'DELETE'
      );
      this.modalAskInfo.update(state => ({ ...state, isActive: false }));
      this.onHandleModalInfo('success', response.msg);
      this.companyItem().modalCheckAddress.isActionOk = true;
      this.modalInfo().isActive = true;
    } catch (e: any) {
      this.onHandleModalInfo('failure', e?.error?.msg);
      this.modalInfo().isActive = true;
    } finally {
      this.showLoading.set(false);
    }
  }

  async onShowEmployeeList(): Promise<void> {
    try {
      this.showLoading.set(true);
      const response = await this.httpRequestService.sendHttpRequest(
        `${environment.apiUrl}/${this.version}/employee`,
        'GET'
      );
      this.companyItem.update(state => ({
        ...state,
        initialEmployeeTableData: response.data,
        employeesData: response.data,
      }));
    } catch (e: any) {
      this.onHandleModalInfo('failure', e?.error?.msg);
    } finally {
      this.showLoading.set(false);
    }
  }

  employeeData = {
    idEmployee: 0,
    name: '',
    cpf: '',
    department: '',
    position: '',
    email: '',
    deskphone: '',
    cellphone: '',
    id_Company: 0,
  } as IEmployee;

  setEmployeeData(): void {
    this.employeeData.idEmployee = this.companyItem().employeeData.idEmployee;
    this.employeeData.name = this.companyItem().employeeData.name;
    this.employeeData.cpf = this.removeMask(this.companyItem().employeeData.cpf || '');
    this.employeeData.department = this.companyItem().employeeData.department || '';
    this.employeeData.position = this.companyItem().employeeData.position || '';
    this.employeeData.email = this.companyItem().employeeData.email || '';
    this.employeeData.deskphone = this.removeMask(
      this.removeMask(this.companyItem().employeeData.deskphone || '')
    );
    this.employeeData.cellphone = this.removeMask(this.companyItem().employeeData.cellphone || '');
    this.employeeData.id_Company = this.company().companyData.idCompany;
  }

  async saveEmployee(): Promise<void> {
    try {
      this.setEmployeeData();
      this.showLoading.set(true);
      console.log('employeeData', this.employeeData);
      const response = await this.httpRequestService.sendHttpRequest(
        `${environment.apiUrl}/${this.version}/employee`,
        'POST',
        this.employeeData
      );
      this.companyItem().modalCheckEmployee.isActionOk = true;
      this.onHandleModalInfo('success', response.msg);
      this.modalInfo().isActive = true;
    } catch (e: any) {
      this.onHandleModalInfo('failure', e?.error?.msg);
      this.modalInfo().isActive = true;
    } finally {
      this.showLoading.set(false);
    }
  }

  async deleteEmployee(): Promise<void> {
    try {
      this.showLoading.set(true);
      const response = await this.httpRequestService.sendHttpRequest(
        `${environment.apiUrl}/${this.version}/employee/${(this.companyItem().employeeData as IEmployee).idEmployee}`,
        'DELETE'
      );
      this.modalAskInfo.update(state => ({ ...state, isActive: false }));
      this.onHandleModalInfo('success', response.msg);
      this.companyItem().modalCheckEmployee.isActionOk = true;
      this.modalInfo().isActive = true;
    } catch (e: any) {
      this.onHandleModalInfo('failure', e?.error?.msg);
      this.modalInfo().isActive = true;
    } finally {
      this.showLoading.set(false);
    }
  }
}
