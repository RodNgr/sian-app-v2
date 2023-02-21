import { Component, OnInit } from '@angular/core';

import { NgxSpinnerService } from 'ngx-spinner';

import { AuthService } from '../../../auth/services/auth.service';
import { EmpresaService } from 'src/app/shared/services/empresa.service';
import { InterfazBloqueoService } from '../../services/interfaz-bloqueo.service';
import { TiendaService } from '../../services/tienda.service';

import { DatePipe } from '@angular/common';

import { FiltroDto } from '../../dto/filtro-dto';
import { Tienda } from '../../entity/tienda';
import { Workbook } from 'exceljs';

import swal from 'sweetalert2';

import * as fs from 'file-saver';

@Component({
  selector: 'app-bloqueo-interfaces',
  templateUrl: './bloqueo-interfaces.component.html',
  styleUrls: ['./bloqueo-interfaces.component.css']
})
export class BloqueoInterfacesComponent implements OnInit {

  public tiendaList: Tienda[] = [];

  public tiendasSeleccionadas: Tienda[] = [];

  public rangeDates: Date[] = [];

  public selectedInterfaz: string[] = [];

  public mensajeList: string[] = [];

  private pipe = new DatePipe("en-US");

  constructor(private empresaService: EmpresaService,
    private spinner: NgxSpinnerService,
    private tiendaService: TiendaService,
    private authService: AuthService,
    private interfazBloqueoService: InterfazBloqueoService) { }

  ngOnInit(): void {
    this.rangeDates[0] = new Date();
    this.rangeDates[1] = new Date();

    this.spinner.show();
    this.tiendaService.getTiendas(this.empresaService.getEmpresaSeleccionada().idEmpresa).subscribe(
      tiendaList => {
        this.tiendaList = tiendaList;
        console.log(tiendaList);
        this.spinner.hide();
      },
      _err => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al obtener la información de las tiendas', 'error');
      }
    )
  }

  public bloquear() {
    if (!this.rangeDates[0]) {
      swal.fire('Advertencia!', 'Debe seleccionar la fecha de inicial', 'warning');
      return;
    }

    if (!this.rangeDates[1]) {
      swal.fire('Advertencia!', 'Debe seleccionar la fecha de final', 'warning');
      return;
    }

    if (this.tiendasSeleccionadas.length === 0) {
      swal.fire('Advertencia!', 'Por lo menos debe seleccionar una tienda', 'warning');
      return;
    }

    if (this.selectedInterfaz.length === 0) {
      swal.fire('Advertencia!', 'Por lo menos debe seleccionar una interfaz', 'warning');
      return;
    }

    let filtro: FiltroDto = new FiltroDto();
    filtro.idEmpresa = Number(this.empresaService.getEmpresaSeleccionada().codSap);
    filtro.tiendas = this.tiendasSeleccionadas;
    filtro.fechaInicio = this.pipe.transform(this.rangeDates[0], 'yyyyMMdd') || '';
    filtro.fechaFin = this.pipe.transform(this.rangeDates[1], 'yyyyMMdd') || '';
    filtro.interfaceList = this.selectedInterfaz;
    filtro.usuario = this.authService.usuario.username;

    console.log(filtro);

    this.spinner.show();
    this.interfazBloqueoService.save(filtro).subscribe(
      mensajeList => {
        this.mensajeList = mensajeList;
        this.spinner.hide();
      },
      _err => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al realizar la operación', 'error');
      }
    );
  }

  public exportList() {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Resultado');

    let contador: number = 1
    this.mensajeList.forEach(mensaje => {
       worksheet.addRow([mensaje]);
       contador++;
     })
    
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'resultado.csv');
    });
  }

}
