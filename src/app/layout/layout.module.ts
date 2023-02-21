import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { PrimengModule } from '../primeng/primeng.module';
import { SharedModule } from '../shared/shared.module';

import { HeaderComponent } from './header/header.component';
import { SidenavComponent } from './sidenav/sidenav.component';

@NgModule({
  declarations: [
    SidenavComponent, 
    HeaderComponent
  ],
  imports: [
    PrimengModule,
    SharedModule
  ],
  exports: [
    SidenavComponent,
    HeaderComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LayoutModule { }
