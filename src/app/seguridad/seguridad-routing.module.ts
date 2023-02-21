import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../auth/guards/auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';

import { AplicacionComponent } from './pages/aplicacion/aplicacion.component';
import { ConsultaRolesAplicacionComponent } from './pages/consulta-roles-aplicacion/consulta-roles-aplicacion.component';
import { ConsultaRolesUsuarioComponent } from './pages/consulta-roles-usuario/consulta-roles-usuario.component';
import { ConsultaUsuariosAplicacionComponent } from './pages/consulta-usuarios-aplicacion/consulta-usuarios-aplicacion.component';
import { ConsultaUsuariosRolComponent } from './pages/consulta-usuarios-rol/consulta-usuarios-rol.component';
import { GrupoComponent } from './pages/grupo/grupo.component';
import { IpsBloqueadasComponent } from './pages/ips-bloqueadas/ips-bloqueadas.component';
import { ListaAplicacionComponent } from './pages/lista-aplicacion/lista-aplicacion.component';
import { ListaGrupoComponent } from './pages/lista-grupo/lista-grupo.component';
import { ListaRolComponent } from './pages/lista-rol/lista-rol.component';
import { ListaUsuarioComponent } from './pages/lista-usuario/lista-usuario.component';
import { RolComponent } from './pages/rol/rol.component';
import { UsuarioComponent } from './pages/usuario/usuario.component';
import { VerLoginsComponent } from './pages/ver-logins/ver-logins.component';

const routes: Routes = [
  { path: '', children: 
    [
      { path: 'lista-aplicacion', component: ListaAplicacionComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_SEG_APLICACION']} },
      { path: 'aplicacion', component: AplicacionComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_SEG_APLICACION']} },
      { path: 'lista-rol', component: ListaRolComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_SEG_ROL']} },
      { path: 'rol', component: RolComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_SEG_ROL']} },
      { path: 'lista-grupo', component: ListaGrupoComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_SEG_GRUPO']} },
      { path: 'grupo', component: GrupoComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_SEG_GRUPO']} },

      { path: 'lista-usuario', component: ListaUsuarioComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_SEG_USUARIO']} },
      { path: 'usuario', component: UsuarioComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_SEG_USUARIO']} },
      { path: 'lista-ips', component: IpsBloqueadasComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_SEG_LIBERAR_IP']} },

      { path: 'consultar-inicio-sesion', component: VerLoginsComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_SEG_INICIO_SESION']} },
      { path: 'consultar-roles-aplicacion', component: ConsultaRolesAplicacionComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_SEG_ROL_X_APLICACION']} },
      { path: 'consultar-usuarios-aplicacion', component: ConsultaUsuariosAplicacionComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_SEG_USUARIO_X_APLICACION']} },
      { path: 'consultar-usuarios-rol', component: ConsultaUsuariosRolComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_SEG_USUARIO_X_ROL']} },
      { path: 'consultar-roles-usuario', component: ConsultaRolesUsuarioComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_SEG_ROL_X_USUARIO']} },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeguridadRoutingModule { }
