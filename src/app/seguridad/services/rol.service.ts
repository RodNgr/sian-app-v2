import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthService } from '../../auth/services/auth.service';

import { Rol } from '../entity/rol';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  private urlEndPoint: string;

  constructor(private http: HttpClient,
              private authService: AuthService) {
      this.urlEndPoint = environment.urlSecurity + '/api/roles';
  }

  getAllRoles(): Observable<Rol[]> {
      return this.http.get<Rol[]>(this.urlEndPoint + '/');
  }

  getRol(id: string): Observable<Rol> {
      return this.http.get<Rol>(`${this.urlEndPoint}/${id}`);
  }

  create(rol: Rol): Observable<Rol> {
      rol.usuarioCreacion = this.authService.usuario.username;
      return this.http.post<any>(this.urlEndPoint, rol);
  }

  update(rol: Rol): Observable<Rol> {
      rol.usuarioModificacion = this.authService.usuario.username;
      return this.http.put<any>(`${this.urlEndPoint}/${rol.id}`, rol);
  }

  delete(id: string): Observable<Rol> {
      const cousuario = this.authService.usuario.username;
      return this.http.delete<Rol>(`${this.urlEndPoint}/${id}/${cousuario}`);
  }
  
}
