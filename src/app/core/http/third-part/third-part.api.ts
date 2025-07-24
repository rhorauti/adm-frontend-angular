import { inject, Injectable } from '@angular/core';
import { HttpRequestService } from '../http-request.service';
import { IResponseViaCep } from '@core/interfaces/address.interface';

@Injectable({
  providedIn: 'root',
})
export class ThirdPartApi {
  private httpRequestService = inject(HttpRequestService);

  async getAddressFromCep(cep: string): Promise<IResponseViaCep | undefined> {
    const clearCep = cep.replace(/\D/g, '');
    return await this.httpRequestService.sendHttpRequest(
      `https://viacep.com.br/ws/${clearCep}/json/`,
      'GET'
    );
  }
}
