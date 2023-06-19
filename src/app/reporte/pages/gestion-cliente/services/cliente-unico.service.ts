import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Token } from '../entity/token';
import { ClienteActualiza, ClienteRegistro } from '../entity/cliente';

interface IResponse {
  status: string;
  detalle: string;
}

export interface IDocResponse {
  status: string;
  detalle: string;
  cliente: {
    documento: string;
    tipoDoc: string;
    nombre: string;
    apellidoPater: string;
    apellidoMat: string;
    direccion: string;
    sexo: string;
    telefono: string;
    correo: string;
    checkPromoBB: number;
    fechaCheckPromoBB: string;
    checkPromoDB: number;
    fechaCheckPromoDB: string;
    checkPromoPP: string;
    fechaCheckPromoPP: string;
    checkPromoCW: string;
    fechaCheckPromoCW: string;
    checkPromoPJ: string;
    fechaCheckPromoPJ: string;
    checkPromoDD: string;
    fechaCheckPromoDD: string;
    checkTratamiento: number;
    fechaTratamiento: string;
    fecPedidoPOS: string;
    marcaPOS: string;
    origenCheckPromoBB: string;
    origenCheckPromoDB: string;
    origenCheckPromoPP: string;
    origenCheckPromoCW: string;
    origenCheckPromoPJ: string;
    origenCheckPromoDD: string;
    origenCheckTratamiento: string;
  }
}

@Injectable({
  providedIn: 'root',
})
export class ClienteUnicoService {
  private urlEndPoint: string;
  private urlAmauta: string;
  private client_id: string;
  private client_secret: string;

  private http: HttpClient;

  constructor(
    private handler: HttpBackend,
  ) {
    this.urlEndPoint = environment.urlOmnicanalA;
    this.urlAmauta = environment.urlAmauta;
    this.client_id = environment.clientidunico;
    this.client_secret = environment.clientsecretunico;
    this.http = new HttpClient(this.handler);
  }

  getToken(): Observable<Token> {
    const body = { client_id: this.client_id, client_secret: this.client_secret, grant_type: 'client_credentials' };
    return this.http.post<Token>(
      `${this.urlEndPoint}/generatoken`, body
    );
  }

  consultaDocumento(body: { documento: string, tipoDoc: string }, token: string): Observable<IDocResponse> {
    return this.http.post<IDocResponse>(
      `${this.urlAmauta}/clienteunico/consultadoc`, body, { headers: { 'Authorization': `Bearer ${token}` } }
    );
  }

  registraCliente(body: ClienteRegistro, token: string): Observable<IResponse> {
    return this.http.post<IResponse>(
      `${this.urlAmauta}/clienteunico/creacliente`, body, { headers: { 'Authorization': `Bearer ${token}` } }
    );
  }

  actualizaTratamiento(body: Partial<ClienteActualiza>, token: string): Observable<IResponse> {
    return this.http.post<IResponse>(
      `${this.urlAmauta}/clienteunico/actualizatratamiento`, body, { headers: { 'Authorization': `Bearer ${token}` } }
    );
  }
}
