import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthService } from '../../auth/services/auth.service';
import { GroupStore } from '../entity/group-store';

import { Store } from '../entity/store';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GrupoTiendaService {

  private urlEndPoint: string;

  constructor(private http: HttpClient,
              private authService: AuthService) {
    this.urlEndPoint = environment.urlSecurity + '/api/storeGroups';
  }

  getTiendasPorMarca(idEmpresa: number): Observable<Store[]> {
    return this.http.get<Store[]>(`${this.urlEndPoint}/tienda/marca/${idEmpresa}`);
  }

  getTiendasPorGrupo(grupoId: number): Observable<GroupStore[]> {
    return this.http.get<GroupStore[]>(`${this.urlEndPoint}/tienda/${grupoId}`);
  }

  getGruposPorTienda(idempresa: number, clientesap: string, tienda: number): Observable<GroupStore[]> {
    return this.http.get<GroupStore[]>(`${this.urlEndPoint}/grupo/${idempresa}/${clientesap}/${tienda}`);
  }

  create(grupoTienda: GroupStore): Observable<any> {
    grupoTienda.usuario = this.authService.usuario.username;
    return this.http.post<any>(this.urlEndPoint, grupoTienda);
  }

  delete(id: number): Observable<GroupStore> {
    let usuario: string = this.authService.usuario.username;
    return this.http.delete<GroupStore>(`${this.urlEndPoint}/${id}/${usuario}`);
  }
  
}
