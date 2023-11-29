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
import { DatePipe } from '@angular/common';
import { EmpresaService } from 'src/app/shared/services/empresa.service';
import { CrearBeneficio } from './entities/CrearBeneficio';
import { CommonDescuentoCargoService } from 'src/app/shared/services/cargo.service';

@Component({
  selector: 'app-lista-beneficio-empleado',
  templateUrl: './lista-beneficio-empleado.component.html',
  styleUrls: ['./lista-beneficio-empleado.component.css'],
})
export class ListaBeneficioEmpleadoComponent implements OnInit {
  @ViewChild('dt') table!: Table;

  public beneficioSelected;
  public beneficioEmpleadoLista = [];

  public cantidadMap = {
    '=0': 'No existen beneficios',
    '=1': 'En total hay 1 beneficio',
    other: 'En total hay # beneficios',
  };

  public isMobile: boolean = window.innerWidth < 641;

  public beneficioForm: FormGroup;

  public cargoList = [];

  public cargoSeleccionado;

  codeEmpresas = {
    2: 'BB',
    3: 'DB',
    4: 'POP',
    5: 'CHNWK',
    6: 'BB',
    7: 'PAPJ',
    8: 'DD',
  };
  canalesList = [
    { code: '0', label: 'Salón' },
    { code: '1', label: 'Web' },
    { code: '2', label: 'Call Center' },
    { code: '3', label: 'Carta Salon' },
  ];

  display: boolean = false;

  private pipe = new DatePipe('en-US');

  constructor(
    private spinner: NgxSpinnerService,
    private cuponOmnicanalService: CuponesOmnicanalService,
    private _formBuilder: FormBuilder,
    private empresaService: EmpresaService,
    private cargoService: CommonDescuentoCargoService,
    private router: Router
  ) {
    this.cargoService.getDescuentosCargo().subscribe({
      next: (data) => {
        this.cargoList = data;
      },
    });
    this.beneficioForm = this._formBuilder.group({
      codCargo: new FormControl({ value: '', disabled: false }, [
        Validators.required,
      ]),
      codMarca: new FormControl({ value: '', disabled: false }, [
        Validators.required,
      ]),
      canal: new FormControl('', [Validators.required]),
      tipoDescuento: new FormControl('1', []),
      porcentaje: new FormControl('', [Validators.required]),
      descuentoMaximo: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.list();
    this.beneficioForm
      .get('codMarca')
      .setValue(this.empresaService.getEmpresaSeleccionada().idEmpresa);
  }

  public applyFilterGlobal($event: any, stringVal: any) {
    this.table.filterGlobal(
      ($event.target as HTMLInputElement).value,
      'contains'
    );
  }

  private list(): void {
    this.spinner.show();
    this.cuponOmnicanalService.listarBeneficios().subscribe({
      next: (data) => {
        data.subscribe({
          next: (lista) => {
            this.beneficioEmpleadoLista = lista.map((l) => ({
              ...l,
              uniqueKey: `${l.codMarca}#${l.sk}`,
            }));
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
    const codMarca = this.beneficioForm.get('codMarca').value;
    const payload = {
      ...this.beneficioForm.value,
      tipoDescuento: '1',
      codCargo: this.cargoSeleccionado?.coPuesto,
      codMarca: `${codMarca}`,
    };

    if (!CrearBeneficio.validate(payload)) {
      swal.fire('Informacion', 'Debe completar los datos', 'warning');
      return;
    }

    try {
      await this.cuponOmnicanalService.createBenefit(
        CrearBeneficio.format(payload)
      );
      swal.fire(
        '¡Beneficio creado!',
        `Beneficio creado para el cargo ${this.cargoSeleccionado?.dePuesto}`,
        'success'
      );
      this.beneficioForm.reset();
      this.list();
    } catch (error) {
      swal.fire('Error', 'Error al crear beneficio.', 'error');
      this.beneficioForm.reset();
    }
  }

  public edit() {
    if (!this.beneficioSelected) {
      swal.fire('Alerta!', 'Debe seleccionar un beneficio', 'warning');
      return;
    }

    this.cargoSeleccionado = this.cargoList.find(
      (c) => c.coPuesto === this.beneficioSelected?.sk?.split('#')[1]
    );

    this.beneficioForm
      .get('canal')
      .setValue(this.beneficioSelected.sk.split('#')[0]);

    this.beneficioForm
      .get('codMarca')
      .setValue(this.beneficioSelected.codMarca);

    this.beneficioForm
      .get('descuentoMaximo')
      .setValue(this.beneficioSelected.descuentoMaximo);

    this.beneficioForm
      .get('porcentaje')
      .setValue(this.beneficioSelected.porcentaje);

    this.beneficioForm
      .get('tipoDescuento')
      .setValue(this.beneficioSelected.tipoDescuento);

    this.beneficioForm
      .get('codCargo')
      .setValue(this.cargoSeleccionado?.coPuesto);

    this.display = true;
  }

  cancelar() {
    this.beneficioForm.reset();
    this.display = false;
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: any) {
    this.isMobile = window.innerWidth < 641;
  }

  get codCargo() {
    return this.beneficioForm.get('codCargo');
  }

  get codMarca() {
    return this.beneficioForm.get('codMarca');
  }

  get canal() {
    return this.beneficioForm.get('canal');
  }

  get tipoDescuento() {
    return this.beneficioForm.get('tipoDescuento');
  }

  get porcentaje() {
    return this.beneficioForm.get('porcentaje');
  }

  get descuentoMaximo() {
    return this.beneficioForm.get('descuentoMaximo');
  }
}
