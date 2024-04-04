import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReporteRoutingModule } from './reporte-routing.module';
import { PrimengModule } from '../primeng/primeng.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SharedModule } from '../shared/shared.module';
import { EjecutarConsultaComponent } from './pages/ejecutar-consulta/ejecutar-consulta.component';
import { EstadoReportePipe } from './pipes/estado-reporte.pipe';
import { CyberComponent } from './pages/cyber/cyber.component';
import { DownloadCallComponent } from './pages/download-call/download-call.component';
import { ConsultaCallComponent } from './pages/consulta-call/consulta-call.component';
import { DetalleClienteCallComponent } from './components/detalle-cliente-call/detalle-cliente-call.component';
import { MarcaPipe } from './pipes/marca.pipe';
import { TipoCentroPipe } from './pipes/tipo-centro.pipe';
import { HighlightModule } from 'ngx-highlightjs';
import { DetalleReporteComponent } from './components/detalle-reporte/detalle-reporte.component';
import { ListaTransaccionComponent } from './pages/lista-transaccion/lista-transaccion.component';
import { ReporteGestionProsegurComponent } from './pages/reporte-gestion-prosegur/reporte-gestion-prosegur.component';
import { ReporteGestionVentasComponent } from './pages/reporte-gestion-ventas/reporte-gestion-ventas.component';
import { ReporteGestionVentasFormaPagoComponent } from './pages/reporte-gestion-ventas-forma-pago/reporte-gestion-ventas-forma-pago.component';
import { ReporteGestionRendidoTarjetasComponent } from './pages/reporte-gestion-rendido-tarjetas/reporte-gestion-rendido-tarjetas.component';
import { ReporteGestionPagadoEfectivoComponent } from './pages/reporte-gestion-pagado-efectivo/reporte-gestion-pagado-efectivo.component';
import { ReporteGestionVentasAgregadorComponent } from './pages/reporte-gestion-ventas-agregador/reporte-gestion-ventas-agregador.component';
import { ReporteGestionCallCenter1Component } from './pages/reporte-gestion-call-center1/reporte-gestion-call-center1.component';
import { ReporteGestionCallCenter2Component } from './pages/reporte-gestion-call-center2/reporte-gestion-call-center2.component';
import { ReporteControlVentasComponent } from './pages/reporte-control-ventas/reporte-control-ventas.component';
import { ReporteControlCrmComponent } from './pages/reporte-control-crm/reporte-control-crm.component';
import { ReporteControlValesComponent } from './pages/reporte-control-vales/reporte-control-vales.component';
import { ReporteControlComparativoHoraComponent } from './pages/reporte-control-comparativo-hora/reporte-control-comparativo-hora.component';
import { TiendaErrorComponent } from './components/tienda-error/tienda-error.component';
import { ReporteLibreComponent } from './components/reporte-libre/reporte-libre.component';
import { TipoReportePipe } from './pipes/tipo-reporte.pipe';
import { TipoBaseDatosPipe } from './pipes/tipo-base-datos.pipe';
import { ReporteGestionVentaLocatarioComponent } from './pages/reporte-gestion-venta-locatario/reporte-gestion-venta-locatario.component';
import { ReporteRedimidoComponent } from './pages/reporte-redimido/reporte-redimido.component';
import { GestionClienteComponent } from './pages/gestion-cliente/gestion-cliente.component';
import { ProcesoAutomaticoComponent } from './pages/proceso-automatico/proceso-automatico.component';
import { DetalleProcesoAutomaticoComponent } from './components/detalle-procesoautomatico/detalle-procesoautomatico.component';
import { AnularPedidosHubComponent } from './pages/anular-pedidos-hub/anular-pedidos-hub.component';
import { LibroReclamacionesComponent } from './pages/reporte-libro-reclamaciones/reporte-libro-reclamaciones.component';

@NgModule({
  declarations: [
    EjecutarConsultaComponent, 
    EstadoReportePipe, 
    CyberComponent, 
    DownloadCallComponent, 
    ConsultaCallComponent, 
    DetalleClienteCallComponent, 
    MarcaPipe, 
    TipoCentroPipe, 
    DetalleReporteComponent, 
    ListaTransaccionComponent, 
    ReporteGestionProsegurComponent, 
    ReporteGestionVentasComponent, 
    ReporteGestionVentasFormaPagoComponent, 
    ReporteGestionRendidoTarjetasComponent, 
    ReporteGestionPagadoEfectivoComponent, 
    ReporteGestionVentasAgregadorComponent, 
    ReporteGestionCallCenter1Component,  
    ReporteGestionCallCenter2Component, 
    ReporteControlVentasComponent, 
    ReporteControlCrmComponent, 
    ReporteControlValesComponent, 
    ReporteControlComparativoHoraComponent, 
    ReporteLibreComponent,
    TiendaErrorComponent,
    TipoReportePipe,
    TipoBaseDatosPipe,
    ReporteGestionVentaLocatarioComponent,
    ReporteRedimidoComponent,
    GestionClienteComponent,
    ProcesoAutomaticoComponent,
    DetalleProcesoAutomaticoComponent,
    AnularPedidosHubComponent,
    LibroReclamacionesComponent
  ],
  imports: [
    CommonModule,
    ReporteRoutingModule,
    PrimengModule,
    NgxSpinnerModule,
    SharedModule,
    HighlightModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ReporteModule { }
