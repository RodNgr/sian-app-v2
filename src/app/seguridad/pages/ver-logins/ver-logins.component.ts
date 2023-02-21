import { Component, HostListener, OnInit } from '@angular/core';

import { FilterService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';

import { AplicacionService } from '../../services/aplicacion.service';
import { LoginFallidoService } from '../../services/login-fallido.service';


import { Aplicacion } from '../../entity/aplicacion';
import { LoginFallido } from '../../entity/login-fallido';
import { Table } from 'primeng/table';
import { Tipo } from '../../entity/tipo';

import swal from 'sweetalert2';

@Component({
  selector: 'app-ver-logins',
  templateUrl: './ver-logins.component.html',
  styleUrls: ['./ver-logins.component.css']
})
export class VerLoginsComponent implements OnInit {

  public loginFallidoList: LoginFallido[] = [];

  public tipoList: Tipo[] =
            [{"codigo": "0", "descripcion": "Login exitoso"},
             {"codigo": "1", "descripcion": "Usuario no existe"},
             {"codigo": "2", "descripcion": "Usuario no asignado a la aplicación"},
             {"codigo": "3", "descripcion": "Usuario inactivo"},
             {"codigo": "4", "descripcion": "Clave inválida"},
             {"codigo": "9", "descripcion": "IP Bloqueada temporalmente"}];
  public aplicacionList: Aplicacion[] = [];

  public cantidadMap = {
    '=0': 'No se encontró ninguna coincidencia',
    '=1': 'En total hay 1 coincidencia',
    'other': 'En total hay # coincidencias'
  }

  public isMobile: boolean = window.innerWidth < 641;
  
  constructor(private spinner: NgxSpinnerService,
              private loginFallidoService: LoginFallidoService,
              private aplicacionService: AplicacionService,
              private filterService: FilterService) { }

  ngOnInit(): void {
    this.spinner.show();
    this.loginFallidoService.getLoginFallidos().subscribe(
      loginFallidoList => {
        console.log(loginFallidoList);
        this.loginFallidoList = loginFallidoList;

        this.aplicacionService.getAllAplicaciones().subscribe(
            aplicaciones => {
                this.aplicacionList = aplicaciones;
            }
        );
        this.spinner.hide();
      },
      _err => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al obtener la información de los inicios de sesión', 'error');
      }
    );

    this.filterService.register('afterDate',  
      (value: Date, filter: Date): boolean => {
        
        console.log(filter);
        if (filter === undefined || filter === null ) {
          return true;
        }

        if (value === undefined || value === null) {
          return false;
        }

        console.log((new Date(value)) >= filter);
        return (new Date(value)) >= filter;
      }
    );
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: any) {
      this.isMobile = window.innerWidth < 641;
  }

  clear(table: Table) {
    table.clear();
  }

  exportList() {
    
  }

  filterApplication(event: any, dt: Table) {
    if (event.value === undefined || event.value === null) {
      dt.filter(null, 'applicationId', 'equals');
    } else {
      dt.filter(event.value.id, 'applicationId', 'equals');
    }
  }

  filterType(event: any, dt: Table) {
    if (event.value === undefined || event.value === null) {
      dt.filter(null, 'type', 'equals');
    } else {
      dt.filter(event.value.codigo, 'type', 'equals');
    }
  }

  changeFecha(event: any, dt: Table) {
    if (event) {
      dt.filter(event, 'date', 'afterDate');
    } else {
      dt.filter(null, 'date', 'afterDate');
    }
  }

  clearFecha(dt: Table) {
    dt.filter(null, 'date', 'afterDate');
  }

}
