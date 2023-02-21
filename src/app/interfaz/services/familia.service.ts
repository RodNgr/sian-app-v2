import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { EmpresaService } from 'src/app/shared/services/empresa.service';

import { Familia } from '../entity/familia';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FamiliaService {

  private urlEndPoint: string

  constructor(private http: HttpClient,
              private empresaService: EmpresaService) {
      this.urlEndPoint = environment.urlInterfazProducto;
  }

  getAll(): Observable<Familia[]> {
      const idEmpresa = this.empresaService.getEmpresaSeleccionada().idEmpresa;

      return this.http.get<Familia[]>(`${this.urlEndPoint}/api/familia/empresa/${idEmpresa}`);
  }

  get(id: number): Observable<Familia> {
    return this.http.get<Familia>(`${this.urlEndPoint}/api/familia/${id}`);
  }

  remove(familia: Familia): Observable<any> {
      return this.http.put<any>(`${this.urlEndPoint}/api/familia/remove/${familia.id}/${familia.usuarioModificacion}`, familia);
  }

  create(familia: Familia): Observable<any> {
      return this.http.post<any>(`${this.urlEndPoint}/api/familia`, familia);
  }

  edit(familia: Familia): Observable<any> {
      return this.http.put<any>(`${this.urlEndPoint}/api/familia/${familia.id}`, familia);
  }

}
