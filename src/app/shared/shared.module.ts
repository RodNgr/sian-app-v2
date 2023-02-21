import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrimengModule } from '../primeng/primeng.module';

import { SelectorEmpresaComponent } from './components/selector-empresa/selector-empresa.component';
import { SafePipe } from './pipes/safe.pipe';
import { ViewPdfComponent } from './components/view-pdf/view-pdf.component';
import { VisorImagenesComponent } from './components/visor-imagenes/visor-imagenes.component';
import { BytesPipe } from './pipes/bytes.pipe';

@NgModule({
  declarations: [
    SelectorEmpresaComponent, 
    ViewPdfComponent, 
    VisorImagenesComponent,
    BytesPipe,
    SafePipe
  ],
  imports: [
    CommonModule,
    PrimengModule
  ],
  exports: [
    SelectorEmpresaComponent,
    ViewPdfComponent,
    VisorImagenesComponent,
    BytesPipe,
    SafePipe,
  ]
})
export class SharedModule { }
