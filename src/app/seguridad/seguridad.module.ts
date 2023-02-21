import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxSpinnerModule } from 'ngx-spinner';

import { PrimengModule } from '../primeng/primeng.module';
import { SeguridadRoutingModule } from './seguridad-routing.module';
import { SharedModule } from '../shared/shared.module';

import { AplicacionComponent } from './pages/aplicacion/aplicacion.component';
import { AsignarAccesosComponent } from './components/asignar-accesos/asignar-accesos.component';
import { AsignarRolAplicacionComponent } from './components/asignar-rol-aplicacion/asignar-rol-aplicacion.component';
import { AsignarTiendaComponent } from './components/asignar-tienda/asignar-tienda.component';
import { AsignarUsuarioTiendaComponent } from './components/asignar-usuario-tienda/asignar-usuario-tienda.component';
import { ConsultaRolesAplicacionComponent } from './pages/consulta-roles-aplicacion/consulta-roles-aplicacion.component';
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
import { VerAplicacionRolComponent } from './components/ver-aplicacion-rol/ver-aplicacion-rol.component';
import { VerDispositivosComponent } from './components/ver-dispositivos/ver-dispositivos.component';
import { VerLoginsComponent } from './pages/ver-logins/ver-logins.component';

import { AplicacionPipe } from './pipes/aplicacion.pipe';
import { AttemptTypePipe } from './pipes/attempt-type.pipe';
import { BuscarUsuarioComponent } from './components/buscar-usuario/buscar-usuario.component';
import { ConsultaRolesUsuarioComponent } from './pages/consulta-roles-usuario/consulta-roles-usuario.component';
import { CopiarAccesoComponent } from './components/copiar-acceso/copiar-acceso.component';

@NgModule({
  declarations: [
    ListaUsuarioComponent, 
    ListaRolComponent, 
    ListaAplicacionComponent, 
    AplicacionComponent, 
    RolComponent, 
    UsuarioComponent, 
    VerAplicacionRolComponent, 
    AsignarRolAplicacionComponent, 
    ListaGrupoComponent, 
    GrupoComponent, 
    AsignarTiendaComponent, 
    AsignarUsuarioTiendaComponent, 
    AsignarAccesosComponent, 
    VerDispositivosComponent, 
    VerLoginsComponent, 
    IpsBloqueadasComponent, 
    ConsultaRolesAplicacionComponent, 
    ConsultaUsuariosAplicacionComponent, 
    ConsultaUsuariosRolComponent, 
    AttemptTypePipe, 
    AplicacionPipe, 
    BuscarUsuarioComponent, 
    ConsultaRolesUsuarioComponent, 
    CopiarAccesoComponent],
  imports: [
    CommonModule,
    NgxSpinnerModule,
    PrimengModule,
    SharedModule,
    SeguridadRoutingModule
  ]
})
export class SeguridadModule { }
