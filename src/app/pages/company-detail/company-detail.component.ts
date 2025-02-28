import { Component, OnInit, Signal, signal } from '@angular/core';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { IBaseGroup, IBreadcrumb, TableItemType, TableTypeObject } from '@core/interfaces/IBase';
import { InputStandardComponent } from '../../components/input/input-standard/input-standard.component';
import { ICompany, ICompanyItemGroup } from '@core/interfaces/ICompany';
import { TabComponent } from '@components/tab/tab.component';
import { ButtonComponent } from '@components/button/button.component';
import { NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { InputAddonsComponent } from '@components/input/input-addons/input-addons.component';
import { TableHeaderBoxComponent } from '@components/table/table-header-box/table-header-box.component';
import { TableBaseComponent } from '@components/table/table-base/table-base.component';
import { REGISTER_TYPE } from 'src/app/enum/register.enum';
import { IAddress } from '@core/interfaces/IAddress';
import { IEmployee } from '@core/interfaces/IEmployee';
import { ModalAskComponent } from '@components/modal/modal-ask/modal-ask.component';
import { ModalInfoComponent } from '@components/modal/modal-info/modal-info.component';
import { LoadingComponent } from '@components/loading/loading.component';
import { ThirdPartApi } from '@core/api/http/third.part.api';
import { HttpRequestService } from '@core/api/http-request.service';
import { environment } from '@environments/environment';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-company-detail',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    FormsModule,
    InputStandardComponent,
    TabComponent,
    ButtonComponent,
    InputAddonsComponent,
    TableHeaderBoxComponent,
    TableBaseComponent,
    ModalAskComponent,
    ModalInfoComponent,
    LoadingComponent,
    NgxMaskPipe,
  ],
  providers: [provideNgxMask(), ThirdPartApi],
  templateUrl: './company-detail.component.html',
  styleUrl: './company-detail.component.scss',
})
export class CompanyDetailComponent implements OnInit {
  constructor(
    private httpRequestService: HttpRequestService,
    private thirdPartApi: ThirdPartApi
  ) {}

  version = 'v1';

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

  breadcrumb: IBreadcrumb[] = [
    {
      label: 'Cliente',
      href: '/signup',
    },
    {
      label: 'Blá',
      href: '/login',
    },
    {
      label: 'Blá 1',
      href: '/company',
    },
  ];

  company = {
    idCompany: 0,
    date: '',
    type: 0,
    nickname: '',
    name: '',
    cnpj: '',
    ie: '',
    im: '',
  } as ICompany;

  ngOnInit(): void {
    this.onShowAddressList();
    this.onShowEmployeeList();
    this.companyItem().tableHeaderSelected = this.companyItem().adressTableHeaders;
    this.showOptionList(this.companyItem);
    this.showInputPlaceholder(this.companyItem);
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

  showModalCompanyItem(tabIdx: number): void {
    if (tabIdx == 0) {
      this.companyItem().modalFormAddress.isActive = true;
    } else if (tabIdx == 1) {
      this.companyItem().modalFormEmployee.isActive = true;
    }
  }

  setMask(type: string, idx?: number): string {
    switch (type) {
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

  isDelivery = false;
  isBilling = false;

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

  convertNumberValueToBoolean(value: number): boolean {
    if (value == 1) return true;
    else return false;
  }

  showLoading = signal(false);

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

  onShowModalEditForm(dataSelected: TableItemType): void {
    if (this.isTypeValid(dataSelected, REGISTER_TYPE.ADDRESS)) {
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

  onCloseModalForm(): void {
    if (this.companyItem().modalFormAddress.isActive) {
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

  onCloseModalInfo(): void {
    if (this.companyItem().modalCheckAddress.isActionOk) {
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

  removeMask(data: string): string {
    return (data ?? '').replace(/[\D]/g, '');
  }

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
    // this.addressData.id_Company = this.company().companyData.idCompany;
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
    // this.employeeData.id_Company = this.company().companyData.idCompany;
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
