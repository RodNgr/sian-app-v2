import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../../auth/services/auth.service';

import { Usuario } from '../../shared/entity/usuario';
import { UsuarioAplicacionRolDto } from '../dto/usuario-aplicacion-rol-dto';
import { UsuarioGrupoDto } from '../dto/usuario-grupo-dto';

import { environment } from 'src/environments/environment';
import { UsuarioRolDto } from '../dto/usuario-rol-dto';
import { CopiarPermisoDto } from '../dto/copiar-permiso-dto';
import { UsuarioTienda } from 'src/app/shared/entity/usuariotienda';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private urlEndPoint: string;
  private urlEndPointEpico: string;

  constructor(private http: HttpClient,
              private authService: AuthService,
              private router: Router) {
    this.urlEndPoint = environment.urlSecurity + '/api/users';
    this.urlEndPointEpico = environment.urlSecurity + '/api/epico';
  }

  getAllUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.urlEndPoint);
  }

  getUsuariosPorAplicacion(aplicacionId: number): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.urlEndPoint}/application/${aplicacionId}`);
  }

  getUsuariosPorRol(rolId: string): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.urlEndPoint}/rol/${rolId}`);
  }

  getFindUsuarios(filtro: string): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.urlEndPoint + '/find/' + filtro);
  }

  getUsuario(id: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.urlEndPoint}/${id}`);
  }

  asignarAccesos(usuarioAplicacionRolDto: UsuarioAplicacionRolDto): Observable<any> {
    usuarioAplicacionRolDto.usuarioModificacion = this.authService.usuario.username;
      return this.http.post<any>(this.urlEndPoint + '/acceso', usuarioAplicacionRolDto);
  }

  asignarGrupos(usuarioGrupoDto: UsuarioGrupoDto): Observable<any> {
      usuarioGrupoDto.usuarioModificacion = this.authService.usuario.username;
      return this.http.post<any>(this.urlEndPoint + '/grupo', usuarioGrupoDto);
  }

  getRolesPorUsuario(codigo: string): Observable<UsuarioRolDto[]> {
    return this.http.get<UsuarioRolDto[]>(this.urlEndPoint + '/rol/usuario/' + codigo);
  }

  copiarPrivilegios(dto: CopiarPermisoDto): Observable<any> {
    console.log(dto);
    return this.http.post<any>(this.urlEndPoint + '/copiar-permiso', dto);
  }

  getTiendasPorUsuario(codigoUsuario: string): Observable<UsuarioTienda[]> {
    return this.http.get<UsuarioTienda[]>(`${this.urlEndPointEpico}/user-store/${codigoUsuario}`);
  }

  saveTiendasPorUsuario(codusuario: string, codtienda: number): Observable<any> {
    return this.http.post<any>(`${this.urlEndPointEpico}/user-store`, { codusuario, codtienda });
  }

  deleteTiendasPorUsuario(codigoUsuario: string, codTienda: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.urlEndPointEpico}/user-store/${codigoUsuario}/${codTienda}`);
  }

}
