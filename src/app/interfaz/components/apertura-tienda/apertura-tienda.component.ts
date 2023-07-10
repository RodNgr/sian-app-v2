import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import swal from 'sweetalert2';
import { CrearApertura } from './entity/crear-apertura';
import { TiendaService } from '../../services/tienda.service';
import { InterfazAperturaService } from '../../services/interfaz-apertura.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

interface ICombo {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-apertura-tienda',
  templateUrl: './apertura-tienda.component.html',
  styleUrls: ['./apertura-tienda.component.css'],
})
export class AperturaTiendaComponent implements OnInit {
  public title: string = 'Apertura de tienda';
  public apertura: CrearApertura;

  tiendasByMarcaList = [];
  formatosList = [];
  marcasList = [];

  codeEmpresas = {
    2: 'BB',
    3: 'DB',
    4: 'POP',
    5: 'CHNWK',
    6: 'BB',
    7: 'PAPJ',
    8: 'DD'
  };

  private pipe = new DatePipe("en-US");
  marcaSeleccionada: ICombo;
  tiendaPadreSeleccionada;

  constructor(
    private spinner: NgxSpinnerService,
    private router: Router,
    private tiendaService: TiendaService,
    private aperturaService: InterfazAperturaService,
  ) {
    this.apertura = new CrearApertura();
    this.aperturaService.getEmpresas().subscribe({
      next: (data) => {
        this.marcasList = data;
      }
    });
  }

  ngOnInit(): void {
    this.spinner.hide();
  }

  save() {
    const date = this.pipe.transform(this.apertura.fechaInicioOpera, "dd/MM/yyyy") || '';
    const payload = { 
      ...this.apertura, 
      codeEmpresa: this.codeEmpresas[this.apertura.idEmpresa],
      empresaSAP: this.marcasList.find(m => m.idEmpresa === this.apertura.idEmpresa)?.empresaSAP,
      fechaInicioOpera: date,
      tiendaSapPadre: this.tiendaPadreSeleccionada.tiendaSAP,
    }
    if (!CrearApertura.validate(payload)) {
      swal.fire('Informacion', 'Debe completar los datos en el formato correcto.');
    }
    this.aperturaService.create(CrearApertura.format(payload)).subscribe({
      next: (data) => {
        swal.fire('Success', `El usuario de interfaz es: ${data.usuarioInterface}, el usuario sian se vera reflejado el dia de mañana`);
      },
      error: () => {
        swal.fire('Error', 'Error al crear apertura de tienda.');
      }
    });
  }

  cancelar() {
    this.router.navigateByUrl("/home");
  }

  handleEmpresaChange(event) {
    this.tiendaService.getTiendas(event.value).subscribe({
      next: (data) => {
        this.tiendasByMarcaList = data;
      }
    });
    this.aperturaService.getFormatoTienda(event.value).subscribe({
      next: (data) => {
        const list = data.filter(d => !!d).map(d => ({ id: d, formato: d }));
        this.formatosList = list;
      }
    });
  }
}
