import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '@components/breadcrumb/breadcrumb.component';
import { TableHeaderBoxComponent } from '@components/side-bar/side-bar.component';
import { MatIconModule } from '@angular/material/icon';
import { ButtonLabelComponent } from '@components/button/button-label/button-label.component';
import { ButtonDeleteComponent } from '@components/button/button-delete/button-delete.component';
import { ButtonIconComponent } from '@components/button/button-icon/button-icon.component';
import { TooltipComponent } from '@components/tooltip/tooltip.component';
import { ToogleButtonComponent } from '@components/toogle-button/toogle-button.component';
import { InputComponent } from '@components/input/input.component';
import { ButtonCloseComponent } from '@components/button/button-close/button-close.component';
import { ModalStore } from '@store/modal/modal.store';
import { AuthStore } from '@store/auth/auth.store';
import { loadStorage } from '@core/utils/misc';
import { BaseRegisterStore, defaultTableHeaderIcon } from '@store/base/base.register.store';
import { ActionCallback } from '@core/interfaces/modal.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { KeyOfData } from '@core/types/base.type';
import { ITableHeader } from '@core/interfaces/table.interface';
import { IUnit } from '@core/interfaces/unit.interface';
import { UnitApi } from '@core/http/unit/unit.api';
import { TableComponent } from '@components/table/table.component';
// import { PaginationComponent } from '@components/pagination/pagination.component';

@Component({
  selector: 'app-unit-home',
  imports: [
    CommonModule,
    TableHeaderBoxComponent,
    InputComponent,
    TableComponent,
    // PaginationComponent,
    BreadcrumbComponent,
    MatIconModule,
    ButtonLabelComponent,
    ButtonDeleteComponent,
    ButtonIconComponent,
    TooltipComponent,
    ToogleButtonComponent,
    ButtonCloseComponent,
  ],
  templateUrl: './unit-home.component.html',
  styleUrl: './unit-home.component.scss',
})
export class UnitHomeComponent implements OnInit {
  readonly unitApi = inject(UnitApi);
  readonly baseRegisterStore = inject(BaseRegisterStore);
  readonly authStore = inject(AuthStore);
  readonly modalStore = inject(ModalStore);

  unitHomeData = {
    dataList: [],
  };

  readonly currentView = 'units';
  readonly currentViewTranslated = 'Unidades de medida';
  readonly keyId = 'idUnit';
  readonly breadcrumbList = ['Cadastro', 'Unidades de Medida'];
  readonly inputSearchFilterList: KeyOfData[] = ['idUnit', 'name'];
  readonly inputSearchPlaceholder = 'Id, Unidade';
  readonly initialTableHeaders = [
    {
      id: 0,
      isHeaderActive: true,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'Id',
      databaseField: 'idUnit',
    },
    {
      id: 1,
      isHeaderActive: true,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'Unidade',
      databaseField: 'name',
    },
    {
      id: 2,
      isHeaderActive: true,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'Comentários',
      databaseField: 'comment',
    },
  ] as ITableHeader<IUnit>[];
  tableHeadersLocalStorageId = `table_headers_${this.currentView}_${this.authStore.user().id}`;

  async ngOnInit() {
    this.onShowDataList();
    const tableHeaders = await loadStorage(this.tableHeadersLocalStorageId);
    const headers = tableHeaders ? tableHeaders : this.initialTableHeaders;
    this.baseRegisterStore.onSetStateToNewValue('tableHeaders', headers);
  }

  onRedirectToEditPage = (data: IUnit): void => {
    this.baseRegisterStore.onSetStateToNewValue('data', data);
    this.baseRegisterStore.onSetStateToNewValue('isEditData', true);
    this.modalStore.onRedirectPage(
      `/${this.currentView}/edit/${(this.baseRegisterStore.data() as IUnit)[this.keyId]}`
    );
  };

  onCloneRegister = async (data: IUnit): Promise<void> => {
    this.baseRegisterStore.onSetStateToNewValue('isCopiedData', true);
    this.baseRegisterStore.onSetStateToNewValue('data', data);
    this.modalStore.onRedirectPage(`/${this.currentView}/new`);
  };

  onShowDataList = async (): Promise<void> => {
    try {
      this.modalStore.onLoading(true);
      const response = await this.unitApi.onGetDataList();
      if (response.data) {
        const data = response.data as IUnit[];
        this.baseRegisterStore.onSetStateToNewValue('initialData', data);
        this.baseRegisterStore.onSetStateToNewValue('dataList', data);
        this.baseRegisterStore.onClearData(data);
      } else {
        return;
      }
    } catch (e: unknown) {
      const error = e as HttpErrorResponse;
      this.modalStore.onShowInfoModal('Listar registros', error.error?.message);
    } finally {
      this.modalStore.onLoading(false);
    }
  };

  onDeleteRegister = async (id: number, onActionOk?: ActionCallback): Promise<void> => {
    try {
      this.modalStore.onLoading(true);
      const response = await this.unitApi.onDelete(id);
      if (response.status) {
        this.onShowDataList();
        this.modalStore.onSetModalInfoType('success');
        this.modalStore.onShowInfoModal('Excluir registro', response.message, onActionOk);
      } else {
        this.modalStore.onShowInfoModal('Excluir registro', response.error?.message || '');
      }
    } catch (e: unknown) {
      const error = e as HttpErrorResponse;
      this.modalStore.onShowInfoModal('Excluir registro', error.error.message);
    } finally {
      this.modalStore.onLoading(false);
    }
  };

  async onDelete(data: IUnit): Promise<void> {
    await this.onDeleteRegister(data[this.keyId] as number);
  }

  onShowModalToDelete(data?: IUnit): void {
    const selectedData = data ? data : (this.baseRegisterStore.itemSelected() as IUnit) || '';
    this.modalStore.onShowAskModal(
      `Cadastro de ${this.currentViewTranslated}`,
      `Deseja excluir o registro <b>${selectedData.name}</b>?`,
      () => this.onDelete(selectedData)
    );
  }
}
