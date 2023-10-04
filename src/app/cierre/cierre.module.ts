import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CierreRoutingModule } from './cierre-routing.module';
import { CierreDiaComponent } from '../cierre/pages/cierre-dia/cierre-dia.component';
import { CajaChicaComponent } from './pages/caja-chica/caja-chica.component';
import { ReporteDepositosComponent } from './pages/reporte-depositos/reporte-depositos.component';
import { TableroControlComponent } from './pages/tablero-control/tablero-control.component';
import { ReporteOtrasCuadraturasComponent } from './pages/reporte-otras-cuadraturas/reporte-otras-cuadraturas.component';
import { PrimengModule } from '../primeng/primeng.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SharedModule } from '../shared/shared.module';
import { DepositosPixelComponent } from './pages/depositos-pixel/depositos-pixel.component';
import { DepositoConEfectivoComponent } from './pages/deposito-con-efectivo/deposito-con-efectivo.component';
import { DepositoSinEfectivoComponent } from './pages/deposito-sin-efectivo/deposito-sin-efectivo.component';
import { OtrasCuadraturasComponent } from './pages/otras-cuadraturas/otras-cuadraturas.component';
import { CambioCuentaComponent } from './pages/cambio-cuenta/cambio-cuenta.component';
import { EditarCuentaBancariaComponent } from './components/editar-cuenta-bancaria/editar-cuenta-bancaria.component';
<<<<<<< HEAD
import { CuentaBancariaComponent } from './pages/cuenta-bancaria/cuenta-bancaria.component';
import { EditarCuentaComponent } from './components/editar-cuenta/editar-cuenta.component';
=======
import { TiendaDepositoComponent } from './pages/tienda-deposito/tienda-deposito.component';


>>>>>>> a26d767 (feat: modulo actualizar tienda deposito)
@NgModule({
  declarations: [
    CierreDiaComponent,
    CajaChicaComponent, 
    ReporteDepositosComponent, 
    TableroControlComponent, 
    ReporteOtrasCuadraturasComponent, DepositosPixelComponent, DepositoConEfectivoComponent,
    DepositoSinEfectivoComponent,
    OtrasCuadraturasComponent,
    CambioCuentaComponent,
<<<<<<< HEAD
    EditarCuentaBancariaComponent,
    CuentaBancariaComponent,
    EditarCuentaComponent
=======
    CambioCuentaComponent,
    EditarCuentaBancariaComponent,
    TiendaDepositoComponent,
>>>>>>> a26d767 (feat: modulo actualizar tienda deposito)
  ],
  imports: [
    CommonModule,
    CierreRoutingModule,
    PrimengModule,
    NgxSpinnerModule,
    SharedModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CierreModule { }
