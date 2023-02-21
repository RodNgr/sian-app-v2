import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgxSpinnerModule } from "ngx-spinner";

import { AuthRoutingModule } from './auth-routing.module';
import { PrimengModule } from '../primeng/primeng.module';
import { SharedModule } from '../shared/shared.module';

import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { MainComponent } from './pages/main/main.component';

@NgModule({
  declarations: [
    MainComponent,
    LoginComponent,
    LogoutComponent
  ],
  imports: [
    CommonModule,
    NgxSpinnerModule,
    AuthRoutingModule,
    PrimengModule,
    SharedModule, 
    FormsModule
  ]
})
export class AuthModule { }
