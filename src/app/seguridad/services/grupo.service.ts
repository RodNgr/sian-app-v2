import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../../auth/services/auth.service';

import { Grupo } from '../entity/grupo';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GrupoService {

  private urlEndPoint: string;

  constructor(private http: HttpClient,
              private router: Router,
              private authService: AuthService) {
      this.urlEndPoint = environment.urlSecurity + '/api/groups';
  }

  getAllGrupos(): Observable<Grupo[]> {
      return this.http.get<Grupo[]>(this.urlEndPoint + '/');
  }

  getGrupo(id: number): Observable<Grupo> {
      return this.http.get<Grupo>(`${this.urlEndPoint}/${id}`);
  }

  create(grupo: Grupo): Observable<any> {
      grupo.usuarioCreacion = this.authService.usuario.username;
      return this.http.post<any>(this.urlEndPoint, grupo);
  }

  update(grupo: Grupo): Observable<any> {
      grupo.usuarioModificacion = this.authService.usuario.username;
      return this.http.put<any>(`${this.urlEndPoint}/${grupo.id}`, grupo);
  }

  delete(id: number): Observable<Grupo> {
      const cousuario = this.authService.usuario.username;
      return this.http.delete<Grupo>(`${this.urlEndPoint}/${id}/${cousuario}`);
  }
  
}
