import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { CajaChicaComponent } from './pages/caja-chica/caja-chica.component';
import { CierreDiaComponent } from './pages/cierre-dia/cierre-dia.component';
import { ReporteDepositosComponent } from './pages/reporte-depositos/reporte-depositos.component';
import { ReporteOtrasCuadraturasComponent } from './pages/reporte-otras-cuadraturas/reporte-otras-cuadraturas.component';
import { TableroControlComponent } from './pages/tablero-control/tablero-control.component';
import { CambioCuentaComponent } from './pages/cambio-cuenta/cambio-cuenta.component';

const routes: Routes = [
  { path: '', children: 
    [
      { path: 'cierre-dia', component: CierreDiaComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_CIERRE_DIA']}},
      { path: 'caja-chica', component: CajaChicaComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_CIERRE_CAJA_CHICA']} },

      { path: 'reporte-depositos', component: ReporteDepositosComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_CIERRE_REP_DEPOSITO']} },
      { path: 'tablero-control', component: TableroControlComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_CIERRE_REP_TAB_CONTROL']} },
      { path: 'reporte-otras-cuadraturas', component: ReporteOtrasCuadraturasComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_CIERRE_REP_OTRA_CUADRATURA']} },
      { path: 'cambio-cuenta', component: CambioCuentaComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_CIERRE_CAMBIO_CUENTA']} },//ROL_SIAN_CIERRE_CAMBIO_CUENTA
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CierreRoutingModule { }
