import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { NgxSpinnerModule } from 'ngx-spinner';

import { InterfazRoutingModule } from './interfaz-routing.module';
import { PrimengModule } from '../primeng/primeng.module';
import { SharedModule } from 'primeng/api';

import { CargaMasivaProductoComponent } from './components/carga-masiva-producto/carga-masiva-producto.component';
import { EditInfoProductoComponent } from './components/edit-info-producto/edit-info-producto.component';
import { ErrorCargaMasivaComponent } from './components/error-carga-masiva/error-carga-masiva.component';
import { ExportArticulosComponent } from './pages/export-articulos/export-articulos.component';
import { FamiliaComponent } from './pages/familia/familia.component';
import { FindCategoriaSapComponent } from './components/find-categoria-sap/find-categoria-sap.component';
import { FindJerarquiaComponent } from './components/find-jerarquia/find-jerarquia.component';
import { InterfazProductoComponent } from './components/interfaz-producto/interfaz-producto.component';
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
import { IncidentesComponent } from './pages/incidentes/incidentes.component';
import { ResumenInterfacesComponent } from './pages/resumen-interfaces/resumen-interfaces.component';
import { ResumenInterfacesDetallesComponent } from './pages/resumen-interfaces-detalles/resumen-interfaces-detalles.component';
import { ResumenInterfacesBloqueadasComponent } from './pages/resumen-interfaces-bloqueadas/resumen-interfaces-bloqueadas.component';
import { BloqueoInterfacesComponent } from './pages/bloqueo-interfaces/bloqueo-interfaces.component';
import { ReprocesarInterfaceComponent } from './pages/reprocesar-interface/reprocesar-interface.component';
import { EstadoInterfacePipe } from './pipes/estado-interface.pipe';
import { VerIncidenteComponent } from './components/ver-incidente/ver-incidente.component';
import { TipoIncidenteLogPipe } from './pipes/tipo-incidente-log.pipe';
import { AsumirIncidenteComponent } from './components/asumir-incidente/asumir-incidente.component';
import { AperturaTiendaComponent } from './components/apertura-tienda/apertura-tienda.component';
import { ListaAperturaTiendaComponent } from './components/lista-apertura-tienda/lista-apertura-tienda.component';

@NgModule({
  declarations: [
    CargaMasivaProductoComponent, 
    EditInfoProductoComponent, 
    ErrorCargaMasivaComponent,
    ExportArticulosComponent, 
    FamiliaComponent,
    FindCategoriaSapComponent, 
    FindJerarquiaComponent, 
    InterfazProductoComponent, 
    ListaFamiliaComponent, 
    ListaSubFamilia1Component, 
    ListaSubFamilia2Component, 
    ListaSubFamilia3Component, 
    ListaSubFamilia4Component, 
    ListaTipoConsumoComponent, 
    MainInterfazProductoComponent, 
    SubFamilia1Component, 
    SubFamilia2Component, 
    SubFamilia3Component, 
    SubFamilia4Component, 
    TipoConsumoComponent, 
    ListaTiendaComponent, 
    TiendaComponent, 
    IncidentesComponent, 
    ResumenInterfacesComponent, 
    ResumenInterfacesDetallesComponent,
    ResumenInterfacesBloqueadasComponent, 
    BloqueoInterfacesComponent, 
    ReprocesarInterfaceComponent, 
    EstadoInterfacePipe, 
    VerIncidenteComponent, 
    TipoIncidenteLogPipe, 
    AsumirIncidenteComponent,
    AperturaTiendaComponent,
    ListaAperturaTiendaComponent,
  ], 
  imports: [
    CommonModule,
    InterfazRoutingModule,
    PrimengModule,
    NgxSpinnerModule,
    SharedModule,
    ReactiveFormsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class InterfazModule { }
