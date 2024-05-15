import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../auth/guards/auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';

import { CuadraturaAgregadorComponent } from './pages/cuadratura-agregador/cuadratura-agregador.component';
import { ListaComprobanteSovosComponent } from './pages/lista-comprobante-sovos/lista-comprobante-sovos.component';
import { ListaConfiguracionSovosComponent } from './pages/lista-configuracion-sovos/lista-configuracion-sovos.component';
import { ListaCuadraturaAgregadorComponent } from './pages/lista-cuadratura-agregador/lista-cuadratura-agregador.component';
import { ListaCuadraturaMallComponent } from './pages/lista-cuadratura-mall/lista-cuadratura-mall.component';
import { ListaCuadraturaSovosComponent } from './pages/lista-cuadratura-sovos/lista-cuadratura-sovos.component';
import { ListaCuadraturaUrbanovaComponent } from './pages/lista-cuadratura-urbanova/lista-cuadratura-urbanova.component';
import { CuadraturaAgregadorPeyaComponent } from './pages/cuadratura-agregador-peya/cuadratura-agregador-peya.component';
import { ListaCuadraturaPeyaComponent } from './pages/lista-cuadratura-peya/lista-cuadratura-peya.component';
import { ListaCuadraturaDidiComponent } from './pages/lista-cuadratura-didi/lista-cuadratura-didi.component';
import { CuadraturaAgregadorDidiComponent } from './pages/cuadratura-agregador-didi/cuadratura-agregador-didi.component';

const routes: Routes = [
  { path: '', children: 
    [
      { path: 'lista-cuadratura-rappi', component: ListaCuadraturaAgregadorComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_CUAD_AGREGADOR_RAPPI']} },
      { path: 'lista-cuadratura-peya', component: ListaCuadraturaPeyaComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_CUAD_AGREGADOR_RAPPI']} },
      { path: 'lista-cuadratura-didi', component: ListaCuadraturaDidiComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_CUAD_AGREGADOR_RAPPI']} },
      { path: 'pedidos-rappi', component: CuadraturaAgregadorComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_CUAD_AGREGADOR_RAPPI']} },
      { path: 'pedidos-peya', component: CuadraturaAgregadorPeyaComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_CUAD_AGREGADOR_RAPPI']} },
      { path: 'pedidos-didi', component: CuadraturaAgregadorDidiComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_CUAD_AGREGADOR_RAPPI']} },

      { path: 'lista-configuracion', component: ListaConfiguracionSovosComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_CUAD_SOVOS_CONF']} },

      { path: 'lista-cuadratura-mall', component: ListaCuadraturaMallComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_CUAD_MALL']} },
      { path: 'lista-cuadratura-urbanova', component: ListaCuadraturaUrbanovaComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_CUAD_URBANOVA']} },
      { path: 'lista-cuadratura-sovos', component: ListaCuadraturaSovosComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_CUAD_SOVOS']} },
      { path: 'lista-comprobante-sovos', component: ListaComprobanteSovosComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_CUAD_SOVOS']} },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CuadraturaRoutingModule { }
