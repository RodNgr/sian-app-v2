import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RrhhRoutingModule } from './rrhh-routing.module';
import { ListaDescuentoCargoComponent } from './pages/lista-descuento-cargo/lista-descuento-cargo.component';
import { DescuentoCargoComponent } from './pages/descuento-cargo/descuento-cargo.component';
import { EstadoPipe } from './pipes/estado.pipe';
import { PrimengModule } from '../primeng/primeng.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [ListaDescuentoCargoComponent, DescuentoCargoComponent, EstadoPipe],
  imports: [
    CommonModule,
    RrhhRoutingModule,
    PrimengModule,
    NgxSpinnerModule,
    SharedModule
  ]
})
export class RrhhModule { }
