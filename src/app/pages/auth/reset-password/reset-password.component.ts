import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { AuthApi } from '@core/http/auth/auth.api';
import { ButtonLabelComponent } from '../../../components/button/button-label/button-label.component';
import { InputComponent } from '@components/input/input.component';
import { HelpComponent } from '@components/help/help.component';
import { AuthStore } from '@store/auth/auth.store';
import { ModalStore } from '@store/modal/modal.store';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  imports: [
    CommonModule,
    FormsModule,
    InputComponent,
    MatIconModule,
    ButtonLabelComponent,
    HelpComponent,
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
  private authApi = inject(AuthApi);
  readonly authStore = inject(AuthStore);
  readonly modalStore = inject(ModalStore);
  private router = inject(Router);

  onRedirectToLoginPage = (): void => {
    this.authStore.onClearAllData();
    this.modalStore.onRedirectPage('/login');
  };

  /**
   * authenticateUser
   * Função que envia os dados do usuário (email e senha) para validação do backend
   */
  async getEmailValidation(): Promise<void> {
    this.modalStore.onLoading(true);
    try {
      if (this.authStore.user().email.length == 0) {
        this.modalStore.onShowInfoModal(
          'Recuperação de senha',
          'Campo de e-mail não pode estar vazio.'
        );
      } else {
        const response = await this.authApi.getEmailValidation(this.authStore.user().email);
        this.modalStore.onSetModalInfoType('success');
        this.modalStore.onShowInfoModal(
          'Recuperação de senha',
          response.message,
          this.onRedirectToLoginPage
        );
      }
    } catch (e: any) {
      const error = e as HttpErrorResponse;
      this.modalStore.onShowInfoModal('Recuperação de senha', error.error.message);
    } finally {
      this.modalStore.onLoading(false);
    }
  }
}
