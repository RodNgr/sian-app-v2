import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ClientCall } from '../entity/client-call';

@Injectable({
  providedIn: 'root'
})
export class CallService {

  private urlEndPoint: string;

  constructor(private http: HttpClient) {
    this.urlEndPoint = environment.urlReporte;
  }

  getClientePorDocumento(documento: string): Observable<ClientCall[]> {
    return this.http.get<ClientCall[]>(`${this.urlEndPoint}/api/cliente-call/find/documento/${documento}`);
  }

  getClientePorTelefono(telefono: string): Observable<ClientCall[]> {
    return this.http.get<ClientCall[]>(`${this.urlEndPoint}/api/cliente-call/find/telefono/${telefono}`);
  }
  
}
