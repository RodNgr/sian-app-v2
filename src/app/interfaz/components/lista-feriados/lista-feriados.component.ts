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
import { CrearFeriado } from './entities/CrearFeriado';

@Component({
  selector: 'app-lista-feriados',
  templateUrl: './lista-feriados.component.html',
  styleUrls: ['./lista-feriados.component.css'],
})
export class ListaFeriadosComponent implements OnInit {
  @ViewChild('dt') table!: Table;

  public feriadosLista = [];

  display: boolean = false;

  public feriadoForm: FormGroup;

  public cantidadMap = {
    '=0': 'No existen feriados',
    '=1': 'En total hay 1 feriado',
    other: 'En total hay # feriados',
  };

  public isMobile: boolean = window.innerWidth < 641;

  feriadoSelected;

  constructor(
    private spinner: NgxSpinnerService,
    private cuponOmnicanalService: CuponesOmnicanalService,
    private _formBuilder: FormBuilder,
    private router: Router,
  ) {
    this.feriadoForm = this._formBuilder.group({
      dia: new FormControl({ value: 0, disabled: false }, [
        Validators.required,
      ]),
      mes: new FormControl({ value: 0, disabled: false }, [
        Validators.required,
      ]),
      descripcion: new FormControl('', [Validators.required]),
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
    this.cuponOmnicanalService.listarFeriados().subscribe({
      next: (data) => {
        data.subscribe({
          next: (list) => {
            this.feriadosLista = list.map(l => ({ ...l, uniqueKey: `${l.dia}-${l.mes}` }));
            this.spinner.hide();
          },
          error: () => {
            this.spinner.hide();
            swal.fire(
              'Error',
              'Problemas al obtener la información de los feriados',
              'error'
            );
          }
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
      ...this.feriadoForm.value,
    };

    if (!CrearFeriado.validate(payload)) {
      swal.fire('Informacion', 'Debe completar los datos', 'warning');
      return;
    }

    try {
      await this.cuponOmnicanalService.createHolidays(
        CrearFeriado.format(payload)
      );
      swal.fire(
        'Feriado creado!',
        `Feriado creado ${payload.dia}-${payload.mes}`,
        'success'
      );
      this.feriadoForm.reset();
      this.list();
    } catch (error) {
      swal.fire('Error', 'Error al crear feriado.', 'error');
      this.feriadoForm.reset();
    }
  }

  public edit() {
    if (!this.feriadoSelected) {
      swal.fire('Alerta!', 'Debe seleccionar un feriado', 'warning');
      return;
    }

    this.feriadoForm.get('dia').setValue(this.feriadoSelected.dia);

    this.feriadoForm.get('mes').setValue(this.feriadoSelected.mes);

    this.feriadoForm
      .get('descripcion')
      .setValue(this.feriadoSelected.descripcion);

    this.display = true;
  }

  async remove() {

  }

  cancelar() {
    this.feriadoForm.reset();
    this.display = false;
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: any) {
    this.isMobile = window.innerWidth < 641;
  }

  get dia() {
    return this.feriadoForm.get('dia');
  }

  get mes() {
    return this.feriadoForm.get('mes');
  }

  get descripcion() {
    return this.feriadoForm.get('descripcion');
  }
}
