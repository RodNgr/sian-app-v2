import { Injectable } from '@angular/core';

import { AuthService } from '../../auth/services/auth.service';

import { Empresa } from '../entity/empresa';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  private empresas: Empresa[] = [
    new Empresa('001', 'Bembos', '20101087647', '1002', 2, 'BB'),
    new Empresa('006', 'Don Belisario', '20545699550', '1004', 3, 'DB'),
    new Empresa('007', 'Popeyes', '20545699126', '1005', 4, 'PP'),
    new Empresa('008', 'Chinawok', '20101869947', '1003', 5, 'CW'),
    new Empresa('009', 'Papa Johns', '20505897812', '1007', 7, 'PJ'),
    new Empresa('010', 'Dunkin Donuts', '20144215649', '1006', 8, 'DD')
  ]

  constructor(private authService: AuthService) {}

  public getEmpresas(): Empresa[] {
    
    let empresasSeleccionables: Empresa[] = [];
    const roles: string[] = this.authService.usuario.roles;

    if (roles.includes('ROL_SIAN_SCR')) {
      empresasSeleccionables = this.empresas;
    } else {
      if (roles.includes('ROL_SIAN_BEMBOS')) {
        empresasSeleccionables.push(this.getEmpresa(2));
      }

      if (roles.includes('ROL_SIAN_DON_BELISARIO')) {
        empresasSeleccionables.push(this.getEmpresa(3));
      }

      if (roles.includes('ROL_SIAN_POPEYES')) {
        empresasSeleccionables.push(this.getEmpresa(4));
      }

      if (roles.includes('ROL_SIAN_CHINAWOK')) {
        empresasSeleccionables.push(this.getEmpresa(5));
      }

      if (roles.includes('ROL_SIAN_PAPA_JOHNS')) {
        empresasSeleccionables.push(this.getEmpresa(7));
      }

      if (roles.includes('ROL_SIAN_DUNKINS')) {
        empresasSeleccionables.push(this.getEmpresa(8));
      }
    }

    return empresasSeleccionables;
  }

  public getEmpresa(idEmpresa: number): Empresa {
    const emps: Empresa[] = this.empresas.filter(e => e.idEmpresa === idEmpresa);

    if (emps.length == 0) {
      return new Empresa('-1', 'Sin seleccionar', '', '', -1, '');
    } else {
      return emps[0];
    }
  }

  public getEmpresaSeleccionada(): Empresa {
    return JSON.parse(sessionStorage.getItem('empresa')!);
  }

  public seleccionarEmpresa(empresa: Empresa) {
    sessionStorage.setItem('empresa', JSON.stringify(empresa));
  }

  public getAllEmpresas(): Empresa[] {
    return this.empresas;
  }

}
