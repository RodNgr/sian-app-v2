import { Component, HostListener, OnInit } from '@angular/core';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { NgxSpinnerService } from 'ngx-spinner';

import { AplicacionRolService } from '../../services/aplicacion-rol.service';

import { AplicacionRol } from '../../entity/aplicacion-rol';
import { Rol } from '../../entity/rol';

import swal from 'sweetalert2';

@Component({
  selector: 'app-ver-aplicacion-rol',
  templateUrl: './ver-aplicacion-rol.component.html',
  styleUrls: ['./ver-aplicacion-rol.component.css']
})
export class VerAplicacionRolComponent implements OnInit {

  public aplicacionesRol: AplicacionRol[] = [];

  public rol!: Rol;

  public isMobile: boolean = window.innerWidth < 641;

  constructor(public ref: DynamicDialogRef, 
              public config: DynamicDialogConfig,
              private aplicacionRolService: AplicacionRolService,
              private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.rol = this.config.data;

    this.spinner.show();

    this.aplicacionRolService.getAplicacionesPorRol(this.rol.id).subscribe(
      aplicacionRolList=> {
        this.aplicacionesRol = aplicacionRolList;
        this.spinner.hide();
      },
      _err => {
        this.spinner.hide();
        swal.fire({title:'Error', html: 'Problemas al obtener la información de las aplicaciones', icon: 'error', target: 'dt', backdrop: 'false'});
      }
    );
  }

  public cerrar() {
    this.ref.close();
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: any) {
      this.isMobile = window.innerWidth < 641;
  }

}
