import { CommonModule } from '@angular/common';
import { Component, computed, Input, OnInit, signal } from '@angular/core';
import { ButtonComponent } from '@components/button/button.component';
import { InputAddonsComponent } from '@components/input/input-addons/input-addons.component';
import { TableHeaderBoxComponent } from '@components/table/table-header-box/table-header-box.component';
import { TableBaseComponent } from '@components/table/table-base/table-base.component';
import { HttpRequestService } from '@core/api/http-request.service';
import { ModalBaseComponent } from '@components/modal/modal-base/modal-base.component';
import { InputStandardComponent } from '@components/input/input-standard/input-standard.component';
import { ModalAskComponent } from '@components/modal/modal-ask/modal-ask.component';
import { ModalInfoComponent } from '@components/modal/modal-info/modal-info.component';
import { LoadingComponent } from '@components/loading/loading.component';
import { NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { IFilter, IModalForm, IPagination, ITableCheckbox } from '@core/interfaces/IBase';
import { environment } from '@environments/environment';
import { FormsModule } from '@angular/forms';
import { ITableHeader } from '@core/interfaces/ITableHeader';
import { PaginationComponent } from '../../pagination/pagination.component';
import { IAddress } from '@core/interfaces/IAddress';
import { ThirdPartApi } from '@core/api/http/third.part.api';
import { SelectComponent } from '@components/select/select.component';

export type AddressIdType = 'idCompany' | 'idEmployee';

@Component({
  selector: 'app-table-address',
  standalone: true,
  imports: [
    CommonModule,
    InputAddonsComponent,
    SelectComponent,
    FormsModule,
    TableBaseComponent,
    ButtonComponent,
    TableHeaderBoxComponent,
    ModalBaseComponent,
    InputStandardComponent,
    ModalAskComponent,
    ModalInfoComponent,
    LoadingComponent,
    NgxMaskPipe,
    PaginationComponent,
  ],
  providers: [provideNgxMask(), ThirdPartApi],
  templateUrl: './table-address.component.html',
  styleUrl: './table-address.component.scss',
})
export class TableAddressComponent implements OnInit {
  constructor(
    private httpRequestService: HttpRequestService,
    private thirdPartApi: ThirdPartApi
  ) {}
  version = 'v1';

  filter = signal<IFilter>({
    selectValue: 'idAddress',
    input: '',
    placeholder: 'Digite um(a) Id',
  });
  isHeaderBoxActive = signal(false);
  tableHeaders = signal<ITableHeader[]>([
    { id: 0, showHeader: true, name: '', value: '' },
    { id: 1, showHeader: true, name: 'Id', value: 'idAddress' },
    { id: 2, showHeader: true, name: 'Apelido', value: 'nickname' },
    { id: 3, showHeader: true, name: 'CEP', value: 'postalCode' },
    { id: 4, showHeader: true, name: 'Endereço', value: 'address' },
    { id: 5, showHeader: true, name: 'Número', value: 'number' },
    { id: 6, showHeader: true, name: 'Complemento', value: 'complement' },
    { id: 7, showHeader: true, name: 'Bairro', value: 'district' },
    { id: 8, showHeader: true, name: 'Cidade', value: 'city' },
    { id: 9, showHeader: true, name: 'UF', value: 'state' },
  ]);
  initialTableData = signal<IAddress[]>([]);
  addressesData = signal<IAddress[]>([]);
  addressData = signal<IAddress>({
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
    idCompany: 6,
  });
  tableCheckbox = signal<ITableCheckbox>({
    header: false,
    body: [],
  });
  pagination = signal<IPagination>({
    currentPage: 1,
    lastPage: 1,
    qtyPerPage: 3,
  });
  modalForm = signal<IModalForm>({
    isActive: false,
    isInputClear: false,
    isEditForm: false,
  });
  modalAsk = signal({
    isActive: false,
  });

  modalInfo = signal({
    isActive: false,
    type: '',
    description: '',
    isActionOk: false,
  });
  @Input() idCompany = 0;
  @Input() idEmployee = 0;
  @Input() isSelectItemModal = false;
  isEditBtnDisabled = signal(false);
  isDelBtnDisabled = signal(false);

  ngOnInit(): void {
    this.onShowDataList();
    this.onBodyCheckboxStatusCheck(this.tableCheckbox().body);
  }

  getAddressId(value: string): void {
    this.addressData().idAddress = Number(value);
  }

  get checkboxHeaderValue(): boolean {
    return this.tableCheckbox().header;
  }

  set checkboxHeaderValue(isChecked: boolean) {
    this.tableCheckbox().header = isChecked;
    this.tableCheckbox.update(state => ({ ...state, body: state.body.map(() => isChecked) }));
    this.isDelBtnDisabled.set(!isChecked);
    const updatedTrueArray = this.tableCheckbox().body.filter(element => element == true);
    this.isEditBtnDisabled.set(updatedTrueArray.length == 0 || updatedTrueArray.length > 1);
  }

  onBodyCheckboxStatusCheck(array: boolean[]) {
    const updatedTrueArray = array.filter(element => element == true);
    this.isEditBtnDisabled.set(updatedTrueArray.length == 0 || updatedTrueArray.length > 1);
    this.isDelBtnDisabled.set(updatedTrueArray.length == 0);
    this.tableCheckbox.update(state => ({ ...state, header: updatedTrueArray.length > 0 }));
  }

  onChangeBodyCheckboxValue(index: number, event: Event) {
    const newValue = (event.target as HTMLInputElement).checked;
    const updatedArray = this.tableCheckbox().body.map((element, idx) =>
      idx == index ? (element = newValue) : element
    );
    this.onBodyCheckboxStatusCheck(updatedArray);
  }

  /**
   * changeSelectPlaceHolder
   * Get select value from app-input-addons component and change placeholder
   * @param value string. Value received from app-input-addons component
   */
  changeSelectPlaceHolder(value: string) {
    this.filter().placeholder = `Digite um(a) ${this.tableHeaders().find(header => header.value == value)?.name}`;
    this.filter().selectValue = value;
  }

  filterTable(): void {
    this.onShowDataList();
    this.tableCheckbox.update(state => ({ ...state, header: false }));
  }

  setMask(): string {
    return '00000-000';
  }

  showNewForm(): void {
    this.modalForm.update(state => ({
      ...state,
      isActive: true,
    }));
  }

  clearData(): void {
    this.addressData.update(state => ({
      ...state,
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
      idCompany: 0,
      idEmployee: 0,
    }));
    this.isDefaultDelivery = false;
    this.isDefaultBilling = false;
  }

  onCloseModalForm(): void {
    this.clearData();
    if (this.modalForm().isActive) {
      if (this.modalForm().isEditForm) {
        this.modalForm.update(state => ({
          ...state,
          isEditForm: false,
          isInputClear: true,
        }));
      }
      this.modalForm.update(state => ({ ...state, isActive: false }));
      if (this.isDefaultBilling) this.isDefaultBilling = false;
      if (this.isDefaultDelivery) this.isDefaultDelivery = false;
    }
  }

  arrayDatasChecked = computed(() => {
    const itemsChecked = this.tableCheckbox()
      .body.map((value, index) => (value == true ? index : null))
      .filter(index => index != null);
    const datasChecked = this.addressesData().map((value, index) =>
      itemsChecked.includes(index) ? value : null
    );
    return datasChecked.filter(value => value != null);
  });

  clearCheckbox(): void {
    this.tableCheckbox.update(state => ({ header: false, body: state.body.map(() => false) }));
  }

  async setCep(): Promise<void> {
    try {
      this.showLoading.set(true);
      const response = await this.thirdPartApi.getAddressFromCep(this.addressData().postalCode);
      if (response) {
        this.addressData.update(state => ({
          ...state,
          address: response.logradouro ?? '',
          complement: response.complemento ?? '',
          district: response.bairro ?? '',
          city: response.localidade ?? '',
          state: response.uf ?? '',
        }));
      }
    } catch (e: any) {
      this.onHandleModalInfo('failure', e?.error?.msg);
    } finally {
      this.showLoading.set(false);
    }
  }

  isDefaultDelivery = false;
  isDefaultBilling = false;

  onShowModalEditForm(): void {
    const selectedData = this.arrayDatasChecked()[0];
    if (selectedData) this.addressData.set(structuredClone(selectedData));
    this.isDefaultDelivery = this.convertNumberValueToBoolean(this.addressData().isDelivery);
    this.isDefaultBilling = this.convertNumberValueToBoolean(this.addressData().isBilling);
    this.modalForm.update(state => ({
      ...state,
      isActive: true,
      isEditForm: true,
    }));
  }

  convertNumberValueToBoolean(value: number): boolean {
    if (value == 1) return true;
    else return false;
  }

  onHandleModalInfo(type: string, description: string): void {
    this.modalInfo.update(state => ({
      ...state,
      type: type,
      description: description,
    }));
  }

  onCloseModalAsk(): void {
    if (this.modalAsk().isActive) {
      this.modalAsk.update(state => ({
        ...state,
        isActive: false,
      }));
    }
  }

  onCloseModalInfo(): void {
    if (this.modalInfo().isActionOk) {
      this.onShowDataList();
      this.onCloseModalForm();
      this.onCloseModalAsk();
      this.modalInfo.update(state => ({
        ...state,
        isActionOk: false,
        isActive: false,
      }));
      this.clearCheckbox();
      this.isEditBtnDisabled.set(true);
    } else {
      this.modalInfo.update(state => ({
        ...state,
        isActive: false,
      }));
    }
  }

  onShowModalAskToDelete(): void {
    const selectedData = this.arrayDatasChecked()[0];
    if (selectedData) {
      this.onHandleModalInfo(
        'confirmation',
        `Deseja excluir ${this.arrayDatasChecked().length == 1 ? selectedData.nickname : 'os registros selecionados?'}`
      );
      this.modalAsk().isActive = true;
    }
  }

  onModalAskActionOk(): void {
    this.delete();
    this.clearData();
    this.modalInfo.update(state => ({ ...state, isActionOk: true, isActive: true }));
  }

  showLoading = signal(false);

  fillCheckboxArray(dataLength: number): void {
    this.tableCheckbox().body = Array.from({ length: dataLength }, () => false);
  }

  changePage(page: number) {
    this.pagination.update(state => ({ ...state, currentPage: page }));
    this.tableCheckbox.update(state => ({ ...state, header: false }));
    this.onShowDataList();
  }

  /**
   * showTableDataList
   *
   * Request datas to backend to fill table information.
   * @param groupType number - type of the group (1 - Customer, 2 - Supplier, 3 - MyCompany)
   * @param baseGroupSignal WritableSignal - Data of the group informed.
   * @param baseGroupName string - Name of the group informed (ex. company, product, etc)
   */
  async onShowDataList(): Promise<void> {
    try {
      this.showLoading.set(true);
      const response = await this.httpRequestService.sendHttpRequest(
        `${environment.apiUrl}/${this.version}/address?page=${this.pagination().currentPage}&limit=${this.pagination().qtyPerPage}&input=${this.filter().input}&select=${this.filter().selectValue}&idCompany=${this.idCompany}`,
        'GET'
      );
      this.initialTableData.set(response.data.addresses);
      this.addressesData.set(response.data.addresses);
      this.pagination.update(state => ({ ...state, lastPage: response.data.totalPages }));
      this.fillCheckboxArray(this.addressesData().length);
    } catch (e: any) {
      this.onHandleModalInfo('failure', e?.error?.msg);
    } finally {
      this.showLoading.set(false);
    }
  }

  finalData = {
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
    idCompany: 0,
  } as IAddress;

  removeMask(data: string): string {
    return (data ?? '').replace(/[\D]/g, '');
  }

  setFinalData(): void {
    this.finalData.idAddress = this.addressData().idAddress;
    this.finalData.nickname = this.addressData().nickname;
    this.finalData.isDelivery = this.isDefaultDelivery ? 1 : 0;
    this.finalData.isBilling = this.isDefaultBilling ? 1 : 0;
    this.finalData.postalCode = this.removeMask(this.addressData().postalCode);
    this.finalData.address = this.addressData().address || '';
    this.finalData.number = this.addressData().number || '';
    this.finalData.complement = this.addressData().complement || '';
    this.finalData.district = this.addressData().district || '';
    this.finalData.city = this.addressData().city || '';
    this.finalData.state = this.addressData().state || '';
    this.finalData.idCompany = this.addressData().idCompany;
  }

  async save(): Promise<void> {
    try {
      this.showLoading.set(true);
      this.setFinalData();
      const response = await this.httpRequestService.sendHttpRequest(
        `${environment.apiUrl}/${this.version}/address`,
        'POST',
        this.finalData
      );
      if (!this.modalForm().isEditForm) {
        this.pagination.update(state => ({ ...state, currentPage: 1 }));
      }
      this.onHandleModalInfo('success', response.msg);
      this.modalInfo.update(state => ({ ...state, isActionOk: true, isActive: true }));
    } catch (e: any) {
      this.onHandleModalInfo('failure', e?.error?.msg);
      this.modalInfo.update(state => ({ ...state, isActive: true }));
    } finally {
      this.showLoading.set(false);
    }
  }

  async delete(): Promise<void> {
    try {
      this.showLoading.set(true);
      const response = await this.httpRequestService.sendHttpRequest(
        `${environment.apiUrl}/${this.version}/address/delete`,
        'POST',
        this.arrayDatasChecked()
      );
      this.pagination.update(state => ({ ...state, currentPage: 1 }));
      this.modalAsk.update(state => ({ ...state, isActive: false }));
      this.onHandleModalInfo('success', response.msg);
      this.modalInfo.update(state => ({ ...state, isActive: true }));
    } catch (e: any) {
      this.onHandleModalInfo('failure', e?.error?.msg);
      this.modalInfo.update(state => ({ ...state, isActive: true }));
    } finally {
      this.showLoading.set(false);
    }
  }
}
