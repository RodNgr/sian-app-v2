import { Component, HostListener, OnInit } from '@angular/core';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { NgxSpinnerService } from 'ngx-spinner';

import { AplicacionRolService } from '../../services/aplicacion-rol.service';
import { RolService } from '../../services/rol.service';

import { Aplicacion } from '../../entity/aplicacion';
import { AplicacionRol } from '../../entity/aplicacion-rol';
import { Rol } from '../../entity/rol';

import swal from 'sweetalert2';

@Component({
  selector: 'app-asignar-rol-aplicacion',
  templateUrl: './asignar-rol-aplicacion.component.html',
  styleUrls: ['./asignar-rol-aplicacion.component.css']
})
export class AsignarRolAplicacionComponent implements OnInit {

  public aplicacionesRol: AplicacionRol[] = [];

  public aplicacion!: Aplicacion;

  public isMobile: boolean = window.innerWidth < 641;

  public roles: Rol[] = [];

  public rolSeleccionado!: Rol;

  constructor(public ref: DynamicDialogRef, 
              public config: DynamicDialogConfig,
              private aplicacionRolService: AplicacionRolService,
              private rolService: RolService,
              private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.aplicacion = this.config.data;

    this.spinner.show();

    this.aplicacionRolService.getRolesPorAplicacion(this.aplicacion.id).subscribe(
      aplicacionRolList=> {
        this.aplicacionesRol = aplicacionRolList;

        this.rolService.getAllRoles().subscribe(
          rolList => {
            this.roles = rolList;
          }
        )

        this.spinner.hide();
      },
      _err => {
        this.spinner.hide();
        swal.fire({title:'Error', html: 'Problemas al obtener la información de los roles', icon: 'error', target: 'dt', backdrop: 'false'});
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

  public agregar(): void {
    if (this.rolSeleccionado == null) {
      return;
    } else {
      let appRol = new AplicacionRol();
      appRol.application = this.aplicacion;
      appRol.rol = this.rolSeleccionado;
      let existe: boolean = false;

      for (let entry of this.aplicacionesRol) {
        if (entry.rol.id === this.rolSeleccionado.id) {
          existe = true;
          break;
        }
      }

      if (!existe) {
        this.spinner.show();
        this.aplicacionRolService.create(appRol).subscribe(
          response => {
            this.aplicacionesRol.push(response.applicationRol);
            this.spinner.hide();
          },
          _err=> {
            swal.fire({title:'Error', html: 'Problemas al agregar el rol a la aplicación', icon: 'error', target: 'dt', backdrop: 'false'});
            this.spinner.hide();
          }
        );
      }
    }
  }

  public delete(aplicacionRol: AplicacionRol) {
    swal.fire({
      title: '¿Estás seguro?',
      text: `¿Seguro de eliminar este rol de la aplicación?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.spinner.show();
        this.aplicacionRolService.delete(aplicacionRol.id).subscribe(
          _appRol => {
            this.spinner.hide();
            this.aplicacionesRol = this.aplicacionesRol.filter(a => {
              return a.id !== aplicacionRol.id;
            });
          },
          _err => {
            this.spinner.hide();
            swal.fire({title:'Error', html: 'Problemas al eliminar el rol de la aplicación', icon: 'error', target: 'dt', backdrop: 'false'});
          }
        );
      } 
    })
  }

}
