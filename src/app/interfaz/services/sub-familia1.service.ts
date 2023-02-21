import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { EmpresaService } from 'src/app/shared/services/empresa.service';

import { SubFamilia1 } from '../entity/sub-familia1';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubFamilia1Service {

  private urlEndPoint: string

  constructor(private http: HttpClient,
              private empresaService: EmpresaService) {
      this.urlEndPoint = environment.urlInterfazProducto;
  }

  getAll(): Observable<SubFamilia1[]> {
      const idEmpresa = this.empresaService.getEmpresaSeleccionada().idEmpresa;
      return this.http.get<SubFamilia1[]>(`${this.urlEndPoint}/api/subfamilia1/empresa/${idEmpresa}`);
  }

  getAllPorPadre(idPadre: number): Observable<SubFamilia1[]> {
    return this.http.get<SubFamilia1[]>(`${this.urlEndPoint}/api/subfamilia1/padre/${idPadre}`);
}

  get(id: number): Observable<SubFamilia1> {
    return this.http.get<SubFamilia1>(`${this.urlEndPoint}/api/subfamilia1/${id}`);
  }

  remove(subFamilia1: SubFamilia1): Observable<any> {
      return this.http.put<any>(`${this.urlEndPoint}/api/subfamilia1/remove/${subFamilia1.id}/${subFamilia1.usuarioModificacion}`, subFamilia1);
  }

  create(subFamilia1: SubFamilia1): Observable<any> {
      return this.http.post<any>(`${this.urlEndPoint}/api/subfamilia1`, subFamilia1);
  }

  edit(subFamilia1: SubFamilia1): Observable<any> {
      return this.http.put<any>(`${this.urlEndPoint}/api/subfamilia1/${subFamilia1.id}`, subFamilia1);
  }

}
