import { inject } from '@angular/core';
import { HttpRequestService } from '../http-request.service';
import {
  IRequestlogin,
  IRequestNewPasswordHttp,
  IRequestSignUp,
  IResponseLogin,
  IResponseSignUp,
} from '../../interfaces/IAuth';
import { environment } from '@environments/environment';
import { IResponseCommonMessage } from '../../interfaces/ICommonMessage';

export class AuthApi {
  private httpRequestService = inject(HttpRequestService);

  /**
   * authenticateUser
   * POST que será usada no componente login.
   * @param login dados em formato de objeto que será enviado na solicitação http
   * @returns retorna o status e a data e horário de retorno da resposta.
   */
  async authenticateUser(login: IRequestlogin): Promise<IResponseLogin> {
    const response = await this.httpRequestService.sendHttpRequest(
      `${environment.apiUrl}/login`,
      'POST',
      login
    );
    localStorage.setItem('@authToken', response.data.token);
    return response;
  }

  /**
   * checkValidToken
   * Função que verifica se o token está valido ou não.
   * @returns retorna a mensagem e o status 200(sucesso) ou 401(falha) dependendo se o token estiver válido.
   */
  async checkValidToken(token: string | null): Promise<IResponseCommonMessage> {
    return await this.httpRequestService.sendHttpRequest(
      `${environment.apiUrl}/email-validation?token=${token}`,
      'GET'
    );
  }

  /**
   * createNewUser
   * Função que cria um usuário no banco de dados.
   * @param newUser nome, email, senha do novo usuário
   * @returns id, email, avatar, data de criação do usuário junto com a mensagem que será exibida no modal.
   */
  async createNewUser(newUser: IRequestSignUp): Promise<IResponseSignUp> {
    return await this.httpRequestService.sendHttpRequest(
      `${environment.apiUrl}/signup`,
      'POST',
      newUser
    );
  }

  /**
   * getEmailValidation
   * Função que envia um novo e-mail para o usuário para validação do e-mail
   * @param email email informado pelo usuário
   * @returns Promise com a data, status e mensagem
   */
  async getEmailValidation(email: string): Promise<IResponseCommonMessage> {
    return await this.httpRequestService.sendHttpRequest(
      `${environment.apiUrl}/reset-password`,
      'POST',
      email
    );
  }

  /**
   * createNewPassword
   * Função que redefine a senha com base no e-mail informado na tela de redefinição de senha.
   * @param newPassword nova senha digitada pelo usuário
   * @returns Promise com a data, status e mensagem
   */
  async createNewPassword(newPassword: IRequestNewPasswordHttp): Promise<IResponseCommonMessage> {
    return await this.httpRequestService.sendHttpRequest(
      `${environment.apiUrl}/new-password?token=${newPassword.token}`,
      'POST',
      newPassword
    );
  }
}
