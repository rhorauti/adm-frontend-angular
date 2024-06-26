import { Component, EventEmitter, Output, ViewChild, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { authDataStore } from '@store/auth/auth.action';
import { InputLoginComponent } from '@components/input/input-login/input-login.component';
import { ButtonStandardComponent } from '@components/button/button-standard/button-standard.component';
import { ModalInfoComponent } from '@components/modal/modal-info/modal-info.component';
import { LoadingComponent } from '@components/loading/loading.component';
import { AuthApi } from '@core/api/http/auth.api';
import { HttpRequestService } from '@core/api/http-request.service';
import { DataService } from '@core/services/data.service';
import { IAuthStore, IRequestlogin } from '@core/api/interfaces/IAuth';
import { NavbarComponent } from '@components/menu/navbar/navbar.component';
import { IModal } from '@core/api/interfaces/IModal';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatIconModule,
    CommonModule,
    FormsModule,
    InputLoginComponent,
    ButtonStandardComponent,
    ModalInfoComponent,
    LoadingComponent,
  ],
  providers: [AuthApi, HttpRequestService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  constructor(
    private dataService: DataService,
    private authStore: Store<{ auth: IAuthStore }>
  ) {}

  private authApi = inject(AuthApi);
  private router = inject(Router);

  @ViewChild(NavbarComponent) menuComponent?: NavbarComponent;

  loginData: IRequestlogin = {
    email: '',
    password: '',
    rememberMe: false,
  };

  public showPassword = false;
  public isModalActive = false;
  public isLoadingActive = false;
  public modalInfo: IModal = {
    modalType: '',
    modalDescription: '',
  };

  /**
   * getEmailValue
   * Função que pega o valor do componente input e-mail
   * @param emailValue
   */
  getEmailValue(emailValue: string): void {
    this.loginData.email = emailValue;
  }

  /**
   * getPasswordValue
   * Função que pega o valor do componente input password
   * @param passwordValue
   */
  getPasswordValue(passwordValue: string): void {
    this.loginData.password = passwordValue;
  }

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

  public isLoginSuccess = false;
  @Output() showNavBarEmitter = new EventEmitter<boolean>();

  public authStoreData: IAuthStore = {
    id: 0,
    name: '',
    email: '',
  };

  /**
   * authenticateUser
   * Função que envia os dados do usuário (email e senha) para validação do backend
   */
  async submitUserData(): Promise<void> {
    this.isLoadingActive = true;
    try {
      if (this.loginData.email.length == 0) {
        this.handleFailureModal('Campo email vazio!');
      } else if (this.loginData.password.length == 0) {
        this.handleFailureModal('Campo senha vazio!');
      } else {
        const response = await this.authApi.authenticateUser(this.loginData);
        if (response) {
          this.authStoreData = {
            id: response.data.id,
            name: response.data.name,
            email: response.data.email,
          };
          this.handleSuccessModal(response.message);
          this.isLoginSuccess = true;
          this.authStore.dispatch(authDataStore({ authData: this.authStoreData }));
          this.dataService.emitData(true);
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
    if (!this.isLoginSuccess) {
      this.isModalActive = modalStatus;
    } else {
      this.isModalActive = modalStatus;
      this.dataService.emitData(true);
      this.router.navigate(['/customers']);
    }
  }

  /**
   * redirectToNewUser
   * Função que redireciona o usuário para a tela de cadastro.
   */
  redirectToNewUserPage(): void {
    this.router.navigate(['/signup']);
  }

  redirectToGetEmailValidation(): void {
    this.router.navigate(['/reset-password']);
  }
}
