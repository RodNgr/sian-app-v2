import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { MainComponent } from './pages/main/main.component';

const routes: Routes = [
  { path: '', component: HomeComponent, children: 
    [
      { path: '', component: MainComponent },
      { path: 'cierre', loadChildren: () => import('../cierre/cierre.module').then(m => m.CierreModule) },
      { path: 'cupon', loadChildren: () => import('../cupon/cupon.module').then(m => m.CuponModule) },
      { path: 'interfaz', loadChildren: () => import('../interfaz/interfaz.module').then(m => m.InterfazModule) },
      { path: 'cuadratura', loadChildren: () => import('../cuadratura/cuadratura.module').then(m => m.CuadraturaModule) },
      { path: 'reporte', loadChildren: () => import('../reporte/reporte.module').then(m => m.ReporteModule) },
      { path: 'rrhh', loadChildren: () => import('../rrhh/rrhh.module').then(m => m.RrhhModule) },
      { path: 'seguridad', loadChildren: () => import('../seguridad/seguridad.module').then(m => m.SeguridadModule) },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
