import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HomeComponent } from '@components/home/home.component';
import { LoadingComponent } from '@components/loading/loading.component';
import { ModalAskComponent } from '@components/modal/modal-ask/modal-ask.component';
import { ModalInfoComponent } from '@components/modal/modal-info/modal-info.component';
import { ProductTypeApi } from '@core/http/product/product-type.api';
import { ActionCallback, IModalAsk, IModalInfo } from '@core/interfaces/modal.interface';
import { IProductType } from '@core/interfaces/product.interface';
import { ITableHeader } from '@core/interfaces/table.interface';
import { KeyOfData } from '@core/types/base.type';
import { loadStorage } from '@core/utils/misc';
import { AuthStore } from '@store/auth/auth.store';
import { defaultTableHeaderIcon } from '@store/base/base.register.store';
import { ModalType } from '@store/modal/modal.store';

@Component({
  selector: 'app-product-type-home',
  imports: [HomeComponent, ModalAskComponent, ModalInfoComponent, LoadingComponent],
  templateUrl: './product-type-home.component.html',
  styleUrl: './product-type-home.component.scss',
})
export class ProductTypeHomeComponent implements OnInit {
  readonly authStore = inject(AuthStore);
  readonly productTypeApi = inject(ProductTypeApi);
  readonly router = inject(Router);

  readonly currentView = 'product-types';
  readonly currentViewTranslated = 'Tipos de produtos';
  readonly keyId = 'idProductType';
  readonly breadcrumbList = ['Cadastro', 'Tipos de Produtos'];
  readonly inputSearchFilterList: KeyOfData[] = ['idProductType', 'name', 'comment'];
  readonly inputSearchPlaceholder = 'Id, Tipo de produto';

  tableHeadersLocalStorageId = `table_headers_${this.currentView}_${this.authStore.user().id}`;
  isComponentSetToDefault = signal(false);
  initialDataList = signal<IProductType[]>([]);
  data = signal<IProductType>({
    idProductType: null,
    name: '',
    comment: '',
  });

  newRegisterUrl = `/${this.currentView}/new`;

  tableHeaders = [
    {
      id: 0,
      isHeaderActive: true,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'Id',
      databaseField: 'idProductType',
    },
    {
      id: 1,
      isHeaderActive: true,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'Tipo de produto',
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
  ] as ITableHeader<IProductType>[];

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

  onRedirectToEditPage = (data: IProductType): void => {
    this.router.navigate([`/${this.currentView}/edit/${data.idProductType}`]);
  };

  onCloneRegister = (data: IProductType): void => {
    this.router.navigate([`/${this.currentView}/new/${data.idProductType}`]);
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
      const response = await this.productTypeApi.onGetDataList();
      if (response.data) {
        const dataList = response.data as IProductType[];
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
      const response = await this.productTypeApi.onDelete(id);
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

  async onDelete(selectedData: IProductType): Promise<void> {
    await this.onDeleteRegister(selectedData.idProductType as number);
  }

  onShowModalToDeleteThroughTopBtn(): void {
    this.onShowAskModal(
      'Cadastro de atividades',
      `Deseja excluir o registro <b>${this.data().name}</b>?`,
      () => this.onDelete(this.data())
    );
  }

  onShowModalToDeleteThroughTableBtn(data?: IProductType): void {
    const selectedData = data ? data : this.data();
    this.onShowAskModal(
      'Cadastro de atividades',
      `Deseja excluir o registro <b>${selectedData.name}</b>?`,
      () => this.onDelete(selectedData)
    );
  }
}
