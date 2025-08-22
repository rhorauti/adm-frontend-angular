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
  ViewChildren,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbComponent } from '@components/breadcrumb/breadcrumb.component';
import { ButtonLabelComponent } from '@components/button/button-label/button-label.component';
import { InputComponent } from '@components/input/input.component';
import { TextAreaComponent } from '@components/text-area/text-area.component';
import { EmployeePositionApi } from '@core/http/employee/employee-position.api';
import { IEmployeePosition } from '@core/interfaces/employee.interface';
import { ActionCallback } from '@core/interfaces/modal.interface';
import { BaseRegisterStore } from '@store/base/base.register.store';
import { ModalStore } from '@store/modal/modal.store';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-employee-position-form',
  imports: [
    BreadcrumbComponent,
    CommonModule,
    ButtonLabelComponent,
    FormsModule,
    InputComponent,
    TextAreaComponent,
  ],
  templateUrl: './employee-position-form.component.html',
  styleUrl: './employee-position-form.component.scss',
})
export class EmployeePositionFormComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChildren(InputComponent) inputs!: QueryList<InputComponent>;
  @ViewChildren('labelForm') private labels!: QueryList<ElementRef>;
  readonly employeePositionApi = inject(EmployeePositionApi);
  readonly baseRegisterStore = inject(BaseRegisterStore);
  private activatedRoute = inject(ActivatedRoute);
  readonly router = inject(Router);
  readonly modalStore = inject(ModalStore);

  private cdr = inject(ChangeDetectorRef);

  currentView = 'employee-positions';
  currentViewTranslated = 'Cargos'.slice(0, -1);
  subscription: Subscription | undefined = undefined;
  breadcrumbList: string[] = [];
  id = 0;

  data = {
    idEmployeePosition: 0,
    name: '',
    comment: '',
  } as IEmployeePosition;

  async ngOnInit(): Promise<void> {
    this.subscription = this.activatedRoute.paramMap.subscribe(params => {
      this.id = Number(params.get('id')) || 0;
    });
    if (this.id != 0) {
      await this.onGetDataDetails();
    } else {
      if (this.baseRegisterStore.isCopiedData()) {
        this.id = (this.baseRegisterStore.data() as IEmployeePosition).idEmployeePosition;
        await this.onGetDataDetails();
        this.id = 0;
        this.data.idEmployeePosition = 0;
        this.baseRegisterStore.onSetSlicePropsToNewValue('isCopiedData', false);
      }
    }
    this.defineTitle();
    this.breadcrumbList = ['Cadastro', this.currentViewTranslated, `${this.defineTitle()}`];
  }

  defineTitle = (): string => {
    if (this.id == 0) {
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

  onGetDataDetails = async (): Promise<void> => {
    try {
      this.modalStore.onLoading(true);
      const response = await this.employeePositionApi.onGetDataInfo(this.id);
      const data = response.data as IEmployeePosition;
      this.data = data;
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

  onBackToPreviousPage = (): void => {
    this.modalStore.onRedirectPage(`/${this.currentView}`);
  };

  onSaveRegister = async (onActionOk?: ActionCallback): Promise<void> => {
    try {
      this.modalStore.onLoading(true);
      const response = await this.employeePositionApi.onSave(this.data);
      if (response.status) {
        this.modalStore.onSetModalInfoType('success');
        this.modalStore.onShowInfoModal(
          `Cadastro de ${this.currentViewTranslated}`,
          response.message,
          onActionOk
        );
      } else {
        this.modalStore.onShowInfoModal(
          `Cadastro de ${this.currentViewTranslated}`,
          response.error?.message || ''
        );
      }
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

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
