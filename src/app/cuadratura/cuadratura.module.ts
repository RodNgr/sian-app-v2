import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrimengModule } from '../primeng/primeng.module';
import { NgxSpinnerModule } from 'ngx-spinner';

import { CuadraturaRoutingModule } from './cuadratura-routing.module';
import { SharedModule } from '../shared/shared.module';

import { CuadraturaAgregadorComponent } from './pages/cuadratura-agregador/cuadratura-agregador.component';
import { DetalleProcesoComponent } from './components/detalle-proceso/detalle-proceso.component';
import { ListaComprobanteSovosComponent } from './pages/lista-comprobante-sovos/lista-comprobante-sovos.component';
import { ListaConfiguracionSovosComponent } from './pages/lista-configuracion-sovos/lista-configuracion-sovos.component';
import { ListaCuadraturaAgregadorComponent } from './pages/lista-cuadratura-agregador/lista-cuadratura-agregador.component';
import { ListaCuadraturaMallComponent } from './pages/lista-cuadratura-mall/lista-cuadratura-mall.component';
import { ListaCuadraturaUrbanovaComponent } from './pages/lista-cuadratura-urbanova/lista-cuadratura-urbanova.component';
import { ListaCuadraturaSovosComponent } from './pages/lista-cuadratura-sovos/lista-cuadratura-sovos.component';

import { EstadoCuadraturaPipe } from './pipes/estado-cuadratura.pipe';
import { EstadoProcesoPipe } from './pipes/estado-proceso.pipe';
import { EstadoSunatPipe } from './pipes/estado-sunat.pipe';
import { TipoComprobantePipe } from './pipes/tipo-comprobante.pipe';
import { ListaCuadraturaVisaComponent } from './pages/lista-cuadratura-visa/lista-cuadratura-visa.component';
import { ListaCuadraturaPeyaComponent } from './pages/lista-cuadratura-peya/lista-cuadratura-peya.component';
import { CuadraturaAgregadorPeyaComponent } from './pages/cuadratura-agregador-peya/cuadratura-agregador-peya.component';
import { ListaCuadraturaDidiComponent } from './pages/lista-cuadratura-didi/lista-cuadratura-didi.component';
import { CuadraturaAgregadorDidiComponent } from './pages/cuadratura-agregador-didi/cuadratura-agregador-didi.component';

@NgModule({
  declarations: [
    CuadraturaAgregadorComponent, 
    DetalleProcesoComponent, 
    ListaComprobanteSovosComponent,
    ListaConfiguracionSovosComponent,
    ListaCuadraturaAgregadorComponent,
    ListaCuadraturaMallComponent,
    ListaCuadraturaSovosComponent,
    ListaCuadraturaUrbanovaComponent,
    EstadoCuadraturaPipe,
    EstadoProcesoPipe,
    EstadoSunatPipe,
    TipoComprobantePipe,
    ListaCuadraturaVisaComponent,
    ListaCuadraturaPeyaComponent,
    CuadraturaAgregadorPeyaComponent,
    ListaCuadraturaDidiComponent,
    CuadraturaAgregadorDidiComponent
  ],
  imports: [
    CommonModule,
    CuadraturaRoutingModule,
    PrimengModule,
    NgxSpinnerModule,
    SharedModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CuadraturaModule { }
