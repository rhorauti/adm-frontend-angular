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
import { ModalCheckComponent } from '@components/modal/modal-check/modal-check.component';
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

@Component({
  selector: 'app-company',
  standalone: true,
  imports: [
    FormsModule,
    InputStandardComponent,
    ButtonComponent,
    CommonModule,
    PaginationComponent,
    ModalAskComponent,
    ModalInfoComponent,
    ModalCheckComponent,
    ModalBaseComponent,
    LoadingComponent,
    TabComponent,
    InputAddonsComponent,
    TableComponent,
    TableHeaderBoxComponent,
  ],
  providers: [RegisterCompanyApi, HttpRequestService, MatIconModule, PaginationComponent],
  templateUrl: './company.component.html',
  styleUrl: './company.component.scss',
})
export class CompanyComponent implements OnInit {
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private httpRequestService: HttpRequestService
  ) {}

  version = 'v1';

  public company = signal<ICompanyGroup>({
    companyType: 1,
    arrayTab: ['Clientes', 'Fornecedores', 'MyCompany'],
    arraySelectFilter: [],
    inputValueFilter: '',
    selectValueFilter: 'Id',
    placeholderFilter: '',
    tabIndex: 0,
    isHeaderBoxActive: false,
    tableHeaderSelected: [],
    companyTableHeaders: [
      { id: 0, showHeader: true, name: 'Id' },
      { id: 1, showHeader: true, name: 'Data' },
      { id: 2, showHeader: true, name: 'Apelido' },
      { id: 3, showHeader: true, name: 'Razão Social' },
      { id: 4, showHeader: true, name: 'CNPJ' },
      { id: 5, showHeader: true, name: 'Inscrição Estadual' },
      { id: 6, showHeader: true, name: 'Inscrição Municipal' },
      { id: 7, showHeader: true, name: 'Ações' },
    ],
    tableDataSelected: [],
    tableItemSelected: {
      idCompany: 0,
      date: new Date().toISOString(),
      type: 1,
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
      date: new Date().toISOString(),
      type: 1,
      nickname: '',
      name: '',
      cnpj: '',
      ie: '',
      im: '',
    },
    tableIdx: 0,
    qtyPerPage: 12,
    isTableExpanded: false,
  });
  public companyItem = signal<ICompanyItemGroup>({
    arrayTab: ['Endereços', 'Funcionarios'],
    arraySelectFilter: [],
    inputValueFilter: '',
    selectValueFilter: 'Id',
    placeholderFilter: '',
    tabIndex: 0,
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
      { id: 1, showHeader: true, name: 'Tipo' },
      { id: 2, showHeader: true, name: 'Endereço' },
      { id: 3, showHeader: true, name: 'Número' },
      { id: 4, showHeader: true, name: 'Complemento' },
      { id: 5, showHeader: true, name: 'Bairro' },
      { id: 6, showHeader: true, name: 'Cidade' },
      { id: 7, showHeader: true, name: 'UF' },
      { id: 8, showHeader: true, name: 'Ações' },
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
    initialTableData: [],
    tableDataSelected: [],
    tableItemSelected: {
      idAddress: 0,
      type: '',
      address: '',
      number: 0,
      complement: '',
      district: '',
      city: '',
      state: '',
    },
    addressesData: [],
    addressData: {
      idAddress: 0,
      type: '',
      address: '',
      number: 0,
      complement: '',
      district: '',
      city: '',
      state: '',
    },
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
    },
    tableIdx: 0,
    qtyPerPage: 12,
    isTableExpanded: false,
  });

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

  setCompanyIdx(group: Signal<IBaseGroup>, idx: number): void {
    group().tabIndex = idx;
    if (idx == 0) {
      group().tableDataSelected.filter(data => {
        if (this.isBaseTypeValid(data, 'company')) return data.type == 1;
        else return;
      });
    } else if (idx == 1) {
      group().tableDataSelected.filter(data => {
        if (this.isBaseTypeValid(data, 'company')) return data.type == 2;
        else return;
      });
    }
  }

  setCompanyItemIdx(idx: number): void {
    this.companyItem().tabIndex = idx;
    if (idx == 0) {
      this.companyItem().tableDataSelected = this.companyItem().addressesData;
      this.companyItem().tableItemSelected = this.modalAddressInfo();
      this.companyItem().tableHeaderSelected = this.companyItem().adressTableHeaders;
    } else if (idx == 1) {
      this.companyItem().tableDataSelected = this.companyItem().employeesData;
      this.companyItem().tableItemSelected = this.modalEmployeeInfo();
      this.companyItem().tableHeaderSelected = this.companyItem().employeeTableHeaders;
    }
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

  setCompanyItemVisible(): void {
    const tableCompanyItem = this.document.getElementById('table-company-item-address');
    if (tableCompanyItem) {
      const tableClassList = tableCompanyItem.classList;
      if (tableClassList.contains('h-0')) tableClassList.remove('h-0');
      if (!tableClassList.contains('opacity-100')) tableClassList.add('opacity-100');
      if (!tableClassList.contains('h-full')) tableClassList.add('h-full');
      if (!tableClassList.contains('mt-5')) tableClassList.add('mt-5');
    }
  }

  selectedTableRow(index: number): void {
    const rows = this.document.getElementsByClassName('company-table-row');
    Array.from(rows).forEach(row => {
      if (row.classList.contains('is-active')) row.classList.remove('is-active');
    });
    rows[index].classList.add('is-active');
    this.setCompanyItemVisible();
  }

  modalFormInfo = signal({
    isActive: false,
    isInputClear: false,
    isEditForm: false,
  });

  modalAskInfo = signal({
    isActive: false,
  });

  /**
   * isTypeValid
   * Type guard that check if received data is equal to interface provided.
   * @param data unknown. Data can change according to tab selection.
   * @returns boolean. If data is equals to interface provided, it returns true or else false.
   */
  isBaseTypeValid<T extends keyof TableTypeObject>(
    data: unknown,
    type: T
  ): data is TableTypeObject[T] {
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
      default:
        return false;
    }
  }

  setCompanyProperty(
    tableItemSelected: TableItemType,
    propertyName: string,
    valueSet: string
  ): void {
    if (this.isBaseTypeValid(tableItemSelected, 'company')) {
      switch (propertyName) {
        case 'idCompany': {
          tableItemSelected.idCompany = Number(valueSet);
          break;
        }
        case 'nickname': {
          tableItemSelected.nickname = valueSet;
          break;
        }
        case 'name': {
          tableItemSelected.name = valueSet;
          break;
        }
        case 'cnpj': {
          tableItemSelected.cnpj = valueSet;
          break;
        }
        case 'ie': {
          tableItemSelected.ie = valueSet;
          break;
        }
        case 'im': {
          tableItemSelected.im = valueSet;
          break;
        }
      }
      this.modalFormInfo().isInputClear = false;
    }
  }

  modalCompanyInfo = signal({
    idCompany: 0,
    nickname: '',
    name: '',
    cnpj: '',
    ie: '',
    im: '',
  });

  modalAddressInfo = signal({
    idAddress: 0,
    type: '',
    address: '',
    number: 0,
    complement: '',
    district: '',
    city: '',
    state: '',
  });

  modalEmployeeInfo = signal({
    idEmployee: 0,
    name: '',
    cpf: '',
    department: '',
    position: '',
    email: '',
    deskphone: '',
    cellphone: '',
  });

  clearModalCompany(): void {
    this.modalCompanyInfo().idCompany = 0;
    this.modalCompanyInfo().nickname = '';
    this.modalCompanyInfo().name = '';
    this.modalCompanyInfo().cnpj = '';
    this.modalCompanyInfo().ie = '';
    this.modalCompanyInfo().im = '';
  }

  onShowModalForm(): void {
    this.modalFormInfo().isActive = true;
  }

  onCloseModalForm(): void {
    if (this.modalFormInfo().isEditForm) this.modalFormInfo().isEditForm = false;
    this.clearModalCompany();
    this.modalFormInfo().isInputClear = true;
    this.modalFormInfo().isActive = false;
  }

  onShowModalEditForm(dataSelected: TableItemType): void {
    if (this.isBaseTypeValid(dataSelected, 'company')) {
      this.modalCompanyInfo.set({ ...dataSelected });
      this.company().tableItemSelected = { ...dataSelected };
    }
    this.modalFormInfo().isEditForm = true;
    this.modalFormInfo().isActive = true;
  }

  modalCheckInfo = signal({
    isActive: false,
    isActionOk: false,
  });

  onShowModalCheck(tableItemSelected: TableItemType): void {
    if (this.isBaseTypeValid(tableItemSelected, 'company')) {
      this.modalCompanyInfo.set(tableItemSelected);
    }
    this.modalCheckInfo().isActive = true;
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
    if (this.modalCheckInfo().isActionOk) {
      this.onShowCompanyList();
      this.onCloseModalForm();
      this.modalCheckInfo().isActive = false;
      this.modalInfo().isActive = false;
      this.modalCheckInfo().isActionOk = false;
    } else if (this.modalInfo().isActionOk) {
      this.onShowCompanyList();
      this.modalAskInfo().isActive = false;
      this.modalInfo().isActive = false;
      this.modalInfo().isActionOk = false;
    } else {
      this.modalCheckInfo().isActive = false;
      this.modalInfo().isActive = false;
    }
  }

  onShowBaseModalAskToDelete(dataSelected: TableItemType): void {
    this.company().tableItemSelected = dataSelected;
    this.onHandleModalInfo(
      'confirmation',
      `Deseja excluir ${(this.company().tableItemSelected as ICompany).name}?`
    );
    this.modalAskInfo().isActive = true;
  }

  onShowModalAskToDeleteCompanyItem(): void {}

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
        `${environment.apiUrl}/${this.version}/company/${this.company().companyType}`,
        'GET'
      );
      this.company().tableDataSelected = response.data;
    } catch (e: any) {
      this.onHandleModalInfo('failure', 'Erro ao carregar a lista');
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
      this.companyItem().addressesData = response.data;
      this.companyItem().tableDataSelected = this.companyItem().addressesData;
    } catch (e: any) {
      this.onHandleModalInfo('failure', 'Erro ao carregar a lista');
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
      this.companyItem().employeesData = response.data;
      console.log(this.companyItem().employeesData);
    } catch (e: any) {
      this.onHandleModalInfo('failure', 'Erro ao carregar a lista');
    } finally {
      this.showLoading.set(false);
    }
  }

  async addNewCompany(): Promise<void> {
    try {
      this.showLoading.set(true);
      const response = await this.httpRequestService.sendHttpRequest(
        `${environment.apiUrl}/${this.version}/company/${this.company().companyType}`,
        'POST',
        this.company().tableItemSelected
      );
      this.modalCheckInfo().isActionOk = true;
      this.onHandleModalInfo('success', response.message);
      this.modalInfo().isActive = true;
    } catch (e: any) {
      this.onHandleModalInfo('failure', e.error.message);
      this.modalInfo().isActive = true;
    } finally {
      this.showLoading.set(false);
    }
  }

  async updateCompany() {
    try {
      this.showLoading.set(true);
      const response = await this.httpRequestService.sendHttpRequest(
        `${environment.apiUrl}/${this.version}/company/${(this.company().tableItemSelected as ICompany).idCompany}`,
        'PUT',
        this.company().tableItemSelected
      );
      this.onHandleModalInfo('success', response.message);
      this.modalCheckInfo().isActionOk = true;
      this.modalInfo().isActive = true;
    } catch (e: any) {
      this.onHandleModalInfo('failure', e.error.message);
      this.modalInfo().isActive = true;
    } finally {
      this.showLoading.set(false);
    }
  }

  async deleteCompany(): Promise<void> {
    try {
      this.showLoading.set(true);
      const response = await this.httpRequestService.sendHttpRequest(
        `${environment.apiUrl}/${this.version}/company/${(this.company().tableItemSelected as ICompany).idCompany}`,
        'DELETE'
      );
      this.modalInfo().isActionOk = true;
      this.onHandleModalInfo('success', response.message);
      this.modalInfo().isActive = true;
    } catch (e: any) {
      this.onHandleModalInfo('failure', 'Erro ao excluir o item');
      this.modalInfo().isActive = true;
    } finally {
      this.showLoading.set(false);
    }
  }
}
