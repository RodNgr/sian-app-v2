import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { CyberComponent } from './pages/cyber/cyber.component';
import { DownloadCallComponent } from './pages/download-call/download-call.component';
import { ConsultaCallComponent } from './pages/consulta-call/consulta-call.component';
import { ReporteGestionProsegurComponent } from './pages/reporte-gestion-prosegur/reporte-gestion-prosegur.component';
import { ReporteGestionVentasComponent } from './pages/reporte-gestion-ventas/reporte-gestion-ventas.component';
import { ReporteGestionVentasFormaPagoComponent } from './pages/reporte-gestion-ventas-forma-pago/reporte-gestion-ventas-forma-pago.component';
import { ReporteGestionVentasAgregadorComponent } from './pages/reporte-gestion-ventas-agregador/reporte-gestion-ventas-agregador.component';
import { ReporteGestionRendidoTarjetasComponent } from './pages/reporte-gestion-rendido-tarjetas/reporte-gestion-rendido-tarjetas.component';
import { ReporteGestionCallCenter1Component } from './pages/reporte-gestion-call-center1/reporte-gestion-call-center1.component';
import { ReporteGestionCallCenter2Component } from './pages/reporte-gestion-call-center2/reporte-gestion-call-center2.component';
import { ReporteControlComparativoHoraComponent } from './pages/reporte-control-comparativo-hora/reporte-control-comparativo-hora.component';
import { ReporteControlValesComponent } from './pages/reporte-control-vales/reporte-control-vales.component';
import { ReporteControlCrmComponent } from './pages/reporte-control-crm/reporte-control-crm.component';
import { ReporteControlVentasComponent } from './pages/reporte-control-ventas/reporte-control-ventas.component';
import { ReporteGestionPagadoEfectivoComponent } from './pages/reporte-gestion-pagado-efectivo/reporte-gestion-pagado-efectivo.component';
import { ListaTransaccionComponent } from './pages/lista-transaccion/lista-transaccion.component';
import { ReporteGestionVentaLocatarioComponent } from './pages/reporte-gestion-venta-locatario/reporte-gestion-venta-locatario.component';
import { ReporteRedimidoComponent } from './pages/reporte-redimido/reporte-redimido.component';
import { GestionClienteComponent } from './pages/gestion-cliente/gestion-cliente.component';
import { ProcesoAutomaticoComponent } from './pages/proceso-automatico/proceso-automatico.component';
import { AnularPedidosHubComponent } from './pages/anular-pedidos-hub/anular-pedidos-hub.component';

import { LibroReclamacionesComponent } from './pages/reporte-libro-reclamaciones/reporte-libro-reclamaciones.component';

const routes: Routes = [
  { path: '',  children: 
    [
      { path: 'cyber', component: CyberComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_REPORTE_CYBER']} },
      { path: 'download-call', component: DownloadCallComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_CALL_DOWNLOAD']} },
      { path: 'consulta-call', component: ConsultaCallComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_CALL_CONSULTA']} },

      { path: 'reporte-gestion-cliente', component: GestionClienteComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_REP_GES_VTA_FORMA_PAGO']} },
      { path: 'reporte-gestion-vta-locatario', component: ReporteGestionVentaLocatarioComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_REP_GES_VTA_LOCATARIO']} },
      { path: 'reporte-gestion-prosegur', component: ReporteGestionProsegurComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_REP_GES_PROSEGUR']} },
      { path: 'reporte-gestion-ventas', component: ReporteGestionVentasComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_REP_GES_VENTAS']} },
      { path: 'reporte-gestion-pago', component: ReporteGestionVentasFormaPagoComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_REP_GES_VTA_FORMA_PAGO']} },
      { path: 'reporte-gestion-agregador', component: ReporteGestionVentasAgregadorComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_REP_GES_AGREGADOR']} },
      { path: 'reporte-gestion-rendido-tarjeta', component: ReporteGestionRendidoTarjetasComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_REP_GES_RENDIDO_TARJETA']} },
      { path: 'reporte-gestion-pago-efectivo', component: ReporteGestionPagadoEfectivoComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_REP_GES_PAG_COB_EFECTIVO']} },
      { path: 'reporte-gestion-call-1', component: ReporteGestionCallCenter1Component, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_REP_GES_CALL_VENTA']} },
      { path: 'reporte-gestion-call-2', component: ReporteGestionCallCenter2Component, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_REP_GES_CALL_MEMBRESIA']} },
      { path: 'reporte-control-ventas', component: ReporteControlVentasComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_REP_CON_VENTAS']} },
      { path: 'reporte-control-crm', component: ReporteControlCrmComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_REP_CON_CRM']} },
      { path: 'reporte-control-vales', component: ReporteControlValesComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_REP_CON_VALE_ALIMENTO']} },
      { path: 'reporte-control-comparativo-horas', component: ReporteControlComparativoHoraComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_REP_CON_COMPARATIVO']} },
      { path: 'lista-reporte', component: ListaTransaccionComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_REP_EJECUTAR_CONSULTA']} },
      { path: 'reporte-redimido', component: ReporteRedimidoComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_REP_CON_REDIMIDO']} },
      { path: 'anular-pedido', component: AnularPedidosHubComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_ANULAR_PEDIDO_HUB']} },
      { path: 'lista-reporte', component: ListaTransaccionComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_REP_EJECUTAR_CONSULTA']} },
      { path: 'reporte-libro-reclamaciones', component: LibroReclamacionesComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_FORMULARIO_WEB']} },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReporteRoutingModule { }
