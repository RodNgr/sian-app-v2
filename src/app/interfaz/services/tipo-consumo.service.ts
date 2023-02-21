import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { EmpresaService } from 'src/app/shared/services/empresa.service';

import { TipoConsumo } from '../entity/tipo-consumo';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TipoConsumoService {

  private urlEndPoint: string

  constructor(private http: HttpClient,
              private empresaService: EmpresaService) {
      this.urlEndPoint = environment.urlInterfazProducto;
  }

  getAll(): Observable<TipoConsumo[]> {
      const idEmpresa = this.empresaService.getEmpresaSeleccionada().idEmpresa;
      return this.http.get<TipoConsumo[]>(`${this.urlEndPoint}/api/tipoconsumo/empresa/${idEmpresa}`);
  }

  get(id: number): Observable<TipoConsumo> {
    return this.http.get<TipoConsumo>(`${this.urlEndPoint}/api/tipoconsumo/${id}`);
  }

  remove(tipoConsumo: TipoConsumo): Observable<any> {
      return this.http.put<any>(`${this.urlEndPoint}/api/tipoconsumo/remove/${tipoConsumo.id}/${tipoConsumo.usuarioModificacion}`, tipoConsumo);
  }

  create(tipoConsumo: TipoConsumo): Observable<any> {
      return this.http.post<any>(`${this.urlEndPoint}/api/tipoconsumo`, tipoConsumo);
  }

  edit(tipoConsumo: TipoConsumo): Observable<any> {
      return this.http.put<any>(`${this.urlEndPoint}/api/tipoconsumo/${tipoConsumo.id}`, tipoConsumo);
  }
  
}
