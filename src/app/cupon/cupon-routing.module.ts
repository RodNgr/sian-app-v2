import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConsultaValesComponent } from './pages/consulta-vales/consulta-vales.component';
import { CuponEntelComponent } from './pages/cupon-entel/cupon-entel.component';
import { CuponCorporativoComponent } from './pages/cupon-corporativo/cupon-corporativo.component';
import { FormatoValeComponent } from './pages/formato-vale/formato-vale.component';
import { ListaCuponCorporativoComponent } from './pages/lista-cupon-corporativo/lista-cupon-corporativo.component';
import { ListaCuponEntelComponent } from './pages/lista-cupon-entel/lista-cupon-entel.component';
import { ListaFormatosValeComponent } from './pages/lista-formatos-vale/lista-formatos-vale.component';
import { ListaPrefijosComponent } from './pages/lista-prefijos/lista-prefijos.component';
import { ListaSolicitudDiemComponent } from './pages/lista-solicitud-diem/lista-solicitud-diem.component';
import { ListaValeCortesiaComponent } from './pages/lista-vale-cortesia/lista-vale-cortesia.component';
import { PrefijoComponent } from './pages/prefijo/prefijo.component';
import { ReporteDocumentoCobranzaComponent } from './pages/reporte-documento-cobranza/reporte-documento-cobranza.component';
import { ReporteValesComponent } from './pages/reporte-vales/reporte-vales.component';
import { SolicitudDiemComponent } from './pages/solicitud-diem/solicitud-diem.component';
import { ValeCortesiaComponent } from './pages/vale-cortesia/vale-cortesia.component';

import { AuthGuard } from '../auth/guards/auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { CuponOmnicanalComponent } from './pages/cupon-omnicanal/cupon-omnicanal.component';
import { ListaCuponOmnicanalComponent } from './pages/lista-cupon-omnicanal/lista-cupon-omnicanal.component';
import { ReporteCuponOmnicanalComponent } from './pages/reporte-cupon-omnicanal/reporte-cupon-omnicanal.component';

const routes: Routes = [
  { path: '',  children: 
    [
      { path: 'lista-prefijos', component: ListaPrefijosComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_MKT_PREFIJO']} },
      { path: 'prefijo', component: PrefijoComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_MKT_PREFIJO']} },

      { path: 'lista-formato-vale', component: ListaFormatosValeComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_MKT_FORMATO_VALE']} },
      { path: 'formato-vale', component: FormatoValeComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_MKT_FORMATO_VALE']} },

      { path: 'lista-vale-cortesia', component: ListaValeCortesiaComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_MKT_CORTESIA']} },
      { path: 'vale-cortesia', component: ValeCortesiaComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_MKT_CORTESIA']} },

      { path: 'lista-cupon-entel', component: ListaCuponEntelComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_MKT_ENTEL']} },
      { path: 'cupon-entel', component: CuponEntelComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_MKT_ENTEL']} },

      { path: 'lista-cupon-corporativo', component: ListaCuponCorporativoComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_MKT_CORPORATIVO']} },
      { path: 'cupon-corporativo', component: CuponCorporativoComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_MKT_CORPORATIVO']} }, 

      { path: 'lista-solicitud-diem', component: ListaSolicitudDiemComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_MKT_SOLICITUD_DIEM']} },
      { path: 'solicitud-diem', component: SolicitudDiemComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_MKT_SOLICITUD_DIEM']} }, 

      { path: 'consulta-vales', component: ConsultaValesComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_MKT_REP_VALE']} },
      { path: 'reporte-vales', component: ReporteValesComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_MKT_REP_VALE']} },
      { path: 'reporte-documento-cobranza', component: ReporteDocumentoCobranzaComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_MKT_REP_DOCUMENTOS']} },
   
      { path: 'lista-cupon-omnicanal', component: ListaCuponOmnicanalComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_MKT_CORPORATIVO']} }, 
      { path: 'cupon-omnicanal', component: CuponOmnicanalComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_MKT_CORPORATIVO']} }, 
      { path: 'reporte-cupon-omnicanal', component: ReporteCuponOmnicanalComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_MKT_CORPORATIVO']} }, 

    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class CuponRoutingModule { }
