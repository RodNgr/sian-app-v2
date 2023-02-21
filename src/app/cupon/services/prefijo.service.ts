import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { EmpresaService } from 'src/app/shared/services/empresa.service';

import { Prefijo } from '../entity/prefijo';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PrefijoService {

  private urlEndPoint: string

  constructor(private http: HttpClient,
              private empresaService: EmpresaService) {
      this.urlEndPoint = environment.urlCupones;
  }

  getPrefijos(): Observable<Prefijo[]> {
      const idEmpresa = this.empresaService.getEmpresaSeleccionada().idEmpresa;
      return this.http.get<Prefijo[]>(`${this.urlEndPoint}/api/prefijo/empresa/${idEmpresa}`);
  }

  getPrefijo(prefijo: string): Observable<Prefijo> {
    return this.http.get<Prefijo>(`${this.urlEndPoint}/api/prefijo/${prefijo}`);
  }

  removePrefijo(prefijo: Prefijo): Observable<any> {
      return this.http.put<any>(`${this.urlEndPoint}/api/prefijo/remove/${prefijo.prefijo}`, prefijo);
  }

  createPrefijo(prefijo: Prefijo): Observable<any> {
      return this.http.post<any>(`${this.urlEndPoint}/api/prefijo`, prefijo);
  }

  editPrefijo(prefijo: Prefijo): Observable<any> {
      return this.http.put<any>(`${this.urlEndPoint}/api/prefijo/${prefijo.prefijo}`, prefijo);
  }

}
