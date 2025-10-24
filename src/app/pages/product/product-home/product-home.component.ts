import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HomeComponent } from '@components/home/home.component';
import { LoadingComponent } from '@components/loading/loading.component';
import { ModalAskComponent } from '@components/modal/modal-ask/modal-ask.component';
import { ModalInfoComponent } from '@components/modal/modal-info/modal-info.component';
import { ProductApi } from '@core/http/product/product.api';
import { ActionCallback, IModalAsk, IModalInfo } from '@core/interfaces/modal.interface';
import { IProductHome } from '@core/interfaces/product.interface';
import { ITableHeader } from '@core/interfaces/table.interface';
import { KeyOfData } from '@core/types/base.type';
import { loadStorage } from '@core/utils/misc';
import { AuthStore } from '@store/auth/auth.store';
import { defaultTableHeaderIcon } from '@store/base/base.register.store';
import { ModalType } from '@store/modal/modal.store';

@Component({
  selector: 'app-product-home',
  imports: [HomeComponent, ModalAskComponent, ModalInfoComponent, LoadingComponent],
  templateUrl: './product-home.component.html',
  styleUrl: './product-home.component.scss',
})
export class ProductHomeComponent implements OnInit {
  readonly authStore = inject(AuthStore);
  readonly productApi = inject(ProductApi);
  readonly router = inject(Router);

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

  tableHeadersLocalStorageId = `table_headers_${this.currentView}_${this.authStore.user().id}`;
  isComponentSetToDefault = signal(false);
  initialDataList = signal<IProductHome[]>([]);
  data = signal<IProductHome>({
    idProduct: 0,
    internalPartNumber: '',
    customerPartNumber: '',
    name: '',
    nameTranslated: '',
    origin: '',
    unit: '',
    stock: 0,
  });

  newRegisterUrl = `/${this.currentView}/new`;

  tableHeaders = [
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
      headerName: 'Nome traduzido',
      databaseField: 'nameTranslated',
    },
    {
      id: 5,
      isHeaderActive: true,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'Origem',
      databaseField: 'origin',
    },
    {
      id: 6,
      isHeaderActive: true,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'Unidade',
      databaseField: 'unit',
    },
    {
      id: 7,
      isHeaderActive: false,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'Estoque',
      databaseField: 'stock',
    },
  ] as ITableHeader<IProductHome>[];

  modalInfo = signal<IModalInfo>({
    isActive: false,
    title: '',
    description: '',
    type: '',
    onActionOk: null,
  });

  modalAsk = signal<IModalAsk>({
    isActive: false,
    title: '',
    description: '',
    onActionOk: null as ActionCallback,
    onActionNok: null as ActionCallback,
  });

  isLoading = signal(false);

  onShowInfoModal = (
    type: ModalType,
    title: string,
    description: string,
    onActionOk?: ActionCallback
  ): void => {
    this.modalInfo.set({
      ...this.modalInfo,
      isActive: true,
      type: type,
      title: title,
      description: description,
      onActionOk: onActionOk,
    });
  };

  async ngOnInit() {
    await this.onShowDataList();
    const selectedTableHeaders = await loadStorage(this.tableHeadersLocalStorageId);
    const headers = selectedTableHeaders ? selectedTableHeaders : this.tableHeaders;
    this.tableHeaders = headers;
  }

  onRedirectToEditPage = (data: IProductHome): void => {
    this.router.navigate([`/${this.currentView}/edit/${data.idProduct}`]);
  };

  onCloneRegister = (data: IProductHome): void => {
    this.router.navigate([`/${this.currentView}/new/${data.idProduct}`]);
  };

  onCloseInfoModal = async (): Promise<void> => {
    const callback = this.modalInfo().onActionOk;
    if (callback) await Promise.resolve(callback());
    this.modalInfo.set({
      isActive: false,
      type: '',
      title: '',
      description: '',
      onActionOk: null,
    });
  };

  onShowAskModal = (
    title: string,
    description: string,
    onActionOk?: ActionCallback,
    onActionNok?: ActionCallback
  ): void => {
    this.modalAsk.set({
      ...this.modalAsk,
      isActive: true,
      title: title,
      description: description,
      onActionOk: onActionOk,
      onActionNok: onActionNok,
    });
  };

  onCloseAskModalAction = async (isConfirmed: boolean): Promise<void> => {
    const callback = isConfirmed ? this.modalAsk().onActionOk : this.modalAsk().onActionNok;
    if (callback) {
      await Promise.resolve(callback());
      this.modalInfo.update(current => ({ ...current, type: 'success' }));
    }
    this.modalAsk.set({
      isActive: false,
      title: '',
      description: '',
      onActionOk: null,
      onActionNok: null,
    });
  };

  onShowDataList = async (): Promise<void> => {
    try {
      this.isLoading.set(true);
      const response = await this.productApi.onGetDataList();
      if (response.data) {
        const dataList = response.data as IProductHome[];
        this.initialDataList.set([...dataList]);
      } else {
        return;
      }
    } catch (e: unknown) {
      const error = e as HttpErrorResponse;
      this.onShowInfoModal('failure', 'Listar registros', error.error?.message);
    } finally {
      this.isLoading.set(false);
    }
  };

  onDeleteRegister = async (id: number, onActionOk?: ActionCallback): Promise<void> => {
    try {
      this.isLoading.set(true);
      const response = await this.productApi.onDelete(id);
      if (response.status) {
        this.onShowDataList();
        this.onShowInfoModal('success', 'Excluir registro', response.message, onActionOk);
      } else {
        this.onShowInfoModal('failure', 'Excluir registro', response.error?.message || '');
      }
    } catch (e: unknown) {
      const error = e as HttpErrorResponse;
      this.onShowInfoModal(
        'failure',
        'Excluir registro',
        error.error?.message || 'Erro desconhecido'
      );
    } finally {
      this.isComponentSetToDefault.set(true);
      this.isLoading.set(false);
    }
  };

  async onDelete(selectedData: IProductHome): Promise<void> {
    await this.onDeleteRegister(selectedData.idProduct as number);
  }

  onShowModalToDeleteThroughTopBtn(): void {
    this.onShowAskModal(
      'Cadastro de atividades',
      `Deseja excluir o registro <b>${this.data().name}</b>?`,
      () => this.onDelete(this.data())
    );
  }

  onShowModalToDeleteThroughTableBtn(data?: IProductHome): void {
    const selectedData = data ? data : this.data();
    this.onShowAskModal(
      'Cadastro de atividades',
      `Deseja excluir o registro <b>${selectedData.name}</b>?`,
      () => this.onDelete(selectedData)
    );
  }
}
