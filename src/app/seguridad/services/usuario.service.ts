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
import { UserDto } from '../../auth/dto/user-dto';
import { CopiarPermisoDto } from '../dto/copiar-permiso-dto';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private urlEndPoint: string;

  constructor(private http: HttpClient,
              private authService: AuthService,
              private router: Router) {
    this.urlEndPoint = environment.urlSecurity + '/api/users';
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

}
