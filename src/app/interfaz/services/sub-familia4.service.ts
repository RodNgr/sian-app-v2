import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { EmpresaService } from 'src/app/shared/services/empresa.service';

import { SubFamilia4 } from '../entity/sub-familia4';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubFamilia4Service {

  private urlEndPoint: string

  constructor(private http: HttpClient,
              private empresaService: EmpresaService) {
      this.urlEndPoint = environment.urlInterfazProducto;
  }

  getAll(): Observable<SubFamilia4[]> {
      const idEmpresa = this.empresaService.getEmpresaSeleccionada().idEmpresa;
      return this.http.get<SubFamilia4[]>(`${this.urlEndPoint}/api/subfamilia4/empresa/${idEmpresa}`);
  }

  getAllPorPadre(idPadre: number): Observable<SubFamilia4[]> {
    return this.http.get<SubFamilia4[]>(`${this.urlEndPoint}/api/subfamilia4/padre/${idPadre}`);
  }

  get(id: number): Observable<SubFamilia4> {
    return this.http.get<SubFamilia4>(`${this.urlEndPoint}/api/subfamilia4/${id}`);
  }

  remove(subfamilia4: SubFamilia4): Observable<any> {
      return this.http.put<any>(`${this.urlEndPoint}/api/subfamilia4/remove/${subfamilia4.id}/${subfamilia4.usuarioModificacion}`, subfamilia4);
  }

  create(subfamilia4: SubFamilia4): Observable<any> {
      return this.http.post<any>(`${this.urlEndPoint}/api/subfamilia4`, subfamilia4);
  }

  edit(subfamilia4: SubFamilia4): Observable<any> {
      return this.http.put<any>(`${this.urlEndPoint}/api/subfamilia4/${subfamilia4.id}`, subfamilia4);
  }

}
