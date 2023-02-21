import { NgModule } from "@angular/core";

import { RouterModule, Routes } from "@angular/router";
import { ListaDescuentoCargoComponent } from './pages/lista-descuento-cargo/lista-descuento-cargo.component';
import { DescuentoCargoComponent } from './pages/descuento-cargo/descuento-cargo.component';
import { AuthGuard } from "../auth/guards/auth.guard";
import { RoleGuard } from "../auth/guards/role.guard";

const routes: Routes = [
    { path: '', children: 
      [
        { path: 'lista-descuento-cargo', component: ListaDescuentoCargoComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_RRHH_DESCUENTO_CARGO']} },
        { path: 'descuento-cargo', component: DescuentoCargoComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['ROL_SIAN_RRHH_DESCUENTO_CARGO']} },
      ]
    }
  ];
  
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })

export class RrhhRoutingModule { }