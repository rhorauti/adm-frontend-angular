import { Component, OnInit, Signal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { InputFormComponent } from '@components/input/input-form/input-form.component';
import { IBaseGroup, TableItemType, TableTypeObject } from '@core/interfaces/IBase';
import { environment } from '@environments/environment';
import { IAddress } from '@core/interfaces/IAddress';
import { IEmployee } from '@core/interfaces/IEmployee';

@Component({
  selector: 'app-company',
  standalone: true,
  imports: [
    FormsModule,
    InputFormComponent,
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
  constructor(private httpRequestService: HttpRequestService) {}

  version = 'v1';

  ngOnInit(): void {
    this.showCompanyList();
    this.company().tableHeaderSelected = this.company().companyTableHeaders;
    this.showOptionList(this.company);
    this.showInputPlaceholder(this.company);
    this.companyItem().tableHeaderSelected = this.companyItem().adressTableHeaders;
    this.showOptionList(this.companyItem);
    this.showInputPlaceholder(this.companyItem);
  }

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
      { id: 2, showHeader: true, name: 'Departamento' },
      { id: 3, showHeader: true, name: 'Cargo' },
      { id: 4, showHeader: true, name: 'E-mail' },
      { id: 5, showHeader: true, name: 'Telefone fixo' },
      { id: 6, showHeader: true, name: 'Celular' },
      { id: 7, showHeader: true, name: 'Ações' },
    ],
    initialTableData: [],
    tableDataSelected: [],
    tableItemSelected: {
      idAddress: 0,
      type: '',
      adress: '',
      number: 0,
      complement: '',
      district: '',
      city: '',
      state: '',
    },
    addressData: {
      idAddress: 0,
      type: '',
      adress: '',
      number: 0,
      complement: '',
      district: '',
      city: '',
      state: '',
    },
    employeeData: {
      idEmployee: 0,
      name: '',
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

  setCompanyIdx(idx: number): void {
    this.company().tabIndex = idx;
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

  isInputFormClear = signal(false);
  isModalAskActive = signal(false);

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
      this.isInputFormClear.set(false);
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

  clearModalCompany(): void {
    this.modalCompanyInfo().idCompany = 0;
    this.modalCompanyInfo().nickname = '';
    this.modalCompanyInfo().name = '';
    this.modalCompanyInfo().cnpj = '';
    this.modalCompanyInfo().ie = '';
    this.modalCompanyInfo().im = '';
  }

  isModalFormActive = signal(false);
  isEditForm = signal(false);

  onShowBaseModalForm(): void {
    this.isModalFormActive.set(true);
  }

  onCloseModalForm(): void {
    if (this.isEditForm()) this.isEditForm.set(false);
    this.clearModalCompany();
    this.isInputFormClear.set(true);
    this.isModalFormActive.set(false);
  }

  onShowModalEditFormCompany(dataSelected: TableItemType): void {
    if (this.isBaseTypeValid(dataSelected, 'company')) {
      this.modalCompanyInfo.set({ ...dataSelected });
      this.company().tableItemSelected = dataSelected;
      this.isEditForm.set(true);
    }
    this.isModalFormActive.set(true);
  }

  isModalCheckActive = signal(false);

  onShowModalCheckCompany(tableItemSelected: TableItemType): void {
    if (this.isBaseTypeValid(tableItemSelected, 'company')) {
      this.modalCompanyInfo.set(tableItemSelected);
    }
    this.isModalCheckActive.set(true);
  }

  onCloseModalCheckCompany(): void {
    this.clearModalCompany();
    this.isModalCheckActive.set(false);
  }

  modalData = signal({ type: '', description: '' });

  handleModal(type: string, description: string): void {
    this.modalData().type = type;
    this.modalData().description = description;
  }

  isModalInfoActive = signal(false);
  isModalInfoFormActionOk = false;
  isModalInfoDeleteActionOk = false;

  onCloseModalInfoCompany(): void {
    if (this.isModalInfoFormActionOk) {
      this.showCompanyList();
      this.onCloseModalForm();
      this.onCloseModalCheckCompany();
      this.isModalInfoActive.set(false);
      this.isModalInfoFormActionOk = false;
    } else if (this.isModalInfoDeleteActionOk) {
      console.log('entrando else if');
      this.showCompanyList();
      this.isModalAskActive.set(false);
      this.isModalInfoActive.set(false);
      this.isModalInfoDeleteActionOk = false;
    } else {
      this.onCloseModalCheckCompany();
      this.isModalInfoActive.set(false);
    }
  }

  showBaseModalAskToDeleteCompany(dataSelected: TableItemType): void {
    this.company().tableItemSelected = dataSelected;
    this.handleModal(
      'confirmation',
      `Deseja excluir ${(this.company().tableItemSelected as ICompany).name}?`
    );
    this.isModalAskActive.set(true);
  }

  showModalAskToDeleteCompanyItem(): void {}

  showLoading = signal(false);

  /**
   * showTableDataList
   *
   * Request datas to backend to fill table information.
   * @param groupType number - type of the group (1 - Customer, 2 - Supplier, 3 - MyCompany)
   * @param baseGroupSignal WritableSignal - Data of the group informed.
   * @param baseGroupName string - Name of the group informed (ex. company, product, etc)
   */
  async showCompanyList(): Promise<void> {
    try {
      this.showLoading.set(true);
      const response = await this.httpRequestService.sendHttpRequest(
        `${environment.apiUrl}/${this.version}/company/${this.company().companyType}`,
        'GET'
      );
      this.company().tableDataSelected = response.data;
    } catch (e: any) {
      this.handleModal('failure', 'Erro ao carregar a lista');
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
      this.isModalInfoFormActionOk = true;
      this.handleModal('success', response.message);
      this.isModalInfoActive.set(true);
    } catch (e: any) {
      this.handleModal('failure', e.error.message);
      this.isModalInfoActive.set(true);
    } finally {
      this.showLoading.set(false);
    }
  }

  isNewEditRegister = false;

  async updateCompany() {
    try {
      this.showLoading.set(true);
      const response = await this.httpRequestService.sendHttpRequest(
        `${environment.apiUrl}/${this.version}/company/${(this.company().tableItemSelected as ICompany).idCompany}`,
        'PUT',
        this.company().tableItemSelected
      );
      this.handleModal('success', response.message);
      this.isModalInfoActive.set(true);
      this.isNewEditRegister = true;
    } catch (e: any) {
      this.handleModal('failure', e.error.message);
      this.isModalInfoActive.set(true);
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
      this.isModalInfoDeleteActionOk = true;
      this.handleModal('success', response.message);
      this.isModalInfoActive.set(true);
    } catch (e: any) {
      this.handleModal('failure', 'Erro ao excluir o item');
      this.isModalInfoActive.set(true);
    } finally {
      this.showLoading.set(false);
    }
  }
}
