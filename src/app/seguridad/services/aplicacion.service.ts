import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthService } from '../../auth/services/auth.service';

import { Aplicacion } from '../entity/aplicacion';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AplicacionService {

  private urlEndPoint: string;

  constructor(private http: HttpClient,
              private authService: AuthService) {
    this.urlEndPoint = environment.urlSecurity + '/api/applications';
  }

  getAllAplicaciones(): Observable<Aplicacion[]> {
    return this.http.get<Aplicacion[]>(this.urlEndPoint + '/');
  }

  getAplicacion(id: number): Observable<Aplicacion> {
    return this.http.get<Aplicacion>(`${this.urlEndPoint}/${id}`);
  }

  create(aplicacion: Aplicacion): Observable<Aplicacion> {
    aplicacion.usuarioCreacion = this.authService.usuario.username;
    return this.http.post<Aplicacion>(this.urlEndPoint, aplicacion);
  }

  update(aplicacion: Aplicacion): Observable<Aplicacion> {
    aplicacion.usuarioModificacion = this.authService.usuario.username;
    return this.http.put<Aplicacion>(`${this.urlEndPoint}/${aplicacion.id}`, aplicacion);
  }

  delete(id: number): Observable<Aplicacion> {
      const cousuario = this.authService.usuario.username;
      return this.http.delete<Aplicacion>(`${this.urlEndPoint}/${id}/${cousuario}`);
  }

}
