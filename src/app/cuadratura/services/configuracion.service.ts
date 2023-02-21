import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Configuracion } from '../entity/configuracion';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionService {

  private urlEndPoint!: string;

  constructor(private http: HttpClient) {
    this.urlEndPoint = environment.urlCuadratura;
  }

  getConfiguraciones(): Observable<Configuracion[]> {
    return this.http.get<Configuracion[]>(`${this.urlEndPoint}/api/configuracion`);
  }

  updateConfiguracion(configuracion: Configuracion): Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint}/api/configuracion/${configuracion.codigo}`, configuracion);
  }
  
}
