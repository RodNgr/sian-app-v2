import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { EmpresaService } from 'src/app/shared/services/empresa.service';

import { SubFamilia3 } from '../entity/sub-familia3';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubFamilia3Service {

  private urlEndPoint: string

  constructor(private http: HttpClient,
              private empresaService: EmpresaService) {
      this.urlEndPoint = environment.urlInterfazProducto;
  }

  getAll(): Observable<SubFamilia3[]> {
      const idEmpresa = this.empresaService.getEmpresaSeleccionada().idEmpresa;
      return this.http.get<SubFamilia3[]>(`${this.urlEndPoint}/api/subfamilia3/empresa/${idEmpresa}`);
  }

  getAllPorPadre(idPadre: number): Observable<SubFamilia3[]> {
    return this.http.get<SubFamilia3[]>(`${this.urlEndPoint}/api/subfamilia3/padre/${idPadre}`);
  }

  get(id: number): Observable<SubFamilia3> {
    return this.http.get<SubFamilia3>(`${this.urlEndPoint}/api/subfamilia3/${id}`);
  }

  remove(subfamilia3: SubFamilia3): Observable<any> {
      return this.http.put<any>(`${this.urlEndPoint}/api/subfamilia3/remove/${subfamilia3.id}/${subfamilia3.usuarioModificacion}`, subfamilia3);
  }

  create(subfamilia3: SubFamilia3): Observable<any> {
      return this.http.post<any>(`${this.urlEndPoint}/api/subfamilia3`, subfamilia3);
  }

  edit(subfamilia3: SubFamilia3): Observable<any> {
      return this.http.put<any>(`${this.urlEndPoint}/api/subfamilia3/${subfamilia3.id}`, subfamilia3);
  }

}
