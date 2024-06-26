import { CommonModule } from '@angular/common';
import { Component, Signal, computed, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ButtonStandardComponent } from '@components/button/button-standard/button-standard.component';
import { InputLoginComponent } from '@components/input/input-login/input-login.component';
import { InputValidationComponent } from '@components/input/input-validation/input-validation.component';
import { LoadingComponent } from '@components/loading/loading.component';
import { ModalInfoComponent } from '@components/modal/modal-info/modal-info.component';
import { HttpRequestService } from '@core/api/http-request.service';
import { AuthApi } from '@core/api/http/auth.api';
import { IFormValidation, IRequestSignUp } from '@core/api/interfaces/IAuth';
import { IModal } from '@core/api/interfaces/IModal';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ButtonStandardComponent,
    InputLoginComponent,
    ModalInfoComponent,
    LoadingComponent,
    MatIconModule,
    InputValidationComponent,
  ],
  providers: [AuthApi, HttpRequestService],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  private authApi = inject(AuthApi);
  private router = inject(Router);

  public signupData: IRequestSignUp = {
    name: signal(''),
    email: signal(''),
    password: signal(''),
    confirmPassword: signal(''),
  };

  public formValidation: IFormValidation = {
    nameValidation: signal(false),
    emailValidation: signal(false),
    passwordLettersValidation: signal(false),
    passwordUpperCaseValidation: signal(false),
    passwordNumberValidation: signal(false),
    passwordSymbolValidation: signal(false),
    confirmPasswordValidation: signal(false),
  };

  public modalInfo: IModal = {
    modalType: '',
    modalDescription: '',
  };

  public showPassword = false;
  public isModalActive = false;
  public isLoadingActive = false;

  /**
   * getNameValue
   * Função que pega o valor do componente input nome
   * @param emailValue
   */
  // getNameValue(nameValue: string): void {
  //   this.signupData().name = nameValue;
  // }

  getNameValue(nameValue: string): void {
    this.signupData.name.set(nameValue);
  }

  /**
   * getNameValidation
   * Função que valida se o nome está com a quantidade mínima de caracteres estipulado.
   * @param validationStatus
   */
  getNameValidation(validationStatus: boolean) {
    this.formValidation.nameValidation.set(validationStatus);
  }

  /**
   * changeNameBorderColor
   * Função computed que altera a cor da borda do input name para vermelho caso a validação seja atendida.
   */
  changeNameBorderColor: Signal<string> = computed(() => {
    if (this.signupData.name().length > 0 && !this.formValidation.nameValidation()) {
      return 'ring-red-400';
    } else {
      return 'ring-logo-blue-hover';
    }
  });

  /**
   * getEmailValue
   * Função que pega o valor do componente input e-mail
   * @param emailValue
   */
  getEmailValue(emailValue: string): void {
    this.signupData.email.set(emailValue);
  }

  /**
   * getEmailValidation
   * Função que valida se o email possui um "@"" e ".com".
   * @param validationStatus
   */
  getEmailValidation(validationStatus: boolean): void {
    this.formValidation.emailValidation.set(validationStatus);
  }

  /**
   * changeEmailBorderColor
   * Função computed que altera a cor da borda do input email para vermelho caso a validação seja atendida.
   */
  changeEmailBorderColor: Signal<string> = computed(() => {
    if (this.signupData.email().length > 0 && !this.formValidation.emailValidation()) {
      return 'ring-red-400';
    } else {
      return 'ring-logo-blue-hover';
    }
  });

  /**
   * getPasswordValue
   * Função que pega o valor do componente input senha
   * @param passwordValue
   */
  getPasswordValue(passwordValue: string): void {
    this.signupData.password.set(passwordValue);
  }

  /**
   * getPasswordLettersValidation
   * Função que valida se a senha possui a quantidade minima de carateres estipulados.
   * @param validationStatus
   */
  getPasswordLettersValidation(validationStatus: boolean): void {
    this.formValidation.passwordLettersValidation.set(validationStatus);
  }

  /**
   * getPasswordUpperCaseValidation
   * Função que valida se a senha possui a quantidade minima de letras maiusculas estipulados.
   * @param validationStatus
   */
  getPasswordUpperCaseValidation(validationStatus: boolean): void {
    this.formValidation.passwordUpperCaseValidation.set(validationStatus);
  }

  /**
   * getPasswordNumberValidation
   * Função que valida se a senha possui a quantidade minima de números estipulados.
   * @param validationStatus
   */
  getPasswordNumberValidation(validationStatus: boolean): void {
    this.formValidation.passwordNumberValidation.set(validationStatus);
  }

  /**
   * getPasswordSymbolValidation
   * Função que valida se a senha possui a quantidade minima de simbolos estipulados.
   * @param validationStatus
   */
  getPasswordSymbolValidation(validationStatus: boolean): void {
    this.formValidation.passwordSymbolValidation.set(validationStatus);
  }

  /**
   * changePasswordBorderColor
   * Função computed que altera a cor da borda do input senha para vermelho caso as validações sejam atendidas.
   */
  changePasswordBorderColor: Signal<string> = computed(() => {
    if (!this.signupData.password()) {
      return 'ring-logo-blue-hover';
    } else if (
      (this.signupData.password() && !this.formValidation.passwordLettersValidation()) ||
      !this.formValidation.passwordUpperCaseValidation() ||
      !this.formValidation.passwordNumberValidation() ||
      !this.formValidation.passwordSymbolValidation()
    ) {
      return 'ring-red-400';
    } else {
      return 'ring-logo-blue-hover';
    }
  });

  /**
   * getConfirmPasswordValue
   * Função que pega o valor do componente input do confirmar senha
   * @param passwordValue
   */
  getConfirmPasswordValue(passwordValue: string): void {
    this.signupData.confirmPassword.set(passwordValue);
  }

  /**
   * getConfirmPasswordValidation
   * Função que valida se o confirmar senha está igual a senha.
   * @param validationStatus
   */
  getConfirmPasswordValidation(validationStatus: boolean): void {
    this.formValidation.confirmPasswordValidation.set(validationStatus);
  }

  /**
   * changeConfirmPasswordBorderColor
   * Função computed que altera a cor da borda do input confirmar senha para vermelho caso as validações sejam atendidas.
   */
  changeConfirmPasswordBorderColor: Signal<string> = computed(() => {
    if (
      this.signupData.confirmPassword().length > 0 &&
      !this.formValidation.confirmPasswordValidation()
    ) {
      return 'ring-red-400';
    } else {
      return 'ring-logo-blue-hover';
    }
  });

  /**
   * allValidationsOk
   * Função computed que verifica se todas as validações estão atendidas ou não para destravar o botão criar novo usuário.
   */
  allValidationsOk: Signal<boolean> = computed(() => {
    if (
      this.formValidation.nameValidation() &&
      this.formValidation.emailValidation() &&
      this.formValidation.passwordLettersValidation() &&
      this.formValidation.passwordUpperCaseValidation() &&
      this.formValidation.passwordNumberValidation() &&
      this.formValidation.passwordSymbolValidation() &&
      this.formValidation.confirmPasswordValidation()
    ) {
      return true;
    } else {
      return false;
    }
  });

  /**
   * handleSuccessModal
   * Função que popula os dados do modal no caso de sucesso ao criar o usuário.
   */
  handleSuccessModal(message: string): void {
    this.modalInfo = {
      modalType: 'success',
      modalDescription: message,
    };
  }

  /**
   * handleFailureModal
   * Função que popula os dados do modal no caso de falha ao criar o usuário.
   */
  handleFailureModal(message: string): void {
    this.modalInfo = {
      modalType: 'failure',
      modalDescription: message,
    };
  }

  public activeRedirectPage = false;

  /**
   * authenticateUser
   * Função que submete os dados para o backend para criação do novo usuário.
   */
  async createNewUser(): Promise<void> {
    this.isLoadingActive = true;
    try {
      const response = await this.authApi.createNewUser({
        name: this.signupData.name(),
        email: this.signupData.email(),
        password: this.signupData.password(),
        confirmPassword: this.signupData.confirmPassword(),
      });
      if (response) {
        this.handleSuccessModal(response.message);
        this.isModalActive = true;
        this.activeRedirectPage = true;
      }
    } catch (e: any) {
      this.handleFailureModal(e.error.message);
      this.isModalActive = true;
    } finally {
      this.isLoadingActive = false;
    }
  }

  /**
   * closeModal
   * Função que fecha o modal e direciona o usuário para a tela de login.
   * @param modalStatus
   */
  closeModal(modalStatus: boolean): void {
    this.isModalActive = modalStatus;
    if (this.activeRedirectPage) {
      return this.redirectToLoginPage();
    } else {
      return;
    }
  }

  /**
   * redirectToLoginPage
   * Função que redireciona o usuário para a tela de login.
   */
  redirectToLoginPage(): void {
    this.router.navigate(['/login']);
  }
}
