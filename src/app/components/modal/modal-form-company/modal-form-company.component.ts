import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ModalBaseComponent } from '../modal-base/modal-base.component';
import { ModalCheckComponent } from '../modal-check/modal-check.component';
import { ModalInfoComponent } from '../modal-info/modal-info.component';
import { InputFormComponent } from '@components/input/input-form/input-form.component';
import { ButtonComponent } from '@components/button/button.component';
import { SelectComponent } from '@components/select/select.component';
import { ICompany } from '@core/interfaces/ICompany';

@Component({
  selector: 'app-modal-form-company',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    ModalBaseComponent,
    ModalCheckComponent,
    ModalInfoComponent,
    InputFormComponent,
    ButtonComponent,
    SelectComponent,
  ],
  templateUrl: './modal-form-company.component.html',
  styleUrl: './modal-form-company.component.scss',
})
export class ModalFormCompanyComponent {
  @ViewChildren('inputModal') inputModal?: QueryList<InputFormComponent>;
  @ViewChildren('selectModal') selectModal?: QueryList<SelectComponent>;

  @Input() isModalFormCompanyActive = false;
  @Input() isEditForm = false;
  @Input() companyData: ICompany = {
    idCompany: 0,
    type: 0,
    date: new Date().toISOString(),
    nickname: '',
    name: '',
    cnpj: '',
  };

  @Output() closeModalFormEmitter = new EventEmitter();

  /**
   * closeModalForm
   * Emite um evento para o componente pai para fechar o modal.
   */
  closeModalForm(): void {
    this.clearForm();
    this.closeModalFormEmitter.emit();
  }

  @Output() followEventEmitter = new EventEmitter();

  emitFollowEvent(): void {
    this.followEventEmitter.emit();
  }

  /**
   * clearForm
   * Limpa o formulário modal-form
   */
  clearForm(): void {
    this.inputModal?.forEach(input => input.clearInput());
    this.selectModal?.forEach(select => select.clearSelect());
    this.companyData.idCompany = 0;
    this.companyData.type = 0;
    this.companyData.date = new Date().toISOString();
    this.companyData.name = '';
    this.companyData.cnpj = '';
  }

  /**
   * getInputIdValue
   * Função que pega o id enviado pelo componente input e salva no objeto companyData do modal.
   * @param id id da empresa
   */
  getInputIdValue(id: string): void {
    this.companyData.idCompany = Number(id);
  }
  /**
   * getInputCadastroValue
   * Função que pega a data do cadastro enviado pelo componente input e salva no objeto companyData do modal.
   * @param cadastro cadastro da empresa
   */
  getInputCadastroValue(cadastro: string): void {
    this.companyData.date = new Date(cadastro).toISOString();
  }

  /**
   * getInputCnpjValue
   * Função que pega o email enviado pelo componente input e salva no objeto companyData do modal.
   * @param cnpj email da empresa
   */
  getInputCnpjValue(cnpj: string): void {
    this.companyData.cnpj = cnpj;
  }
}
