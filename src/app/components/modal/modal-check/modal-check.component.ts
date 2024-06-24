import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ModalBaseComponent } from '../modal-base/modal-base.component';
import { ButtonStandardComponent } from '../../button/button-standard/button-standard.component';
import { ICompany } from '../../../core/api/interfaces/IRegister';
import { RegisterCompanyApi } from '../../../core/api/http/register.api';
import { LoadingComponent } from '../../loading/loading.component';
import { IModal } from '../../../core/api/interfaces/IModal';
import { ModalInfoComponent } from '../modal-info/modal-info.component';

interface IFormData {
  title: string;
  description: string;
}

@Component({
  selector: 'app-modal-check',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    ModalBaseComponent,
    ModalInfoComponent,
    ButtonStandardComponent,
    LoadingComponent,
  ],
  providers: [RegisterCompanyApi],
  templateUrl: './modal-check.component.html',
  styleUrl: './modal-check.component.scss',
})
export class ModalCheckComponent implements OnChanges {
  constructor(private registerCompanyApi: RegisterCompanyApi) {}
  @Input() companyData: ICompany = {
    id: 0,
    cadastro: new Date(),
    nome: '',
    email: '',
    telefone: '',
    isCnpj: false,
    cnpj: '',
    logradouro: '',
    numero: 0,
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
  };
  public firstIdx1 = 0;
  public firstIdx2 = 0;
  public lastIdx1 = 0;
  public lastIdx2 = 0;
  public sizeArrayFormData = 8;
  public arrayFormData: IFormData[] = [{ title: '', description: '' }];

  ngOnChanges() {
    const arrayKeys = Object.keys(this.companyData);
    const arrayValues = Object.values(this.companyData);
    this.arrayFormData = arrayKeys.map((key, idx) => ({
      title: key,
      description: arrayValues[idx],
    }));
    if (this.arrayFormData.length > this.sizeArrayFormData) {
      this.lastIdx1 = Math.ceil(this.arrayFormData.length / 2);
      this.firstIdx2 = this.lastIdx1;
      this.lastIdx2 = this.arrayFormData.length;
    }
  }

  @Input() isModalCheckActive = false;

  showModalCheck() {
    this.isModalCheckActive = true;
  }

  @Output() closeModalCheckEmitter = new EventEmitter<boolean>();

  closeModalCheck() {
    this.closeModalCheckEmitter.emit(false);
  }

  public isModalInfoActive = false;
  @Output() changeBtnProsseguirStatusFormEmitter = new EventEmitter<boolean>();
  @Output() closeModalFormEmitter = new EventEmitter<boolean>();

  public isModalResultOk = false;

  /**
   * closeModalInfo
   * Fecha o formulário de double-check e registra os dados caso o usuário clique em salvar e caso cancele reseta o botão prosseguir do modal form.
   * @param isFalse boolean false
   */
  closeModalInfoAfterRegisterOk(isFalse: boolean): void {
    if (!this.isModalResultOk) {
      this.isModalInfoActive = isFalse;
      this.closeModalCheck();
    } else {
      this.isModalInfoActive = isFalse;
      this.closeModalCheck();
      this.closeModalFormEmitter.emit(false);
      this.isModalResultOk = false;
    }
  }

  public modalInfo: IModal = {
    modalType: '',
    modalDescription: '',
  };

  /**
   * handleSuccessModal
   * Função que popula os dados do modal no caso de email ou senha validados corretamente.
   */
  handleSuccessModal(message: string): void {
    this.modalInfo = {
      modalType: 'success',
      modalDescription: message,
    };
  }

  /**
   * handleFailureModal
   * Função que popula os dados do modal no caso de email ou senha digitados incorretamente.
   */
  handleFailureModal(message: string): void {
    this.modalInfo = {
      modalType: 'failure',
      modalDescription: message,
    };
  }

  public showLoading = false;
  @Input() registerType: string | null = '';
  @Output() resetPageEmitter = new EventEmitter<boolean>();

  async registerData() {
    this.showLoading = true;
    try {
      switch (this.registerType) {
        case 'customers': {
          const newRegisterResponse = await this.registerCompanyApi.addNewCompany(
            this.companyData,
            'customers'
          );
          this.handleSuccessModal(newRegisterResponse.message);
          break;
        }
        case 'suppliers': {
          const newRegisterResponse = await this.registerCompanyApi.addNewCompany(
            this.companyData,
            'suppliers'
          );
          this.handleSuccessModal(newRegisterResponse.message);
          break;
        }
      }
      this.isModalResultOk = true;
      this.isModalInfoActive = true;
      this.resetPageEmitter.emit(true);
    } catch (e: any) {
      this.handleFailureModal(e.error.message);
      this.isModalInfoActive = true;
    } finally {
      this.showLoading = false;
    }
  }

  @Input() isEditForm = false;

  async editData(): Promise<void> {
    this.showLoading = true;
    try {
      switch (this.registerType) {
        case 'customers': {
          const customerData = await this.registerCompanyApi.updateCompany(
            this.companyData,
            'customers',
            this.companyData.id
          );
          this.handleSuccessModal(customerData.message);
          break;
        }
        case 'suppliers': {
          const supplierData = await this.registerCompanyApi.updateCompany(
            this.companyData,
            'suppliers',
            this.companyData.id
          );
          this.handleSuccessModal(supplierData.message);
          break;
        }
      }
      this.isModalResultOk = true;
      this.isModalInfoActive = true;
      this.resetPageEmitter.emit();
    } catch (e: any) {
      this.handleFailureModal(e.error.message);
      this.isModalInfoActive = true;
    } finally {
      this.showLoading = false;
    }
  }
}
