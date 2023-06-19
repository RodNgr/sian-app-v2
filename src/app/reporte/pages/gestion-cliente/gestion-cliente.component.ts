import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import swal from 'sweetalert2';

import { ClienteActualiza, ClienteRegistro } from './entity/cliente';
import { ClienteUnicoService } from './services/cliente-unico.service';

interface ICombo {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-gestion-cliente',
  templateUrl: './gestion-cliente.component.html',
  styleUrls: ['./gestion-cliente.component.css'],
})
export class GestionClienteComponent implements OnInit {
  public title: string = 'Pagina sin nombre - Gestion Cliente';

  tipoDocumentosList = [
    { id: '0', nombre: 'Doc.trib.no.doc.sin.ruc' },
    { id: '1', nombre: 'Doc. Nacional de identidad' },
    { id: '4', nombre: 'Carnet de extranjería' },
    { id: '6', nombre: 'Registro Único de Contribuyentes' },
    { id: '7', nombre: 'Pasaporte' },
    { id: 'A', nombre: 'Ced. Diplomática de identidad' },
    { id: 'B', nombre: 'Documento identidad país residencia-no.d' },
    { id: 'C', nombre: 'Tax identification Number - TIN - Doc Trib' },
    { id: 'E', nombre: 'TAM - Tarjeta Andina de Migración' },
  ];

  marcasList = [
    { id: 2, nombre: 'Bembos' },
    { id: 3, nombre: 'Don Belisario' },
    { id: 4, nombre: 'Popeyes' },
    { id: 5, nombre: 'Chinawok' },
    { id: 7, nombre: 'Papa Johns' },
    { id: 8, nombre: 'Dunkin Donuts' },
  ];

  canalesList = [
    { id: 0, nombre: 'Salón' },
    { id: 1, nombre: 'Call center' },
    { id: 2, nombre: 'Web' },
    { id: 4, nombre: 'App' },
    { id: 2, nombre: 'Bot' },
  ];

  documentoSeleccionado: ICombo;
  nroDocumento: string;
  marcaSeleccionada: ICombo;

  actualizaTratamiento: ClienteActualiza;
  registraCliente: ClienteRegistro;

  token: string;

  clientes: any[];
  clonedClients: { [s: string]: any } = {};

  constructor(
    private spinner: NgxSpinnerService,
    private readonly clienteUnicoService: ClienteUnicoService
  ) {
    this.actualizaTratamiento = new ClienteActualiza();
    this.registraCliente = new ClienteRegistro();
    this.clientes = [];
  }

  ngOnInit(): void {
    this.spinner.hide();
    this.clienteUnicoService.getToken().subscribe((res) => {
      this.token = res.access_token;
    });
  }

  actualizarTratamiento() {
    this.spinner.show();
    if (!ClienteActualiza.validate(this.actualizaTratamiento)) {
      swal.fire('Info', 'Completa todos los campos', 'info');
      this.spinner.hide();
      return;
    }
    this.clienteUnicoService
      .actualizaTratamiento(
        ClienteActualiza.parseUpdate(this.actualizaTratamiento),
        this.token
      )
      .subscribe(
        (data) => {
          swal.fire(
            'Actualizar',
            `Usuario ${this.actualizaTratamiento.documento} actualizado`,
            'info'
          );
          this.spinner.hide();
        },
        (err) => {
          swal.fire('Error', 'Error al actualizar cliente', 'error');
          this.spinner.hide();
        }
      );
  }

  registraClienteUnico() {
    this.spinner.show();
    if (!ClienteRegistro.validateParams(this.registraCliente)) {
      swal.fire('Info', 'Completa todos los campos', 'info');
      this.spinner.hide();
      return;
    }
    this.clienteUnicoService
      .registraCliente(
        ClienteRegistro.parseRegister(this.registraCliente),
        this.token
      )
      .subscribe(
        (data) => {
          swal.fire(
            'Registro',
            `Usuario ${this.registraCliente.nombre} creado`,
            'info'
          );
          this.spinner.hide();
          this.registraCliente = new ClienteRegistro();
        },
        (err) => {
          swal.fire('Error', 'Error al actualizar cliente', 'error');
          this.spinner.hide();
        }
      );
  }

  buscar() {
    this.spinner.show();
    if (!this.nroDocumento || !this.documentoSeleccionado) {
      swal.fire('Info', 'Completa todos los campos', 'info');
      this.spinner.hide();
      return;
    }
    this.clienteUnicoService
      .consultaDocumento(
        {
          documento: this.nroDocumento,
          tipoDoc: this.documentoSeleccionado.toString(),
        },
        this.token
      )
      .subscribe(
        (data) => {
          this.clientes.push({
            documento: data.cliente.documento,
            nombre: `${data.cliente.nombre} ${data.cliente.apellidoPater}`,
            correo: data.cliente.correo,
            tratamiento: data.cliente.checkTratamiento,
            tipoDoc: data.cliente.tipoDoc,
          });
          this.spinner.hide();
        },
        (error) => {
          console.error('error', error);
          swal.fire('Error', 'Error al buscar cliente', 'error');
          this.spinner.hide();
        }
      );
  }

  onRowEditInit(cliente) {
    this.clonedClients[cliente.documento as string] = { ...cliente };
  }

  onRowEditSave(cliente) {
    delete this.clonedClients[cliente.documento as string];
    this.clienteUnicoService
      .actualizaTratamiento(
        {
          documento: cliente.documento,
          gestionDatos: +cliente.tratamiento,
          marca: '',
          tipoDoc: cliente.tipoDoc,
        },
        this.token
      )
      .subscribe(
        (data) => {
          swal.fire(
            'Actualizar',
            `Usuario ${this.actualizaTratamiento.documento} actualizado`,
            'info'
          );
          this.spinner.hide();
        },
        (err) => {
          swal.fire('Error', 'Error al actualizar cliente', 'error');
          this.spinner.hide();
        }
      );
    swal.fire(
      'Actualizar',
      `Usuario ${this.actualizaTratamiento.documento} actualizado`,
      'info'
    );
  }

  onRowEditCancel(cliente, index: number) {
    this.clientes[index] = this.clonedClients[cliente.documento as string];
    delete this.clonedClients[cliente.documento as string];
  }
}
