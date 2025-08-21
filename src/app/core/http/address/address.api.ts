import { inject, Injectable } from '@angular/core';
import { HttpRequestService } from '../http-request.service';
import { environment } from '@environments/environment';
import { IResponseAddress } from '@core/interfaces/address.interface';

@Injectable({
  providedIn: 'root',
})
export class AddressApi {
  private httpRequestService = inject(HttpRequestService);
  private baseApiName = 'addresses';

  async onGetCompanyAddress(idCompany: number): Promise<IResponseAddress> {
    return await this.httpRequestService.sendHttpRequest(
      `${environment.apiUrl}/${this.baseApiName}/${idCompany}`,
      'GET'
    );
  }
}
