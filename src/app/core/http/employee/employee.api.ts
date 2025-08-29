import { inject, Injectable } from '@angular/core';
import { HttpRequestService } from '../http-request.service';
import { IResponseEmployee } from '@core/interfaces/employee.interface';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EmployeeApi {
  private httpRequestService = inject(HttpRequestService);
  private baseApiName = 'employees';

  async onGetCompaniesEmployee(idCompany: number): Promise<IResponseEmployee> {
    return await this.httpRequestService.sendHttpRequest(
      `${environment.apiUrl}/${this.baseApiName}/${idCompany}`,
      'GET'
    );
  }
}
