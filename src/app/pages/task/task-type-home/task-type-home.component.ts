import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from '@components/table/table.component';
import { BreadcrumbComponent } from '@components/breadcrumb/breadcrumb.component';
import { TableHeaderBoxComponent } from '@components/side-bar/side-bar.component';
import { PaginationComponent } from '@components/pagination/pagination.component';
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
import { BaseApiName, KeyOfData } from '@core/types/base.type';
import { ITableHeader } from '@core/interfaces/table.interface';
import { ITaskType } from '@core/interfaces/task.interface';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { IDepartment } from '@core/interfaces/department.interface';
import { DataTransferService } from 'app/services/data-transfer/data-transfer.service';
import { TaskTypeApi } from '@core/http/task-type/task-type.api';
import { DepartmentApi } from '@core/http/department/department.api';

@Component({
  selector: 'app-task-type-home',
  imports: [
    CommonModule,
    TableHeaderBoxComponent,
    InputComponent,
    TableComponent,
    PaginationComponent,
    BreadcrumbComponent,
    MatIconModule,
    ButtonLabelComponent,
    ButtonDeleteComponent,
    ButtonIconComponent,
    TooltipComponent,
    ToogleButtonComponent,
    ButtonCloseComponent,
  ],
  templateUrl: './task-type-home.component.html',
  styleUrl: './task-type-home.component.scss',
})
export class TaskTypeHomeComponent implements OnInit {
  readonly taskTypeApi = inject(TaskTypeApi);
  readonly departmentApi = inject(DepartmentApi);
  readonly baseRegisterStore = inject(BaseRegisterStore);
  readonly dataTransferService = inject(DataTransferService<IDepartment>);
  private activatedRoute = inject(ActivatedRoute);
  subscription: Subscription | undefined = undefined;

  data = {
    idTaskType: 0,
    name: '',
    comment: '',
    department: {
      idDepartment: 0,
      name: '',
      comment: '',
    },
  } as ITaskType;

  readonly authStore = inject(AuthStore);
  readonly modalStore = inject(ModalStore);

  readonly currentView = 'task-types';
  relatedView: BaseApiName = 'departments';
  currentViewTranslated = 'Departmentos';
  readonly breadcrumbList = ['Cadastro', 'Tipos de atividades'];
  readonly inputSearchFilterList: KeyOfData[] = ['idTaskType', 'name', 'comment'];
  readonly inputSearchPlaceholder = 'Id ou Tipo';
  readonly initialTableHeaders = [
    {
      id: 0,
      isHeaderActive: true,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'Id',
      databaseField: 'idTaskType',
    },
    {
      id: 1,
      isHeaderActive: true,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'Nome da atividade',
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
  ] as ITableHeader<ITaskType>[];
  tableHeadersLocalStorageId = `table_headers_${this.currentView} + ${this.authStore.user().id}`;
  idDepartment = 0;

  async ngOnInit() {
    this.subscription = this.activatedRoute.paramMap.subscribe(params => {
      this.idDepartment = Number(params.get('idDepartment')) || 0;
    });
    this.onShowDataList();
    const tableHeaders = await loadStorage(this.tableHeadersLocalStorageId);
    const headers = tableHeaders ? tableHeaders : this.initialTableHeaders;
    this.baseRegisterStore.onSetSlicePropsToNewValue('tableHeaders', headers);
  }

  onGetDepartmentData = async (): Promise<void> => {
    try {
      this.modalStore.onLoading(true);
      const response = await this.departmentApi.onGetData(this.idDepartment);
      const data = response.data as IDepartment;
      this.dataTransferService.data = data;
      console.log('data', this.data);
    } catch (e: unknown) {
      const error = e as HttpErrorResponse;
      this.modalStore.onShowInfoModal(
        `Cadastro de ${this.currentViewTranslated}`,
        error.error.message
      );
    } finally {
      this.modalStore.onLoading(false);
    }
  };

  onRedirectToEditPage = (data: ITaskType): void => {
    this.baseRegisterStore.onSetSlicePropsToNewValue('data', data);
    this.modalStore.onRedirectPage(
      `/${this.currentView}/${this.idDepartment}/edit/${(this.baseRegisterStore.data() as ITaskType).idTaskType}`
    );
  };

  onCloneRegister = async (data: ITaskType): Promise<void> => {
    this.baseRegisterStore.onSetSlicePropsToNewValue('isCopiedData', true);
    this.baseRegisterStore.onSetSlicePropsToNewValue('data', data);
    this.modalStore.onRedirectPage(`/${this.currentView}/${this.idDepartment}/new`);
  };

  onShowDataList = async (): Promise<void> => {
    try {
      this.modalStore.onLoading(true);
      const response = await this.taskTypeApi.onGetDataList(this.currentView);
      const data = response.data as ITaskType[];
      this.baseRegisterStore.onSetSlicePropsToNewValue('initialData', data);
      this.baseRegisterStore.onSetSlicePropsToNewValue('dataList', data);
      this.baseRegisterStore.onClearData(data);
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
      const response = await this.taskTypeApi.onDelete(this.currentView, id);
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

  async onDelete(data: ITaskType): Promise<void> {
    await this.onDeleteRegister(data.idTaskType);
  }

  onShowModalToDelete(data?: ITaskType): void {
    const selectedData = data ? data : (this.baseRegisterStore.itemSelected() as ITaskType) || '';
    this.modalStore.onShowAskModal(
      'Cadastro de departamentos',
      `Deseja excluir o registro <b>${selectedData.name}</b>?`,
      () => this.onDelete(selectedData)
    );
  }
}
