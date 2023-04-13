import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CuponRoutingModule } from './cupon-routing.module';
import { PrimengModule } from '../primeng/primeng.module';
import { SharedModule } from '../shared/shared.module';

import { AmpliarFechaComponent } from './components/ampliar-fecha/ampliar-fecha.component';
import { AnularValeProvisionalComponent } from './components/anular-vale-provisional/anular-vale-provisional.component';
import { AprobarValeComponent } from './components/aprobar-vale/aprobar-vale.component';
import { AsignarPrefijoComponent } from './components/asignar-prefijo/asignar-prefijo.component';
import { ConsultaValesComponent } from './pages/consulta-vales/consulta-vales.component';
import { CuponCorporativoComponent } from './pages/cupon-corporativo/cupon-corporativo.component';
import { CuponEntelComponent } from './pages/cupon-entel/cupon-entel.component';
import { FindDocumentoCobranzaComponent } from './components/find-documento-cobranza/find-documento-cobranza.component';
import { FindPrefijoComponent } from './components/find-prefijo/find-prefijo.component';
import { FormatoValeComponent } from './pages/formato-vale/formato-vale.component';
import { ListaCuponCorporativoComponent } from './pages/lista-cupon-corporativo/lista-cupon-corporativo.component';
import { ListaCuponEntelComponent } from './pages/lista-cupon-entel/lista-cupon-entel.component';
import { ListaFormatosValeComponent } from './pages/lista-formatos-vale/lista-formatos-vale.component';
import { ListaPrefijosComponent } from './pages/lista-prefijos/lista-prefijos.component';
import { ListaSolicitudDiemComponent } from './pages/lista-solicitud-diem/lista-solicitud-diem.component';
import { ListaValeCortesiaComponent } from './pages/lista-vale-cortesia/lista-vale-cortesia.component';
import { PrefijoComponent } from './pages/prefijo/prefijo.component';
import { RegistraDiemComponent } from './components/registra-diem/registra-diem.component';
import { ReimprimirValeComponent } from './components/reimprimir-vale/reimprimir-vale.component';
import { ReporteDocumentoCobranzaComponent } from './pages/reporte-documento-cobranza/reporte-documento-cobranza.component';
import { ReporteValesComponent } from './pages/reporte-vales/reporte-vales.component';
import { SeleccionarFormatoComponent } from './components/seleccionar-formato/seleccionar-formato.component';
import { SolicitudDiemComponent } from './pages/solicitud-diem/solicitud-diem.component';
import { ValeCortesiaComponent } from './pages/vale-cortesia/vale-cortesia.component';

import { ClasificacionValePipe } from './pipes/clasificacion-vale.pipe';
import { EstadoSolicitudPipe } from './pipes/estado-solicitud.pipe';
import { EstadoValePipe } from './pipes/estado-vale.pipe';
import { FormatoValePipe } from './pipes/formato-vale.pipe';
import { TipoValeEntelPipe } from './pipes/tipo-vale-entel.pipe';
import { CuponOmnicanalComponent } from './pages/cupon-omnicanal/cupon-omnicanal.component';
import { ListaCuponOmnicanalComponent } from './pages/lista-cupon-omnicanal/lista-cupon-omnicanal.component';
import { ReporteCuponOmnicanalComponent } from './pages/reporte-cupon-omnicanal/reporte-cupon-omnicanal.component';
import { ActualizarFechaCuponOmnicanalComponent } from './components/actualizar-fecha-cupon-omnicanal/actualizar-fecha-cupon-omnicanal.component';
import { RegistraCantidadProdComponent } from './components/registra-cantidad-prod/registra-cantidad-prod.component';
import { AnularCuponComponent } from './components/anular-cupon/anular-cupon.component';

@NgModule({
  declarations: [
    AmpliarFechaComponent,
    AnularValeProvisionalComponent,
    AprobarValeComponent,
    AsignarPrefijoComponent,
    ConsultaValesComponent,
    CuponCorporativoComponent,
    CuponEntelComponent,
    FindDocumentoCobranzaComponent,
    FindPrefijoComponent,
    FormatoValeComponent,
    ListaCuponCorporativoComponent,
    ListaCuponEntelComponent,
    ListaFormatosValeComponent,
    ListaPrefijosComponent,
    ListaSolicitudDiemComponent,
    ListaValeCortesiaComponent,
    PrefijoComponent,
    RegistraDiemComponent,
    ReimprimirValeComponent,
    ReporteDocumentoCobranzaComponent,
    ReporteValesComponent,
    SeleccionarFormatoComponent,
    SolicitudDiemComponent,
    ValeCortesiaComponent,   
    ClasificacionValePipe,
    EstadoSolicitudPipe,
    EstadoValePipe,
    FormatoValePipe,
    TipoValeEntelPipe,
    CuponOmnicanalComponent,
    ListaCuponOmnicanalComponent,
    ReporteCuponOmnicanalComponent,
    ActualizarFechaCuponOmnicanalComponent,
    RegistraCantidadProdComponent,
    AnularCuponComponent,
  ],
  imports: [
    CommonModule,
    CuponRoutingModule,
    PrimengModule,
    NgxSpinnerModule,
    SharedModule,
    FormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CuponModule { }
