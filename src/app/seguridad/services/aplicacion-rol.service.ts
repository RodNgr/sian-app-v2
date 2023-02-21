import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthService } from '../../auth/services/auth.service';

import { AplicacionRol } from '../entity/aplicacion-rol';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AplicacionRolService {

  private urlEndPoint: string;

  constructor(private http: HttpClient,
              private authService: AuthService) {
      this.urlEndPoint = environment.urlSecurity + '/api/applicationRoles';
  }

  getAll(): Observable<AplicacionRol[]> {
    return this.http.get<AplicacionRol[]>(`${this.urlEndPoint}/`);
}
  getAplicacionesPorRol(id: string): Observable<AplicacionRol[]> {
      return this.http.get<AplicacionRol[]>(`${this.urlEndPoint}/aplicacion/${id}`);
  }

  getRolesPorAplicacion(id: number): Observable<AplicacionRol[]> {
      return this.http.get<AplicacionRol[]>(`${this.urlEndPoint}/rol/${id}`);
  }

  create(aplicacionRol: AplicacionRol): Observable<any> {
      aplicacionRol.usuario = this.authService.usuario.username;
      return this.http.post<any>(this.urlEndPoint, aplicacionRol);
  }

  delete(id: number): Observable<AplicacionRol> {
      let usuario: string = this.authService.usuario.username;
      return this.http.delete<AplicacionRol>(`${this.urlEndPoint}/${id}/${usuario}`);
  }

}
