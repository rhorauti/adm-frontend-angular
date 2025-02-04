import { inject } from '@angular/core';
import { HttpRequestService } from '../http-request.service';
import { IResponseViaCep } from '@core/interfaces/IAddress';

export class ThirdPartApi {
  private httpRequestService = inject(HttpRequestService);

  async getAddressFromCep(cep: string): Promise<IResponseViaCep | undefined> {
    const clearCep = cep.replace(/\D/g, '');
    if (clearCep.length > 0) {
      return await this.httpRequestService.sendHttpRequest(
        `https://viacep.com.br/ws/${clearCep}/json/`,
        'GET'
      );
    } else {
      return;
    }
  }
}
