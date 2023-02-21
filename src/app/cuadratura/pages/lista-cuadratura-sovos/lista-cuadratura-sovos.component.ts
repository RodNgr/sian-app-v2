import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';

import { NgxSpinnerService } from 'ngx-spinner';

import { ComprobanteService } from '../../services/comprobante.service';
import { EmpresaService } from '../../../shared/services/empresa.service';

import { DatePipe } from '@angular/common';

import { Empresa } from '../../../shared/entity/empresa';
import { ComprobanteDto } from '../../entity/comprobante-dto';

import swal from 'sweetalert2';

@Component({
  selector: 'app-lista-cuadratura-sovos',
  templateUrl: './lista-cuadratura-sovos.component.html',
  styleUrls: ['./lista-cuadratura-sovos.component.css']
})
export class ListaCuadraturaSovosComponent implements OnInit, OnDestroy {

  private updateTimer!: Subscription;
  
  public rangeDates: Date[] = [];

  public marcas: Empresa[] = [];

  public marcaSelected!: Empresa;

  public resumenList: ComprobanteDto[] = [];

  private datePipe = new DatePipe("en-US");

  constructor(private empresaService: EmpresaService,
              private comprobanteService: ComprobanteService,
              private spinner: NgxSpinnerService,
              private router: Router) { }

  ngOnInit(): void {
    sessionStorage.removeItem('ruc-sovos');

    this.marcas = this.empresaService.getEmpresas();

    const feInicio = new Date();
    const feFin = new Date();

    this.rangeDates.push(feInicio);
    this.rangeDates.push(feFin);

    this.buscar();
  }

  public buscar(): void {
    if (this.rangeDates[0] === undefined || this.rangeDates[0] === null) {
      swal.fire('Advertencia!', 'Debe ingresar la fecha de inicio', 'warning');
      return;
    }

    if (this.rangeDates[1] === undefined || this.rangeDates[1] === null) {
      swal.fire('Advertencia!', 'Debe ingresar la fecha de fin', 'warning');
      return;
    }

    let fechaIni = this.datePipe.transform(this.rangeDates[0], 'yyyyMMdd') || '';
    let fechaFin = this.datePipe.transform(this.rangeDates[1], 'yyyyMMdd') || '';
    let nuRuc: string = "TODOS";

    if (this.marcaSelected !== undefined) {
      nuRuc = this.marcaSelected.ruc;
    }

    this.spinner.show();
    this.comprobanteService.getResumen(nuRuc, fechaIni, fechaFin).subscribe(
      dto => {
        this.resumenList = dto;
        this.spinner.hide();
      },
      _err => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al obtener el Resumen de Cuadratura SOVOS', 'error');
      }
    )

    let time = 1 * 60 * 1000;

    if (this.updateTimer) {
      this.updateTimer.unsubscribe();
    }

    this.updateTimer = interval(time).subscribe(
        _i => this.refreshData()
    );
  }

  private refreshData() {
    if (this.rangeDates[0] === undefined || this.rangeDates[0] === null) {
      swal.fire('Advertencia!', 'Debe ingresar la fecha de inicio', 'warning');
      return;
    }

    if (this.rangeDates[1] === undefined || this.rangeDates[1] === null) {
      swal.fire('Advertencia!', 'Debe ingresar la fecha de fin', 'warning');
      return;
    }

    let fechaIni = this.datePipe.transform(this.rangeDates[0], 'yyyyMMdd') || '';
    let fechaFin = this.datePipe.transform(this.rangeDates[1], 'yyyyMMdd') || '';
    let nuRuc: string = "TODOS";

    if (this.marcaSelected !== undefined) {
      nuRuc = this.marcaSelected.ruc;
    }

    this.spinner.show();
    this.comprobanteService.getResumen(nuRuc, fechaIni, fechaFin).subscribe(
      dto => {
        this.resumenList = dto;
        this.spinner.hide();
      },
      _err => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al obtener el Resumen de Cuadratura SOVOS', 'error');
      }
    )
  }

  ngOnDestroy(): void {
    this.updateTimer.unsubscribe();
  }

  public showDetalle(ruc: string) {
    sessionStorage.setItem('ruc-sovos', ruc);

    this.router.navigateByUrl('/home/cuadratura/lista-comprobante-sovos');
  }

}
