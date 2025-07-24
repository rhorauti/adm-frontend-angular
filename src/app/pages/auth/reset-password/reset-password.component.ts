import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { ModalInfoComponent } from '@components/modal/modal-info/modal-info.component';
import { LoadingComponent } from '@components/loading/loading.component';
import { AuthApi } from '@core/http/auth/auth.api';
import { ButtonLabelComponent } from '../../../components/button/button-label/button-label.component';
import { InputComponent } from '@components/input/input.component';
import { HelpComponent } from '@components/help/help.component';
import { AuthStore } from '@store/auth/auth.store';
import { ModalStore } from '@store/modal/modal.store';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-reset-password',
  imports: [
    CommonModule,
    FormsModule,
    InputComponent,
    MatIconModule,
    ModalInfoComponent,
    LoadingComponent,
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

  onCloseResetPasswordInfoModal(): void {
    this.modalStore.onCloseInfoModal(() => {
      this.modalStore.onRedirectPage('/login');
    });
  }
  /**
   * authenticateUser
   * Função que envia os dados do usuário (email e senha) para validação do backend
   */
  async getEmailValidation(): Promise<void> {
    this.authStore.onLoading(true);
    try {
      if (this.authStore.user().email.length == 0) {
        this.modalStore.onShowInfoModal(
          'Recuperação de senha',
          'Campo de e-mail não pode estar vazio.'
        );
      } else {
        const response = await this.authApi.getEmailValidation(this.authStore.user().email);
        if (response.status) {
          this.modalStore.onModalInfoActionOk(true);
        }
        this.modalStore.onShowInfoModal('Recuperação de senha', response.message);
      }
    } catch (e: any) {
      const error = e as HttpErrorResponse;
      this.modalStore.onShowInfoModal('Recuperação de senha', error.message);
    } finally {
      this.authStore.onLoading(false);
    }
  }
}
