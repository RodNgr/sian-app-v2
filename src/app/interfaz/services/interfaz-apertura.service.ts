import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CrearApertura } from '../components/apertura-tienda/entity/crear-apertura';

interface IEmpresaResponse {
    idEmpresa: number;
    nombreComercial: string;
    empresaSAP: string;
}

interface ITiendaByEmpresaResponse {
    nombreTienda: string;
    tiendaSAP: string;
    usuarioInterface: string;
    tiendaPixel: string;
    tiendaCodigo: string;
    usuario: string;
    clienteSAP: string;
}

interface IKeysResponse {
  label_key: string;
  label_value: string;
  label_placeholder: string;
}

@Injectable({
  providedIn: 'root'
})
export class InterfazAperturaService {

  private urlEndPoint: string

  constructor(private http: HttpClient) {
    this.urlEndPoint = environment.urlInterfazProducto;
  }

  getEmpresas(): Observable<IEmpresaResponse[]> {
    return this.http.get<IEmpresaResponse[]>(`${this.urlEndPoint}/api/apertura-tienda/empresas`);
  }

  getFormatoTienda(idEmpresa: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.urlEndPoint}/api/apertura-tienda/${idEmpresa}/formatos`);
  }

  getTiendasByEmpresa(idEmpresa: number): Observable<ITiendaByEmpresaResponse[]> {
    return this.http.get<ITiendaByEmpresaResponse[]>(`${this.urlEndPoint}/api/apertura-tienda/empresas/${idEmpresa}/tiendas`);
  }

  getKeys(): Observable<IKeysResponse[]> {
    return this.http.get<IKeysResponse[]>(`${this.urlEndPoint}/api/apertura-tienda/keys`);
  }

  create(aperturaTienda: CrearApertura): Observable<any> {
    return this.http.post<{ usuarioInterface }>(`${this.urlEndPoint}/api/apertura-tienda`, aperturaTienda);
  }
}
