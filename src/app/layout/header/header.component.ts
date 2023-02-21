import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import { AuthService } from '../../auth/services/auth.service';
import { EmpresaService } from '../../shared/services/empresa.service';

import { SelectorEmpresaComponent } from '../../shared/components/selector-empresa/selector-empresa.component';

import { Empresa } from 'src/app/shared/entity/empresa';

import * as $ from 'jquery';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  public empresaIcon!: string;

  private ref!: DynamicDialogRef;

  constructor(public authService: AuthService,
              private empresaService: EmpresaService,
              private dialogService: DialogService,
              private router: Router) { }

  ngOnInit(): void {
    $(document).ready(function () {
      $('#sidebarCollapse').on('click', function () {
        console.log('Problemas');
        $('#sidebar').toggleClass('active');
        $(this).toggleClass('active');
      });
    });

    if (this.empresaService.getEmpresaSeleccionada()) {
      this.empresaIcon = this.empresaService.getEmpresaSeleccionada().codigo;
    } else {
      if (this.empresaService.getEmpresas().length !== 0) {
        this.empresaService.seleccionarEmpresa(this.empresaService.getEmpresas()[0]);

        if (this.empresaService.getEmpresaSeleccionada()) {
          this.empresaIcon = this.empresaService.getEmpresaSeleccionada().codigo;
        }
      }
    }
  }

  seleccionarEmpresa(): void {
    this.ref = this.dialogService.open(SelectorEmpresaComponent, {
      header: 'Selecciona una empresa',
      width: '50%', 
      contentStyle: {"max-height": "500px", "overflow": "auto"},
      baseZIndex: 10000
    });

    this.ref.onClose.subscribe((empresa: Empresa) =>{
        if (empresa) {
            this.empresaIcon = empresa.codigo;
            this.empresaService.seleccionarEmpresa(empresa);
            this.router.navigateByUrl("/home");
        }
    });
  }

  ngOnDestroy() {
    if (this.ref) {
        this.ref.close();
    }
  }

}
