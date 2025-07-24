import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalInfoComponent } from '@components/modal/modal-info/modal-info.component';
import { LoadingComponent } from '@components/loading/loading.component';
import { AuthApi } from '@core/http/auth/auth.api';
import { ButtonLabelComponent } from '../../../components/button/button-label/button-label.component';
import { InputComponent } from '@components/input/input.component';
import { ModalStore } from '@store/modal/modal.store';
import { AuthStore } from '@store/auth/auth.store';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [
    MatIconModule,
    CommonModule,
    FormsModule,
    InputComponent,
    ModalInfoComponent,
    LoadingComponent,
    ButtonLabelComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  readonly authApi = inject(AuthApi);
  readonly router = inject(Router);
  readonly modalStore = inject(ModalStore);
  readonly authStore = inject(AuthStore);

  onKeyBordEnter(event: KeyboardEvent): void {
    if (event.key == 'Enter') {
      this.submitUserData();
    }
  }

  onCloseLoginModal(): void {
    this.modalStore.onCloseInfoModal(() => {
      this.authStore.onShowMenuBar(true);
      this.router.navigate(['/companies']);
    });
  }

  /**
   * authenticateUser
   * Função que envia os dados do usuário (email e senha) para validação do backend
   */
  async submitUserData(): Promise<void> {
    this.authStore.onLoading(true);
    try {
      if (this.authStore.user().email.length == 0) {
        this.modalStore.onShowInfoModal('Autenticação', 'Campo de e-mail não pode estar vazio.');
      } else if (this.authStore.user().password.length == 0) {
        this.modalStore.onShowInfoModal('Autenticação', 'Campo de senha não pode estar vazio.');
      } else {
        const response = await this.authApi.authenticateUser({
          email: this.authStore.user().email,
          password: this.authStore.user().password,
        });
        if (response.status) {
          this.authStore.onSetUserProperty('id', response.data.id);
          this.authStore.onSetUserProperty('name', response.data.name);
          this.authStore.onSetUserProperty('email', response.data.email);
          this.authStore.onSetUserProperty('token', response.data.token);
          this.modalStore.onModalInfoActionOk(true);
        }
        this.modalStore.onShowInfoModal('Autenticação', response.message);
      }
    } catch (e: unknown) {
      const error = e as HttpErrorResponse;
      this.modalStore.onShowInfoModal('Autenticação', error.message);
    } finally {
      this.authStore.onLoading(false);
    }
  }
}
