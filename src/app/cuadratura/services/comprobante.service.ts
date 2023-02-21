import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ComprobanteDto } from '../entity/comprobante-dto';
import { ComprobanteSovos } from '../entity/comprobante-sovos';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ComprobanteService {

  private urlEndPoint!: string;

  constructor(private http: HttpClient) {
    this.urlEndPoint = environment.urlCuadratura;
  }

  getResumen(ruc: string, feInicio: string, feFin: string): Observable<ComprobanteDto[]> {
    return this.http.get<ComprobanteDto[]>(`${this.urlEndPoint}/api/comprobante/resumen/${ruc}/${feInicio}/${feFin}`);
  }

  getComprobantes(ruc: string, feInicio: string, feFin: string, tipo: string, estado: string, sunat: string): Observable<ComprobanteSovos[]> {
    return this.http.get<ComprobanteSovos[]>(`${this.urlEndPoint}/api/comprobante/listado/${ruc}/${feInicio}/${feFin}/${tipo}/${estado}/${sunat}`);
  }

}
