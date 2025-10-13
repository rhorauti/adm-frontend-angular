import { Component, inject, OnDestroy, OnInit } from '@angular/core';
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
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductApi } from '@core/http/product/product.api';
import { IProduct } from '@core/interfaces/product.interface';
import { TableComponent } from '@components/table/table.component';
// import { PaginationComponent } from '@components/pagination/pagination.component';

@Component({
  selector: 'app-product-home',
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
  templateUrl: './product-home.component.html',
  styleUrl: './product-home.component.scss',
})
export class ProductHomeComponent implements OnInit, OnDestroy {
  readonly productApi = inject(ProductApi);
  readonly baseRegisterStore = inject(BaseRegisterStore);
  private activatedRoute = inject(ActivatedRoute);
  readonly authStore = inject(AuthStore);
  readonly modalStore = inject(ModalStore);

  readonly currentView = 'products';
  readonly currentViewTranslated = 'Produtos';
  readonly keyId = 'idProduct';
  readonly breadcrumbList = ['Cadastro', 'Produtos'];
  readonly inputSearchFilterList: KeyOfData[] = [
    'idProduct',
    'internalPartNumber',
    'customerPartNumber',
    'name',
  ];
  readonly inputSearchPlaceholder = 'Id, Part Number, Nome';
  readonly initialTableHeaders = [
    {
      id: 0,
      isHeaderActive: true,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'Id',
      databaseField: 'idProduct',
    },
    {
      id: 1,
      isHeaderActive: true,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'PN interno',
      databaseField: 'internalPartNumber',
    },
    {
      id: 2,
      isHeaderActive: false,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'PN cliente',
      databaseField: 'customerPartNumber',
    },
    {
      id: 3,
      isHeaderActive: true,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'Nome',
      databaseField: 'name',
    },
    {
      id: 4,
      isHeaderActive: true,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'Origem',
      databaseField: 'origin',
    },
    {
      id: 5,
      isHeaderActive: false,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'Ncm',
      databaseField: 'ncm',
    },
    {
      id: 6,
      isHeaderActive: false,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'Preço unitário',
      databaseField: 'purchasingUnitPrice',
    },
    {
      id: 7,
      isHeaderActive: false,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'Peso',
      databaseField: 'weight',
    },
    {
      id: 8,
      isHeaderActive: false,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'Estoque',
      databaseField: 'stock',
    },
  ] as ITableHeader<IProduct>[];
  tableHeadersLocalStorageId = `table_headers_${this.currentView}_${this.authStore.user().id}`;
  subscription: Subscription | undefined = undefined;

  async ngOnInit() {
    this.onShowDataList();
    const tableHeaders = await loadStorage(this.tableHeadersLocalStorageId);
    const headers = tableHeaders ? tableHeaders : this.initialTableHeaders;
    this.baseRegisterStore.onSetStateToNewValue('tableHeaders', headers);
  }

  onRedirectToEditPage = (data: IProduct): void => {
    this.baseRegisterStore.onSetStateToNewValue('data', data);
    this.baseRegisterStore.onSetStateToNewValue('isEditData', true);
    this.modalStore.onRedirectPage(
      `/${this.currentView}/edit/${(this.baseRegisterStore.data() as IProduct)[this.keyId]}`
    );
  };

  onCloneRegister = async (data: IProduct): Promise<void> => {
    this.baseRegisterStore.onSetStateToNewValue('isCopiedData', true);
    this.baseRegisterStore.onSetStateToNewValue('data', data);
    this.modalStore.onRedirectPage(`/${this.currentView}/new`);
  };

  onShowDataList = async (): Promise<void> => {
    try {
      this.modalStore.onLoading(true);
      const response = await this.productApi.onGetDataList();
      if (response.data) {
        const data = response.data as IProduct[];
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
      const response = await this.productApi.onDelete(id);
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

  async onDelete(data: IProduct): Promise<void> {
    await this.onDeleteRegister(data[this.keyId] as number);
  }

  onShowModalToDelete(data?: IProduct): void {
    const selectedData = data ? data : (this.baseRegisterStore.itemSelected() as IProduct) || '';
    this.modalStore.onShowAskModal(
      `Cadastro de ${this.currentViewTranslated}`,
      `Deseja excluir o registro <b>${selectedData.name}</b>?`,
      () => this.onDelete(selectedData)
    );
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
