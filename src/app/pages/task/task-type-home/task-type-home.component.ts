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
  private activatedRoute = inject(ActivatedRoute);
  subscription: Subscription | undefined = undefined;

  readonly authStore = inject(AuthStore);
  readonly modalStore = inject(ModalStore);

  readonly currentView = 'task-types';
  relatedView: BaseApiName = 'departments';
  readonly breadcrumbList = ['Cadastro', 'Tipos de atividades'];
  readonly inputSearchFilterList: KeyOfData[] = ['idTaskType', 'name', 'comment'];
  readonly inputSearchPlaceholder = 'Id ou Nome, Comentários';
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
  deptName = '';

  async ngOnInit() {
    this.subscription = this.activatedRoute.paramMap.subscribe(params => {
      this.deptName = params.get('department') || '';
    });
    this.onShowDataList();
    const tableHeaders = await loadStorage(this.tableHeadersLocalStorageId);
    const headers = tableHeaders ? tableHeaders : this.initialTableHeaders;
    this.baseRegisterStore.onSetSlicePropsToNewValue('tableHeaders', headers);
  }

  onRedirectToEditPage = (data: ITaskType): void => {
    this.baseRegisterStore.onSetSlicePropsToNewValue('data', data);
    this.baseRegisterStore.onSetSlicePropsToNewValue('isEditData', true);
    this.modalStore.onRedirectPage(
      `/${this.deptName}/${this.currentView}/edit/${(this.baseRegisterStore.data() as ITaskType).idTaskType}`
    );
  };

  onCloneRegister = async (data: ITaskType): Promise<void> => {
    this.baseRegisterStore.onSetSlicePropsToNewValue('isCopiedData', true);
    this.baseRegisterStore.onSetSlicePropsToNewValue('data', data);
    this.modalStore.onRedirectPage(`/${this.deptName}/${this.currentView}/new`);
  };

  onShowDataList = async (): Promise<void> => {
    try {
      this.modalStore.onLoading(true);
      const response = await this.taskTypeApi.onGetDataList(this.deptName);
      if (response.data) {
        const dataList = response.data as ITaskType[];
        this.baseRegisterStore.onSetSlicePropsToNewValue('initialData', dataList);
        this.baseRegisterStore.onSetSlicePropsToNewValue('dataList', dataList);
        this.baseRegisterStore.onClearData(dataList);
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
      const response = await this.taskTypeApi.onDelete(this.deptName, id);
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
    await this.onDeleteRegister(data.idTaskType as number);
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
