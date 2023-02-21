import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { PrimengModule } from '../primeng/primeng.module';

import { HomeComponent } from './pages/home/home.component';
import { LayoutModule } from '../layout/layout.module';
import { MainComponent } from './pages/main/main.component';

@NgModule({
  declarations: [MainComponent, HomeComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    LayoutModule,
    PrimengModule
  ]
})
export class HomeModule { }
