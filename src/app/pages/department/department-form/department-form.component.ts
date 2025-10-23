import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  QueryList,
  signal,
  ViewChildren,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbComponent } from '@components/breadcrumb/breadcrumb.component';
import { ButtonLabelComponent } from '@components/button/button-label/button-label.component';
import { InputComponent } from '@components/input/input.component';
import { LoadingComponent } from '@components/loading/loading.component';
import { ModalInfoComponent } from '@components/modal/modal-info/modal-info.component';
import { TextAreaComponent } from '@components/text-area/text-area.component';
import { DepartmentApi } from '@core/http/department/department.api';
import { IDepartment } from '@core/interfaces/department.interface';
import { ActionCallback, IModalInfo } from '@core/interfaces/modal.interface';
import { BaseApiName } from '@core/types/base.type';
import { ModalType } from '@store/modal/modal.store';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-department-form',
  imports: [
    BreadcrumbComponent,
    CommonModule,
    ButtonLabelComponent,
    FormsModule,
    InputComponent,
    TextAreaComponent,
    ModalInfoComponent,
    LoadingComponent,
  ],
  templateUrl: './department-form.component.html',
  styleUrl: './department-form.component.scss',
})
export class DepartmentFormComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChildren(InputComponent) inputs!: QueryList<InputComponent>;
  @ViewChildren('labelForm') private labels!: QueryList<ElementRef>;
  readonly departmentApi = inject(DepartmentApi);
  private activatedRoute = inject(ActivatedRoute);
  readonly router = inject(Router);

  private cdr = inject(ChangeDetectorRef);

  currentView: BaseApiName = 'departments';
  currentViewTranslated = 'Departamentos'.slice(0, -1);
  subscription: Subscription | undefined = undefined;
  breadcrumbList: string[] = [];
  id = 0;

  data = {
    idDepartment: 0,
    name: '',
    comment: '',
  } as IDepartment;

  modalInfo = signal<IModalInfo>({
    isActive: false,
    title: '',
    description: '',
    type: '',
    onActionOk: null,
  });

  isLoading = signal(false);

  async ngOnInit(): Promise<void> {
    this.subscription = this.activatedRoute.paramMap.subscribe(params => {
      this.id = Number(params.get('id')) || -1;
    });
    if (this.router.url.includes('edit') && (this.id || 0) > 0) {
      const dataList = await this.departmentApi.onGetDataById(this.id || 0);
      this.data = dataList.data as IDepartment;
    } else if (this.router.url.includes('new') && (this.id || 0) > 0) {
      const dataList = await this.departmentApi.onGetDataById(this.id || 0);
      this.data = dataList.data as IDepartment;
      this.data.idDepartment = null;
    }
    this.defineTitle();
    this.breadcrumbList = ['Cadastro', this.currentViewTranslated, `${this.defineTitle()}`];
  }

  defineTitle = (): string => {
    if (this.id == -1) {
      return 'Novo Registro';
    } else {
      return this.data.name;
    }
  };

  ngAfterViewInit(): void {
    this.onDefineInputId();
    this.cdr.detectChanges();
  }

  onDefineInputId = () => {
    this.inputs.forEach((input, index) => {
      input.id = `${this.currentView}-form-${index}`;
      this.labels.get(index)?.nativeElement.setAttribute('for', input.id);
    });
  };

  onBackToPreviousPage = (): void => {
    this.router.navigate([`/${this.currentView}`]);
  };
  fieldValidation = (): void => {
    const message = 'O campo Departamento não pode estar vazio.';
    if (this.data && this.data.name.length == 0) {
      throw Error(message);
    }
  };

  onSaveRegister = async (onActionOk?: ActionCallback): Promise<void> => {
    try {
      this.isLoading.set(true);
      this.fieldValidation();
      const response = await this.departmentApi.onSave(this.data);
      if (response.status) {
        this.onShowInfoModal(
          'success',
          `Cadastro de ${this.currentViewTranslated}`,
          response.message,
          onActionOk
        );
      } else {
        this.onShowInfoModal(
          'failure',
          `Cadastro de ${this.currentViewTranslated}`,
          response.error?.message || ''
        );
      }
    } catch (e: unknown) {
      if (e instanceof HttpErrorResponse) {
        const error = e as HttpErrorResponse;
        this.onShowInfoModal(
          'failure',
          `Cadastro de ${this.currentViewTranslated}`,
          error.error?.message || 'Erro desconhecido'
        );
      } else {
        this.onShowInfoModal(
          'failure',
          `Cadastro de ${this.currentViewTranslated}`,
          (e as Error).message
        );
      }
    } finally {
      this.isLoading.set(false);
    }
  };

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

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
