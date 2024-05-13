import { Component, OnInit, Input } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InterfazAperturaService } from '../../services/interfaz-apertura.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { tiendaSeleccionada } from '../../entity/tiendaSeleccionada';

@Component({
  selector: 'app-editar-apertura-tienda',
  templateUrl: './editar-apertura-tienda.component.html',
  styleUrls: ['./editar-apertura-tienda.component.css'],
})
export class EditarAperturaTiendaComponent implements OnInit {
  @Input() valores;

  public emailTienda: string = '';
  public codigoInmuebleRP: string = '';
  public codigoLocalRP: string = '';
  public tiendaSAP1: string = '';

  public tienda: number = 0;
  public clienteSAP: string = '';
  public idEmpresa: number = 0;

  public tipoPA: number = 0;
  // Urbanova
  public idStore: number = 0;
  public dePrefijo: string = '';
  // Jockey
  public idMall: number = 0;
  public nuStore: string = '';

  private tiendaSeleccionada1: tiendaSeleccionada;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private aperturaService: InterfazAperturaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.listaDatos(this.config.data.tiendaSAP);
   
  }

  private listaDatos(tiendaSAP: number): void {
    this.aperturaService.getTiendaporCodigoSAP(tiendaSAP).subscribe({
      next: (data) => {
        this.emailTienda = data.tienda[0].email;
        this.codigoInmuebleRP = data.tienda[0].codigoInmuebleRP;
        this.codigoLocalRP = data.tienda[0].codigoLocalRP;
        this.tiendaSAP1 = data.tienda[0].tiendaSAP;
        this.tienda = data.tienda[0].tienda;
        this.idEmpresa = data.tienda[0].idEmpresa;
        this.clienteSAP = data.tienda[0].tiendaSAP;

        this.tipoPA = data.proceso[0].id_tipo_proceso;
        this.idStore = data.proceso[0].id_store;
        this.dePrefijo = data.proceso[0].de_prefijo;
        this.idMall = data.proceso[0].id_mall;
        this.nuStore = data.proceso[0].nu_store;
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

  public editar() {    
    this.tiendaSeleccionada1 = {
      tiendaSAP: this.tiendaSAP1,
      email: this.emailTienda,
      codigoInmuebleRP: this.codigoInmuebleRP,
      codigoLocalRP: this.codigoLocalRP,
      tipoProceso: this.tipoPA,
      dePrefijo: this.dePrefijo,
      idStore: this.idStore,
      idMall: this.idMall,
      nuStore: this.nuStore,
      clienteSAP: this.clienteSAP,
      idEmpresa: this.idEmpresa,
      tienda: this.tienda,
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
}
