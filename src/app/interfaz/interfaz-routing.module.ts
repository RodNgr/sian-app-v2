import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../auth/guards/auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';

import { ExportArticulosComponent } from './pages/export-articulos/export-articulos.component';
import { FamiliaComponent } from './pages/familia/familia.component';
import { ListaFamiliaComponent } from './pages/lista-familia/lista-familia.component';
import { ListaSubFamilia1Component } from './pages/lista-sub-familia1/lista-sub-familia1.component';
import { ListaSubFamilia2Component } from './pages/lista-sub-familia2/lista-sub-familia2.component';
import { ListaSubFamilia3Component } from './pages/lista-sub-familia3/lista-sub-familia3.component';
import { ListaSubFamilia4Component } from './pages/lista-sub-familia4/lista-sub-familia4.component';
import { ListaTipoConsumoComponent } from './pages/lista-tipo-consumo/lista-tipo-consumo.component';
import { MainInterfazProductoComponent } from './pages/main-interfaz-producto/main-interfaz-producto.component';
import { SubFamilia1Component } from './pages/sub-familia1/sub-familia1.component';
import { SubFamilia2Component } from './pages/sub-familia2/sub-familia2.component';
import { SubFamilia3Component } from './pages/sub-familia3/sub-familia3.component';
import { SubFamilia4Component } from './pages/sub-familia4/sub-familia4.component';
import { TipoConsumoComponent } from './pages/tipo-consumo/tipo-consumo.component';
import { ListaTiendaComponent } from './pages/lista-tienda/lista-tienda.component';
import { TiendaComponent } from './pages/tienda/tienda.component';
import { ResumenInterfacesComponent } from './pages/resumen-interfaces/resumen-interfaces.component';
import { ResumenInterfacesBloqueadasComponent } from './pages/resumen-interfaces-bloqueadas/resumen-interfaces-bloqueadas.component';
import { ReprocesarInterfaceComponent } from './pages/reprocesar-interface/reprocesar-interface.component';
import { BloqueoInterfacesComponent } from './pages/bloqueo-interfaces/bloqueo-interfaces.component';
import { IncidentesComponent } from './pages/incidentes/incidentes.component';
import { AperturaTiendaComponent } from './components/apertura-tienda/apertura-tienda.component';
import { ListaAperturaTiendaComponent } from './components/lista-apertura-tienda/lista-apertura-tienda.component';
import { ListaBeneficioEmpleadoComponent } from './components/lista-beneficio-empleado/lista-beneficio-empleado.component';
import { ListaFeriadosComponent } from './components/lista-feriados/lista-feriados.component';
import { ListaTiendasBeneficioComponent } from './components/lista-tiendas-descuento/lista-tiendas-descuento.component';

const routes: Routes = [
  { path: '', children: 
    [
      { path: 'lista-tipo-consumo', component: ListaTipoConsumoComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_ITZ_TIPO_CONSUMO']} },
      { path: 'tipo-consumo', component: TipoConsumoComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_ITZ_TIPO_CONSUMO']} },

      { path: 'lista-familia', component: ListaFamiliaComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_ITZ_FAMILIA']} },
      { path: 'familia', component: FamiliaComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_ITZ_FAMILIA']} },

      { path: 'lista-subfamilia1', component: ListaSubFamilia1Component, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_ITZ_SUBFAMILIA1']} },
      { path: 'subfamilia1', component: SubFamilia1Component, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_ITZ_SUBFAMILIA1']} },

      { path: 'lista-subfamilia2', component: ListaSubFamilia2Component, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_ITZ_SUBFAMILIA2']} },
      { path: 'subfamilia2', component: SubFamilia2Component, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_ITZ_SUBFAMILIA2']} },

      { path: 'lista-subfamilia3', component: ListaSubFamilia3Component, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_ITZ_SUBFAMILIA3']} },
      { path: 'subfamilia3', component: SubFamilia3Component, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_ITZ_SUBFAMILIA3']} },

      { path: 'lista-subfamilia4', component: ListaSubFamilia4Component, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_ITZ_SUBFAMILIA4']} },
      { path: 'subfamilia4', component: SubFamilia4Component, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_ITZ_SUBFAMILIA4']} },

      { path: 'lista-tienda', component: ListaTiendaComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_ITZ_TIENDA']} },
      { path: 'tienda', component: TiendaComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_ITZ_TIENDA']} },

      { path: 'interfaz-articulo', component: MainInterfazProductoComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_ITZ_ARTICULO', 'ROL_SIAN_ITZ_MOD_ARTICULO', 'ROL_SIAN_ITZ_MASIVA_ARTICULO']} },
      { path: 'export-articulos', component: ExportArticulosComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_ITZ_ARTICULO', 'ROL_SIAN_ITZ_DOWNLOAD_ARTICULO']} },

      { path: 'resumen-interface', component: ResumenInterfacesComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_ITZ_RESUMEN']} },
      { path: 'reprocesar-intreface', component: ReprocesarInterfaceComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_ITZ_REPROCESAR']} },
      { path: 'bloquear', component: BloqueoInterfacesComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_ITZ_BLOQUEO']} },
      { path: 'resumen-bloqueo', component: ResumenInterfacesBloqueadasComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_ITZ_RESUMEN_BLOQUEO']} },
      { path: 'incidente', component: IncidentesComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_ITZ_INCIDENTE']} },
      { path: 'apertura-tienda', component: AperturaTiendaComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_ITZ_INCIDENTE']} },
      { path: 'lista-apertura-tienda', component: ListaAperturaTiendaComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_ITZ_INCIDENTE']} },
      
      { path: 'feriados', component: ListaFeriadosComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_ITZ_INCIDENTE']} },
      { path: 'nuevo-feriado', component: ListaFeriadosComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_ITZ_INCIDENTE']} },      
      { path: 'beneficio-empleado', component: ListaBeneficioEmpleadoComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_ITZ_INCIDENTE']} },
      { path: 'nuevo-feriado', component: ListaBeneficioEmpleadoComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_ITZ_INCIDENTE']} },
      { path: 'beneficio-tienda', component: ListaTiendasBeneficioComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_ITZ_INCIDENTE']} },
      { path: 'nuevo-beneficio-tienda', component: ListaTiendasBeneficioComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_ITZ_INCIDENTE']} },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InterfazRoutingModule { }
