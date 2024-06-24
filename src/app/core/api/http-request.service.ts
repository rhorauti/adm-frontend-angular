import { Injectable, inject } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class HttpRequestService {
  private httpClient = inject(HttpClient);

  /**
   *sendHttpRequest
   *
   * Usada para emitir requisições http.
   *
   * @param path url backend que será feita a requisição http
   * @param method método GET, POST, PUT , DELETE
   * @param data dados que serão enviados para o backend
   * @param authToken token de autenticação
   * @returns Retorna uma promise genérica
   */
  async sendHttpRequest(
    path: string,
    method = 'GET',
    data?: Record<string, any> | string
  ): Promise<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('@authToken')}`,
      'Content-Type': 'application/json',
    });
    switch (method) {
      case 'GET': {
        return await lastValueFrom(this.httpClient.get(path, { headers }));
      }
      case 'POST': {
        return await lastValueFrom(
          this.httpClient.post(path, data, { headers })
        );
      }
      case 'PUT': {
        return await lastValueFrom(
          this.httpClient.put(path, data, { headers })
        );
      }
      case 'DELETE': {
        return await lastValueFrom(this.httpClient.delete(path, { headers }));
      }
    }
  }
}
