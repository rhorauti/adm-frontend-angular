import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { HelpComponent } from '@components/help/help.component';
import { LoadingComponent } from '@components/loading/loading.component';
import { ModalInfoComponent } from '@components/modal/modal-info/modal-info.component';
import { AuthApi } from '@core/api/http/auth.api';
import { ButtonLabelComponent } from '../../../components/button/button-label/button-label.component';
import { InputComponent } from '@components/input/input.component';
import { AuthStore } from '@store/auth/auth.store';
import { ModalStore } from '@store/modal/modal.store';

@Component({
  selector: 'app-new-password',
  imports: [
    CommonModule,
    InputComponent,
    ModalInfoComponent,
    LoadingComponent,
    MatIconModule,
    HelpComponent,
    ButtonLabelComponent,
  ],
  templateUrl: './new-password.component.html',
  styleUrl: './new-password.component.scss',
})
export class NewPasswordComponent implements OnInit {
  private authApi = inject(AuthApi);
  private activatedRoute = inject(ActivatedRoute);
  readonly authStore = inject(AuthStore);
  readonly modalStore = inject(ModalStore);

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      const token = params['token'];
      this.authStore.onGetToken(token);
    });
  }

  /**
   * authenticateUser
   * Função que submete os dados para o backend para criação do novo usuário.
   */
  async createNewPassword(): Promise<void> {
    this.authStore.onLoading(true);
    try {
      const response = await this.authApi.createNewPassword(this.authStore.user().password);
      if (response.status) {
        this.modalStore.onModalInfoActionOk(true);
      }
      this.modalStore.onShowInfoModal('Autenticação', response.message);
    } catch (e: any) {
      this.modalStore.onShowInfoModal('Autenticação', e.error.message);
    } finally {
      this.authStore.onLoading(false);
    }
  }
}
