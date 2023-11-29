import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Table } from 'primeng/table';
import swal from 'sweetalert2';

import { CuponesOmnicanalService } from 'src/app/shared/services/cupon-omnicanal.service';
import { CrearTiendaDescuento } from './entities/CrearTiendaDescuento';
import { CommonReporteService } from 'src/app/shared/services/tienda.service';
import { EmpresaService } from 'src/app/shared/services/empresa.service';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-lista-tiendas-descuento',
  templateUrl: './lista-tiendas-descuento.component.html',
  styleUrls: ['./lista-tiendas-descuento.component.css'],
})
export class ListaTiendasBeneficioComponent implements OnInit {
  @ViewChild('dt') table!: Table;

  public tiendaBeneficioLista = [];
  public tiendasList = [];

  display: boolean = false;

  public tiendaForm: FormGroup;

  public cantidadMap = {
    '=0': 'No existen tiendas',
    '=1': 'En total hay 1 tienda',
    other: 'En total hay # tiendas',
  };

  public isMobile: boolean = window.innerWidth < 641;
  storeSelected;

  constructor(
    private spinner: NgxSpinnerService,
    private cuponOmnicanalService: CuponesOmnicanalService,
    private _formBuilder: FormBuilder,
    private tiendaService: CommonReporteService,
    private empresaService: EmpresaService,
    private authService: AuthService,
    private router: Router
  ) {
    this.tiendaForm = this._formBuilder.group({
      codTienda: new FormControl({ value: 0, disabled: false }, [
        Validators.required,
      ]),
    });
    this.tiendaService
      .getTiendasPorEmpresa(
        this.empresaService.getEmpresaSeleccionada().idEmpresa,
        this.authService.getUsuarioInterface()
      )
      .subscribe({
        next: (data) => {
          this.tiendasList = data;
        },
        error: () => {
          this.spinner.hide();
          swal.fire(
            'Error',
            'Problemas al obtener la información de las tiendas',
            'error'
          );
        }
      });
  }

  ngOnInit(): void {
    this.list();
  }

  public applyFilterGlobal($event: any, stringVal: any) {
    this.table.filterGlobal(
      ($event.target as HTMLInputElement).value,
      'contains'
    );
  }

  private list(): void {
    this.spinner.show();
    this.cuponOmnicanalService.listarTiendas().subscribe({
      next: (data) => {
        data.subscribe({
          next: (list) => {
            this.tiendaBeneficioLista = list;
            this.spinner.hide();
          },
        });
      },
      error: () => {
        this.spinner.hide();
        swal.fire(
          'Error',
          'Problemas al obtener la información de los feriados',
          'error'
        );
      },
    });
  }

  public add() {
    this.display = true;
  }

  async save() {
    const payload = {
      ...this.tiendaForm.value,
      // centroCosto: this.storeSelected.,
      // codTienda: this.storeSelected.,
      // storeName: this.storeSelected.,
      canUseDiscount: true,
    };

    if (!CrearTiendaDescuento.validate(payload)) {
      swal.fire('Informacion', 'Debe completar los datos', 'warning');
      return;
    }

    try {
      await this.cuponOmnicanalService.createHolidays(
        CrearTiendaDescuento.format(payload)
      );
      swal.fire(
        'Feriado creado!',
        `Feriado creado ${payload.dia}-${payload.mes}`,
        'success'
      );
      this.tiendaForm.reset();
      this.list();
    } catch (error) {
      swal.fire('Error', 'Error al crear feriado.', 'error');
      this.tiendaForm.reset();
    }
  }

  public edit() {
    if (!this.storeSelected) {
      swal.fire('Alerta!', 'Debe seleccionar un feriado', 'warning');
      return;
    }

    this.tiendaForm.get('dia').setValue(this.storeSelected.dia);

    this.tiendaForm.get('mes').setValue(this.storeSelected.mes);

    this.tiendaForm.get('descripcion').setValue(this.storeSelected.descripcion);

    this.display = true;
  }

  cancelar() {
    this.tiendaForm.reset();
    this.display = false;
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: any) {
    this.isMobile = window.innerWidth < 641;
  }

  get dia() {
    return this.tiendaForm.get('dia');
  }

  get mes() {
    return this.tiendaForm.get('mes');
  }

  get descripcion() {
    return this.tiendaForm.get('descripcion');
  }
}
