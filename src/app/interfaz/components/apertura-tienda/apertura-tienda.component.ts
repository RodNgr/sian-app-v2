import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import swal from 'sweetalert2';
import { CrearApertura } from './entity/crear-apertura';
import { InterfazAperturaService } from '../../services/interfaz-apertura.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { EmpresaService } from 'src/app/shared/services/empresa.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { IKeysResponse } from './entity/keys';

@Component({
  selector: 'app-apertura-tienda',
  templateUrl: './apertura-tienda.component.html',
  styleUrls: ['./apertura-tienda.component.css'],
})
export class AperturaTiendaComponent implements OnInit {
  public title: string = 'Apertura de tienda';
  public aperturaForm: FormGroup;

  public tiendasByMarcaList = [];
  public formatosList = [];
  public marcasList = [];
  public tiendaPadreSeleccionada;
  public keys: {
    [x: string]: IKeysResponse;
  } = {};

  codeEmpresas = {
    2: 'BB',
    3: 'DB',
    4: 'POP',
    5: 'CHNWK',
    6: 'BB',
    7: 'PAPJ',
    8: 'DD',
  };

  private pipe = new DatePipe('en-US');

  constructor(
    private spinner: NgxSpinnerService,
    private router: Router,
    private empresaService: EmpresaService,
    private aperturaService: InterfazAperturaService,
    private _formBuilder: FormBuilder
  ) {
    this.aperturaService.getEmpresas().subscribe({
      next: (data) => {
        this.marcasList = data;
      },
    });
    this.aperturaForm = this._formBuilder.group({
      idEmpresa: new FormControl({ value: '', disabled: true }, []),
      MVFormato: new FormControl('', []),
      tiendaSap: new FormControl('', [Validators.maxLength(5)]),
      tiendaPixel: new FormControl('', []),
      ip: new FormControl('', [
        Validators.pattern(new RegExp(/\..*\..*\..*/i)),
      ]),
      codigoBase: new FormControl('', []),
      centroBeneficio: new FormControl('', [Validators.maxLength(10)]),
      nombreTienda: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
      ]),
      fechaInicioOpera: new FormControl('', []),
      emailTienda: new FormControl('', [Validators.required, Validators.email]),
    });
    this.aperturaService.getKeys().subscribe({
      next: (data) => {
        this.keys = this.formatKeys(data) || {};
      },
      error: () => {
        swal.fire('Error', 'Error al cargar los labels', 'error');
      },
    });
  }

  ngOnInit(): void {
    this.spinner.hide();
    this.aperturaForm
      .get('idEmpresa')
      .setValue(this.empresaService.getEmpresaSeleccionada().idEmpresa);
    this.listTiendasFormatos(this.idEmpresa.value);
  }

  save() {
    const idEmpresa = this.aperturaForm.get('idEmpresa').value;
    const fechaInicioOpera = this.aperturaForm.get('fechaInicioOpera').value;
    const date = this.pipe.transform(fechaInicioOpera, 'dd/MM/yyyy') || '';
    const payload = {
      ...this.aperturaForm.value,
      codeEmpresa: this.codeEmpresas[idEmpresa],
      empresaSAP: this.marcasList.find((m) => m.idEmpresa === idEmpresa)
        ?.empresaSAP,
      fechaInicioOpera: date,
      tiendaSapPadre: this.tiendaPadreSeleccionada?.clienteSAP,
      idEmpresa,
    };

    if (!CrearApertura.validate(payload)) {
      swal.fire('Informacion', 'Debe completar los datos', 'warning');
    }
    this.aperturaService.create(CrearApertura.format(payload)).subscribe({
      next: (data) => {
        swal.fire(
          '¡Tienda creada!',
          `El usuario de interfaz es: ${data.usuarioInterface}, el usuario sian se vera reflejado el dia de mañana`,
          'success'
        );
        this.aperturaForm.reset();
      },
      error: () => {
        swal.fire('Error', 'Error al crear apertura de tienda.', 'error');
      },
    });
  }

  cancelar() {
    this.router.navigateByUrl('/home/interfaz/lista-apertura-tienda');
  }

  handleEmpresaChange(event) {
    this.aperturaService.getTiendasByEmpresa(event.value).subscribe({
      next: (data) => {
        this.tiendasByMarcaList = data;
      },
    });
    this.aperturaService.getFormatoTienda(event.value).subscribe({
      next: (data) => {
        const list = data
          .filter((d) => !!d)
          .map((d) => ({ id: d, formato: d }));
        this.formatosList = list;
      },
    });
  }

  listTiendasFormatos(idEmpresa: number) {
    this.aperturaService.getTiendasByEmpresa(idEmpresa).subscribe({
      next: (data) => {
        this.tiendasByMarcaList = data;
      },
    });
    this.aperturaService.getFormatoTienda(idEmpresa).subscribe({
      next: (data) => {
        const list = data
          .filter((d) => !!d)
          .map((d) => ({ id: d, formato: d }));
        this.formatosList = list;
      },
    });
  }

  formatKeys(data: IKeysResponse[]) {
    return data.reduce((acc, cur) => {
      acc[cur.label_key] = cur;
      return acc;
    }, {});
  }

  get idEmpresa() {
    return this.aperturaForm.get('idEmpresa');
  }

  get MVFormato() {
    return this.aperturaForm.get('MVFormato');
  }

  get tiendaSap() {
    return this.aperturaForm.get('tiendaSap');
  }

  get tiendaPixel() {
    return this.aperturaForm.get('tiendaPixel');
  }

  get ip() {
    return this.aperturaForm.get('ip');
  }

  get codigoBase() {
    return this.aperturaForm.get('codigoBase');
  }

  get centroBeneficio() {
    return this.aperturaForm.get('centroBeneficio');
  }

  get nombreTienda() {
    return this.aperturaForm.get('nombreTienda');
  }

  get fechaInicioOpera() {
    return this.aperturaForm.get('fechaInicioOpera');
  }

  get emailTienda() {
    return this.aperturaForm.get('emailTienda');
  }
}
