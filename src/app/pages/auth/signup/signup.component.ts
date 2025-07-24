import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { HelpComponent } from '@components/help/help.component';
import { LoadingComponent } from '@components/loading/loading.component';
import { ModalInfoComponent } from '@components/modal/modal-info/modal-info.component';
import { AuthApi } from '@core/http/auth/auth.api';
import { ButtonLabelComponent } from '../../../components/button/button-label/button-label.component';
import { InputComponent } from '@components/input/input.component';
import { AuthStore } from '@store/auth/auth.store';
import { ModalStore } from '@store/modal/modal.store';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  imports: [
    CommonModule,
    InputComponent,
    ModalInfoComponent,
    LoadingComponent,
    MatIconModule,
    HelpComponent,
    ButtonLabelComponent,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  private authApi = inject(AuthApi);
  readonly router = inject(Router);
  readonly authStore = inject(AuthStore);
  readonly modalStore = inject(ModalStore);

  onCloseSignUpInfoModal(): void {
    this.modalStore.onCloseInfoModal(() => {
      this.modalStore.onRedirectPage('/login');
    });
  }

  /**
   * authenticateUser
   * Função que submete os dados para o backend para criação do novo usuário.
   */
  async createNewUser(): Promise<void> {
    this.authStore.onLoading(true);
    try {
      const response = await this.authApi.createNewUser({
        name: this.authStore.user().name,
        email: this.authStore.user().email,
        password: this.authStore.user().password,
        photoUrl: this.authStore.user().photoUrl,
      });
      if (response.status) {
        this.modalStore.onModalInfoActionOk(true);
      }
      this.modalStore.onShowInfoModal('Novo usuário', response.message);
    } catch (e: unknown) {
      const error = e as HttpErrorResponse;
      this.modalStore.onShowInfoModal('Novo usuário', error.message);
    } finally {
      this.authStore.onLoading(false);
    }
  }
}
