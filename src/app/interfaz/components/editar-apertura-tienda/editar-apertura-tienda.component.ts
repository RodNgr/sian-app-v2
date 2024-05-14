import { Component, OnInit, Input } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InterfazAperturaService } from '../../services/interfaz-apertura.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { tiendaSeleccionada } from '../../entity/tiendaSeleccionada';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IKeysResponse } from '../apertura-tienda/entity/keys';
import { EmpresaService } from 'src/app/shared/services/empresa.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-editar-apertura-tienda',
  templateUrl: './editar-apertura-tienda.component.html',
  styleUrls: ['./editar-apertura-tienda.component.css'],
})
export class EditarAperturaTiendaComponent implements OnInit {
  @Input() valores;

  public aperturaForm: FormGroup;
  public keys: {
    [x: string]: IKeysResponse;
  } = {};
  public codeEmpresas = {
    2: 'BB',
    3: 'DB',
    4: 'POP',
    5: 'CHNWK',
    6: 'BB',
    7: 'PAPJ',
    8: 'DD',
  };

  private pipe = new DatePipe('en-EN');

  public tiendasByMarcaList = [];
  public formatosList = [];
  public marcasList = [];

  public mvFormatoSelected = '';
  public codigoBaseSelected = 0;
  public tiendaPixelSelected = 0;

  private tiendaSeleccionada1: tiendaSeleccionada;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private aperturaService: InterfazAperturaService,
    private empresaService: EmpresaService,
    private router: Router,
    private _formBuilder: FormBuilder,
  ) {
    this.aperturaForm = this._formBuilder.group({
      idEmpresa: new FormControl({ value: '', disabled: true }, []),
      MVFormato: new FormControl('', []),
      tiendaSap: new FormControl({ value: '', disabled: true }, [
        Validators.required,
        Validators.pattern(/^T\d{4}$/)
      ]),
      tiendaPixel: new FormControl({ value: '', disabled: true }, []),
      ip: new FormControl('', [
        Validators.pattern(new RegExp(/\..*\..*\..*/i)),
      ]),
      codigoBase: new FormControl({ value: '', disabled: true }, [
        Validators.required,
        Validators.maxLength(6)
      ]),
      centroBeneficio: new FormControl('', [Validators.maxLength(9)]),
      nombreTienda: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
      ]),
      fechaInicioOpera: new FormControl('', []),
      emailTienda: new FormControl('', [Validators.required, Validators.email]),
      inmuebleRP: new FormControl(),
      localRP: new FormControl(),
      // Proceso Automatico
      tipoPA: new FormControl(),
      // Urbanova
      idStore: new FormControl(),
      dePrefijo: new FormControl(),
      // Jockey
      idMall: new FormControl(),
      nuStore: new FormControl(),
    });
    this.aperturaService.getKeys().subscribe({
      next: (data) => {
        this.keys = this.formatKeys(data) || {};
      },
      error: () => {
        Swal.fire('Error', 'Error al cargar los labels', 'error');
      },
    });
    this.aperturaForm.get('idEmpresa').setValue(
      this.empresaService.getEmpresaSeleccionada().idEmpresa
    );
  }

  ngOnInit(): void {
    this.listaDatos(this.config.data.tiendaSAP);
    this.listTiendasFormatos(this.empresaService.getEmpresaSeleccionada().idEmpresa);
  }

  private listaDatos(tiendaSAP: number): void {
    this.aperturaService.getTiendaporCodigoSAP(tiendaSAP).subscribe({
      next: (data) => {
        const _tienda = data.tienda[0];
        const _proceso = data.proceso[0];
        this.mvFormatoSelected = _tienda.mvformato;
        this.codigoBaseSelected = _tienda.tienda;
        this.tiendaPixelSelected = _tienda.tiendaPixel;
        this.aperturaForm.get('idEmpresa').setValue(_tienda.idEmpresa || 0);
        this.aperturaForm.get('MVFormato').setValue(
          { id: this.mvFormatoSelected, formato: this.mvFormatoSelected } || '');
        this.aperturaForm.get('tiendaSap').setValue(_proceso.cliente_sap || '');
        this.aperturaForm.get('tiendaPixel').setValue(_tienda.tiendaPixel || '');
        this.aperturaForm.get('ip').setValue(_tienda.iptienda || '');
        this.aperturaForm.get('codigoBase').setValue(_tienda.tienda || 0);
        this.aperturaForm.get('centroBeneficio').setValue(_tienda.centroBeneficio || '');
        this.aperturaForm.get('nombreTienda').setValue(_tienda.nombreTienda || '');
        this.aperturaForm.get('fechaInicioOpera').setValue(_tienda.fechaInicio || '');
        this.aperturaForm.get('emailTienda').setValue(_tienda.email || '');
        this.aperturaForm.get('inmuebleRP').setValue(_tienda.codigoInmuebleRP || '');
        this.aperturaForm.get('localRP').setValue(_tienda.codigoLocalRP || 0);
        this.aperturaForm.get('tipoPA').setValue(String(_proceso.id_tipo_proceso || 0));
        this.aperturaForm.get('idStore').setValue(_proceso.id_store || 0);
        this.aperturaForm.get('dePrefijo').setValue(_proceso.de_prefijo || '');
        this.aperturaForm.get('idMall').setValue(_proceso.id_mall || 0);
        this.aperturaForm.get('nuStore').setValue(_proceso.nu_store || '');
      },
      error: () => {
        Swal.fire(
          'Error',
          'Problemas al listar los datos de la tienda',
          'error'
        );
      },
    });
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
    this.aperturaService.getFormatoTienda(idEmpresa).subscribe({
      next: (data) => {
        const list = data
          .filter((d) => !!d)
          .map((d) => ({ id: d, formato: d }));
        this.formatosList = list;
        this.aperturaForm.get('MVFormato').setValue(
          { id: this.mvFormatoSelected, formato: this.mvFormatoSelected } || '');
      },
    });
  }

  public editar() {  
    const idEmpresa = this.aperturaForm.get('idEmpresa').value;
    const fechaInicioOpera = this.aperturaForm.get('fechaInicioOpera').value;
    const date = fechaInicioOpera.indexOf("/") > 0 
      ? this.convert(fechaInicioOpera) : this.pipe.transform(fechaInicioOpera, 'MM/dd/yyyy') || '';
    this.tiendaSeleccionada1 = {
      ...this.aperturaForm.value,
      tipoProceso: this.tipoPA.value || '',
      codeEmpresa: this.codeEmpresas[idEmpresa],
      empresaSAP: this.marcasList.find((m) => m.idEmpresa === idEmpresa)
        ?.empresaSAP,
      fechaInicioOpera: date,
      idEmpresa,
      mvFormato: this.aperturaForm.get('MVFormato').value,
      codigoBase: this.codigoBaseSelected,
      tiendaSAP: this.config.data.tiendaSAP,
      tiendaPixel: this.tiendaPixelSelected,
    }

    this.aperturaService.edit(this.tiendaSeleccionada1).subscribe({
      next: (data) => {
        Swal.fire({
          title: '¡Tienda actualizada!',          
          confirmButtonText: 'Aceptar',
        }).then((result) => {
          if (result.isConfirmed) {
            this.ref.close(1);
          }
        });
      },
      error: () => {
        Swal.fire({
          title: 'Error al actualizar la tienda',
          confirmButtonText: 'Aceptar',
        }).then((result) => {
          if (result.isConfirmed) {
            this.ref.close(1);            
          }
        });
      },
    });
  }

  public cancelar() {
    this.ref.close();
  }

  convert(date: string = '') {
    const [dia, mes , ano] = date.split('/');
    return `${mes}/${dia}/${ano}`;
  }

  formatKeys(data: IKeysResponse[]) {
    return data.reduce((acc, cur) => {
      acc[cur.label_key] = cur;
      return acc;
    }, {});
  }

  validateTiendaSapInput(event: KeyboardEvent) {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;

    // Permitir backspace, tab, end, home, left arrow, right arrow
    if ([8, 9, 27, 13, 37, 39].indexOf(event.keyCode) !== -1 ||
        // Permitir: Ctrl+A
        (event.keyCode === 65 && (event.ctrlKey || event.metaKey)) ||
        // Permitir: Ctrl+C
        (event.keyCode === 67 && (event.ctrlKey || event.metaKey)) ||
        // Permitir: Ctrl+V
        (event.keyCode === 86 && (event.ctrlKey || event.metaKey)) ||
        // Permitir: Ctrl+X
        (event.keyCode === 88 && (event.ctrlKey || event.metaKey))) {
        // let it happen, don't do anything
        return;
    }

    // Asegurar que es un dígito o la letra 't' si es el primer carácter y está vacío
    if (value.length === 0 && event.key === 'T' || value.length === 0 && event.key === 't' || value.length > 0 && event.key.match(/\d/)) {
      if (value.length >= 5) {  // No permitir más de 5 caracteres
        event.preventDefault();
      }
    } else {
      // Si no, prevenir la escritura del carácter
      event.preventDefault();
    }
  }

  validateNumericInput(event: KeyboardEvent) {
    // Permitir teclas de control especiales como backspace, tab, end, home, left arrow, right arrow
    if (event.key === 'Backspace' || event.key === 'Tab' || event.key === 'End' || event.key === 'Home' || event.key === 'ArrowLeft' || event.key === 'ArrowRight' ||
        // Permitir: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
        (['a', 'c', 'v', 'x'].includes(event.key) && (event.ctrlKey || event.metaKey))) {
        return; // Deja que estas teclas funcionen normalmente
    }
  
    // Validar que solo se ingresen números
    if (!event.key.match(/^[0-9]$/)) {
      event.preventDefault(); // Previene el ingreso de no-numéricos
    }
  }

  onTiendaSapInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    let value = inputElement.value;

    // Comprobar si el primer carácter es 't' y convertirlo a 'T'
    if (value.length > 0 && value[0] === 't') {
      value = 'T' + value.slice(1);
      inputElement.value = value; // Asignar el valor convertido al campo de entrada
    }

    // Si se desea, aquí también se podrían eliminar caracteres no válidos después de la 'T'
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

  get inmuebleRP() {
    return this.aperturaForm.get('inmuebleRP');
  }

  get localRP() {
    return this.aperturaForm.get('localRP');
  }

  get tipoPA() {
    return this.aperturaForm.get('tipoPA');
  }

  get idStore() {
    return this.aperturaForm.get('idStore');
  }

  get dePrefijo() {
    return this.aperturaForm.get('dePrefijo');
  }

  get prefijo() {
    return this.aperturaForm.get('prefijo');
  }

  get idMall() {
    return this.aperturaForm.get('idMall');
  }

  get nuStore() {
    return this.aperturaForm.get('nuStore');
  }

}
