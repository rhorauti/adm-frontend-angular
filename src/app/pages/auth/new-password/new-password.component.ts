import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { HelpComponent } from '@components/help/help.component';
import { AuthApi } from '@core/http/auth/auth.api';
import { ButtonLabelComponent } from '../../../components/button/button-label/button-label.component';
import { InputComponent } from '@components/input/input.component';
import { AuthStore } from '@store/auth/auth.store';
import { ModalStore } from '@store/modal/modal.store';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-new-password',
  imports: [CommonModule, InputComponent, MatIconModule, HelpComponent, ButtonLabelComponent],
  templateUrl: './new-password.component.html',
  styleUrl: './new-password.component.scss',
})
export class NewPasswordComponent implements OnInit {
  private authApi = inject(AuthApi);
  private activatedRoute = inject(ActivatedRoute);
  readonly authStore = inject(AuthStore);
  readonly modalStore = inject(ModalStore);
  private router = inject(Router);

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      const token = params['token'];
      this.authStore.onGetToken(token);
    });
  }

  onRedirectToLoginPage = (): void => {
    this.authStore.onClearAllData();
    this.modalStore.onRedirectPage('/login');
  };

  /**
   * authenticateUser
   * Função que submete os dados para o backend para criação do novo usuário.
   */
  async createNewPassword(): Promise<void> {
    this.modalStore.onLoading(true);
    try {
      const response = await this.authApi.createNewPassword(this.authStore.user().password);
      this.modalStore.onSetModalInfoType('success');
      this.modalStore.onShowInfoModal('Nova senha', response.message, this.onRedirectToLoginPage);
    } catch (e: unknown) {
      const error = e as HttpErrorResponse;
      this.modalStore.onShowInfoModal('Nova senha', error.error.message);
    } finally {
      this.modalStore.onLoading(false);
    }
  }
}
