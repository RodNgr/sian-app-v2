import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { EmpresaService } from 'src/app/shared/services/empresa.service';

import { SubFamilia2 } from '../entity/sub-familia2';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubFamilia2Service {

  private urlEndPoint: string

  constructor(private http: HttpClient,
              private empresaService: EmpresaService) {
      this.urlEndPoint = environment.urlInterfazProducto;
  }

  getAll(): Observable<SubFamilia2[]> {
      const idEmpresa = this.empresaService.getEmpresaSeleccionada().idEmpresa;
      return this.http.get<SubFamilia2[]>(`${this.urlEndPoint}/api/subfamilia2/empresa/${idEmpresa}`);
  }

  getAllPorPadre(idPadre: number): Observable<SubFamilia2[]> {
    return this.http.get<SubFamilia2[]>(`${this.urlEndPoint}/api/subfamilia2/padre/${idPadre}`);
  }

  get(id: number): Observable<SubFamilia2> {
    return this.http.get<SubFamilia2>(`${this.urlEndPoint}/api/subfamilia2/${id}`);
  }

  remove(subfamilia2: SubFamilia2): Observable<any> {
      return this.http.put<any>(`${this.urlEndPoint}/api/subfamilia2/remove/${subfamilia2.id}/${subfamilia2.usuarioModificacion}`, subfamilia2);
  }

  create(subfamilia2: SubFamilia2): Observable<any> {
      return this.http.post<any>(`${this.urlEndPoint}/api/subfamilia2`, subfamilia2);
  }

  edit(subfamilia2: SubFamilia2): Observable<any> {
      return this.http.put<any>(`${this.urlEndPoint}/api/subfamilia2/${subfamilia2.id}`, subfamilia2);
  }

}
