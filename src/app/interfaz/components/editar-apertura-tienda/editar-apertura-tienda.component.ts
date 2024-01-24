import { Component, OnInit, Input } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InterfazAperturaService } from '../../services/interfaz-apertura.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { TiendaByEmpresaResponse } from '../../entity/TiendaByEmpresaResponse';
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
        this.emailTienda = data[0].email;
        this.codigoInmuebleRP = data[0].codigoInmuebleRP;
        this.codigoLocalRP = data[0].codigoLocalRP;   
        this.tiendaSAP1 = data[0].tiendaSAP;
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
      codigoLocalRP: this.codigoLocalRP
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
