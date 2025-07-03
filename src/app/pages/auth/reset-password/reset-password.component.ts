import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalInfoComponent } from '@components/modal/modal-info/modal-info.component';
import { LoadingComponent } from '@components/loading/loading.component';
import { AuthApi } from '@core/api/http/auth.api';
import { ButtonLabelComponent } from '../../../components/button/button-label/button-label.component';
import { InputComponent } from '@components/input/input.component';

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
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
  private authApi = inject(AuthApi);
  private router = inject(Router);

  // resetPasswordData: IRequestResetPassword = {
  //   email: '',
  // };

  public email = '';

  public isModalActive = false;
  public isLoadingActive = false;
  public modalInfo: any = {
    type: '',
    description: '',
  };

  /**
   * getEmailValue
   * Função que pega o valor do componente input e-mail
   * @param emailValue
   */
  getEmailValue(emailValue: string): void {
    this.email = emailValue;
  }

  /**
   * handleSuccessModal
   * Função que popula os dados do modal no caso de email ou senha validados corretamente.
   */
  handleSuccessModal(message: string): void {
    this.modalInfo = {
      type: 'success',
      description: message,
    };
  }

  /**
   * handleFailureModal
   * Função que popula os dados do modal no caso de email ou senha digitados incorretamente.
   */
  handleFailureModal(message: string): void {
    this.modalInfo = {
      type: 'failure',
      description: message,
    };
  }

  isEmailValid = false;

  /**
   * authenticateUser
   * Função que envia os dados do usuário (email e senha) para validação do backend
   */
  async getEmailValidation(): Promise<void> {
    this.isLoadingActive = true;
    try {
      if (this.email.length == 0) {
        this.handleFailureModal('Campo email vazio!');
      } else {
        const response = await this.authApi.getEmailValidation(this.email);
        if (response) {
          this.handleSuccessModal(response.message);
          this.isEmailValid = true;
        }
      }
      this.isModalActive = true;
    } catch (e: any) {
      this.handleFailureModal(e.error.message);
      this.isModalActive = true;
    } finally {
      this.isLoadingActive = false;
    }
  }

  /**
   * closeModal
   * Função que fecha o modal e direciona o usuário para a tela inicial da aplicação.
   * @param modalStatus
   */
  closeModal(modalStatus: boolean): void {
    if (!this.isEmailValid) {
      this.isModalActive = modalStatus;
    } else {
      this.isModalActive = modalStatus;
      this.redirectToLoginPage();
    }
  }

  /**
   * redirectToNewUser
   * Função que redireciona o usuário para a tela de cadastro.
   */
  redirectToNewUserPage(): void {
    this.router.navigate(['/signup']);
  }

  /**
   * redirectToLoginPage
   * Função que redireciona o usuário para a tela de login.
   */
  redirectToLoginPage(): void {
    this.router.navigate(['/login']);
  }
}
