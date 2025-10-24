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
import { SelectComponent } from '@components/select/select.component';
import { ActionCallback, IModalInfo } from '@core/interfaces/modal.interface';
import { BaseApiName } from '@core/types/base.type';
import { ModalType } from '@store/modal/modal.store';
import { Subscription } from 'rxjs';
import { PhotoBoxSingleComponent } from '@components/photo-box/photo-box-single/photo-box-single.component';
import { ProductApi } from '@core/http/product/product.api';
import { IProductForm, IProductType, PartialProductType } from '@core/interfaces/product.interface';
import { IUnit, PartialUnit } from '@core/interfaces/unit.interface';
import { TextAreaComponent } from '@components/text-area/text-area.component';
import { ModalInfoComponent } from '@components/modal/modal-info/modal-info.component';
import { LoadingComponent } from '@components/loading/loading.component';
import { onSetOriginToNumber, onSetOriginToString, originList } from 'app/enum/origin.enum';
import { currencyList } from '@core/utils/misc';

@Component({
  selector: 'app-product-form',
  imports: [
    BreadcrumbComponent,
    CommonModule,
    ButtonLabelComponent,
    FormsModule,
    InputComponent,
    SelectComponent,
    PhotoBoxSingleComponent,
    TextAreaComponent,
    ModalInfoComponent,
    LoadingComponent,
  ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
})
export class ProductFormComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChildren(InputComponent) inputs!: QueryList<InputComponent>;
  @ViewChildren(SelectComponent) select!: QueryList<SelectComponent>;
  @ViewChildren('labelForm') private labels!: QueryList<ElementRef>;
  readonly productApi = inject(ProductApi);
  private activatedRoute = inject(ActivatedRoute);
  readonly router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  currentView: BaseApiName = 'products';
  currentViewTranslated = 'Produtos'.slice(0, -1);
  subscription: Subscription | undefined = undefined;
  breadcrumbList: string[] = [];
  idProduct = 0;
  idCompany = 0;
  // unitList: PartialUnit[] = [];
  unitOptionList: string[] = [];
  // productTypeList: PartialProductType[] = [];
  productTypeOptionList: string[] = [];

  imgPreview: File | null = null;
  isRemovedPhoto = false;

  selectedOrigin = '';
  ncmList = ['000000', '1111111'];

  productData: IProductForm = {
    idProduct: 0,
    internalPartNumber: '',
    customerPartNumber: '',
    name: '',
    nameTranslated: '',
    origin: 0,
    ncm: '',
    icms: 0,
    pis: 0,
    cofins: 0,
    ipi: 0,
    purchasingCurrency: '',
    purchasingUnitPrice: 0,
    salesCurrency: '',
    salesUnitPrice: 0,
    materialSpec: '',
    width: 0,
    height: 0,
    depth: 0,
    weight: 0,
    qrcode: '',
    photoUrl: '',
    comment: '',
    unitList: [],
    unit: {
      idUnit: 0,
      name: '',
    },
    productTypeList: [],
    productType: {
      idProductType: 0,
      name: '',
    },
  };
  originList = originList;
  currencyList = currencyList;
  onSetOriginToNumber = onSetOriginToNumber;

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
      this.idProduct = Number(params.get('id')) || 0;
    });
    if (this.router.url.includes('edit') && (this.idProduct || 0) > 0) {
      const dataList = await this.productApi.onGetData(this.idProduct || 0);
      this.productData = dataList.data as IProductForm;
    } else if (this.router.url.includes('new') && (this.idProduct || 0) > 0) {
      const dataList = await this.productApi.onGetData(this.idProduct || 0);
      this.productData = dataList.data as IProductForm;
      this.productData.idProduct = null;
    }
    this.selectedOrigin = onSetOriginToString(this.productData.origin ?? 0);
    this.onSetSelectOptionList();
    this.defineTitle();
    this.breadcrumbList = ['Cadastro', this.currentViewTranslated, `${this.defineTitle()}`];
  }

  onSetSelectOptionList = (): void => {
    this.unitOptionList = (this.productData.unitList || []).map(unit => unit.name) as string[];
    this.productTypeOptionList = (this.productData.productTypeList || []).map(
      pt => pt.name
    ) as string[];
  };

  defineTitle = (): string => {
    if (this.idProduct == 0) {
      return 'Novo Registro';
    } else {
      return this.productData ? this.productData.name : '';
    }
  };

  ngAfterViewInit(): void {
    this.onDefineInputId();
    this.cdr.detectChanges();
  }

  onDefineInputId = () => {
    this.inputs.forEach((input, index) => {
      input.id = `${this.currentView}-form-input-${index}`;
      this.labels.get(index)?.nativeElement.setAttribute('for', input.id);
    });
  };

  onDefineSelectId = () => {
    this.select.forEach((select, index) => {
      select.id = `${this.currentView}-form-select-${index}`;
      this.labels.get(index)?.nativeElement.setAttribute('for', select.id);
    });
  };

  setUnitValue = (unitName: string): void => {
    this.productData.unit = this.productData.unitList?.find(
      unit => unit.name?.trim() == unitName.trim()
    ) as IUnit;
    if (!this.productData.unit) {
      this.productData.unit = {
        idUnit: null,
        name: '',
      };
    }
    console.log('unit', this.productData.unit);
  };

  setProductTypeValue = (productTypeName: string): void => {
    console.log('name', productTypeName);
    this.productData.productType = this.productData.productTypeList?.find(
      type => type.name?.trim() == productTypeName.trim()
    ) as IProductType;
    console.log('productTypé', this.productData.productType);
    if (!this.productData.productType) {
      this.productData.productType = {
        idProductType: null,
        name: '',
      };
    }
  };

  onFileChange = (file: File | null): void => {
    if (file == null) {
      this.isRemovedPhoto = true;
      this.imgPreview = null;
    } else {
      this.imgPreview = file;
      this.isRemovedPhoto = false;
    }
  };

  onBackToPreviousPage = (): void => {
    this.router.navigate([`/${this.currentView}`]);
  };

  fieldValidation = (): void => {
    let message = '';
    if (this.productData && this.productData.name.length == 0) {
      message = 'O campo Nome não pode estar vazio.';
    }
    if (message.length > 0) {
      throw Error(message);
    }
  };

  onSetJsonData = (): IProductForm => {
    return {
      idProduct: this.productData.idProduct,
      internalPartNumber: this.productData.internalPartNumber ?? '',
      customerPartNumber: this.productData.customerPartNumber ?? '',
      name: this.productData.name ?? '',
      nameTranslated: this.productData.nameTranslated ?? '',
      ncm: this.productData.ncm ?? '',
      icms: this.productData.icms ?? 0,
      pis: this.productData.pis ?? 0,
      cofins: this.productData.cofins ?? 0,
      ipi: this.productData.ipi ?? 0,
      origin: this.productData.origin ?? 0,
      purchasingCurrency: this.productData.purchasingCurrency ?? '',
      purchasingUnitPrice: this.productData.purchasingUnitPrice ?? 0,
      salesCurrency: this.productData.salesCurrency ?? '',
      salesUnitPrice: this.productData.salesUnitPrice ?? 0,
      materialSpec: this.productData.materialSpec ?? '',
      width: this.productData.width ?? 0,
      height: this.productData.height ?? 0,
      depth: this.productData.depth ?? 0,
      weight: this.productData.weight ?? 0,
      unit: this.productData.unit ?? null,
      productType: this.productData.productType ?? null,
      comment: this.productData.comment ?? '',
      isRemovedPhoto: this.isRemovedPhoto,
    } as IProductForm;
  };

  setFinalData = (): FormData => {
    const formData = new FormData();
    if (this.imgPreview) {
      formData.append('file', this.imgPreview, this.imgPreview.name);
    }
    const jsonData = this.onSetJsonData();
    formData.append('data', JSON.stringify(jsonData));
    return formData;
  };

  onSaveRegister = async (onActionOk?: ActionCallback): Promise<void> => {
    try {
      const finalData = this.setFinalData();
      this.fieldValidation();
      this.isLoading.set(true);
      const response = await this.productApi.onSave(finalData);
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
