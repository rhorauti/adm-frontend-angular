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
import { ListBoxComponent } from '@components/list-box/list-box.component';
import { LoadingComponent } from '@components/loading/loading.component';
import { ModalInfoComponent } from '@components/modal/modal-info/modal-info.component';
import { TextAreaComponent } from '@components/text-area/text-area.component';
import { ToogleButtonComponent } from '@components/toogle-button/toogle-button.component';
import { ProductApi } from '@core/http/product/product.api';
import { ProductionLineApi } from '@core/http/production-line/production-line.api';
import { ActionCallback, IModalInfo } from '@core/interfaces/modal.interface';
import { PartialProduct } from '@core/interfaces/product.interface';
import { IProductionLine } from '@core/interfaces/production-line.interface';
import { BaseApiName } from '@core/types/base.type';
import { ModalType } from '@store/modal/modal.store';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-production-line-form',
  imports: [
    BreadcrumbComponent,
    CommonModule,
    ButtonLabelComponent,
    FormsModule,
    InputComponent,
    TextAreaComponent,
    ListBoxComponent,
    ToogleButtonComponent,
    ModalInfoComponent,
    LoadingComponent,
  ],
  templateUrl: './production-line-form.component.html',
  styleUrl: './production-line-form.component.scss',
})
export class ProductionLineFormComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren(InputComponent) inputs!: QueryList<InputComponent>;
  @ViewChildren('labelForm') private labels!: QueryList<ElementRef>;
  readonly productionLineApi = inject(ProductionLineApi);
  readonly productApi = inject(ProductApi);
  private activatedRoute = inject(ActivatedRoute);
  readonly router = inject(Router);

  private cdr = inject(ChangeDetectorRef);

  currentView: BaseApiName = 'production-lines';
  currentViewTranslated = 'Linhas de Produção';
  subscription: Subscription | undefined = undefined;
  breadcrumbList: string[] = [];
  id = 0;
  showToolingList = true;
  listBoxStringList: string[] = [];
  selectedListBoxStringList: string[] = [];
  listBoxDataList: PartialProduct[] = [];

  productionLineData = {
    idProductionLine: 0,
    lineCode: '',
    lineName: '',
    toolingList: null,
    comment: '',
  } as IProductionLine;

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
    await this.onGetToolingList();
    this.listBoxStringList = this.listBoxDataList.map(
      data => data.internalPartNumber + ' - ' + data.name
    );
    if (this.router.url.includes('edit') && (this.id || 0) > 0) {
      const dataList = await this.productionLineApi.onGetData(this.id || 0);
      this.productionLineData = dataList.data as IProductionLine;
    } else if (this.router.url.includes('new') && (this.id || 0) > 0) {
      const dataList = await this.productionLineApi.onGetData(this.id || 0);
      this.productionLineData = dataList.data as IProductionLine;
      this.productionLineData.idProductionLine = null;
    }
    if (this.productionLineData.toolingList && this.productionLineData.toolingList.length > 0) {
      this.selectedListBoxStringList = this.productionLineData.toolingList.map(
        data => data.internalPartNumber + ' - ' + data.name
      );
    }
    this.defineTitle();
    this.breadcrumbList = ['Cadastro', this.currentViewTranslated, `${this.defineTitle()}`];
  }

  onSetSelectedToolingList = (toolingList: string[]): void => {
    if (!this.showToolingList) {
      this.productionLineData.toolingList = [];
    } else {
      const splittedList = toolingList.map(tooling => tooling.split('-').map(item => item.trim()));
      const mappedList = splittedList.map(item => item[0]);
      const selectedToolingList = this.listBoxDataList.filter(tooling =>
        mappedList.some(pn => pn == tooling.internalPartNumber)
      );
      this.productionLineData.toolingList = selectedToolingList;
    }
  };

  onGetToolingList = async (): Promise<void> => {
    try {
      this.isLoading.set(true);
      const response = await this.productApi.onGetDataListByProductType('name', 'Ativo');
      if (response.data) {
        this.listBoxDataList = response.data as PartialProduct[];
      } else {
        return;
      }
    } catch (e: unknown) {
      const error = e as HttpErrorResponse;
      this.onShowInfoModal('failure', 'Listar tipos de atividades: ', error.error?.message);
    } finally {
      this.isLoading.set(false);
    }
  };

  defineTitle = (): string => {
    if (!this.id || this.id == -1) {
      return 'Novo Registro';
    } else {
      return this.productionLineData.lineCode;
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
    const message = 'O campo Código da Linha não pode estar vazio.';
    if (this.productionLineData && this.productionLineData.lineCode.length == 0) {
      throw Error(message);
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

  onSaveRegister = async (onActionOk?: ActionCallback): Promise<void> => {
    try {
      this.isLoading.set(true);
      this.fieldValidation();
      const response = await this.productionLineApi.onSave(this.productionLineData);
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

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
