import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Usuario } from 'src/app/shared/entity/usuario';
import { UsuarioService } from '../../services/usuario.service';
import swal from 'sweetalert2';
import { AplicacionService } from '../../services/aplicacion.service';
import { Aplicacion } from '../../entity/aplicacion';

interface Response {
  codigo: string,
  applicationId: number  
}

@Component({
  selector: 'app-copiar-acceso',
  templateUrl: './copiar-acceso.component.html',
  styleUrls: ['./copiar-acceso.component.css']
})
export class CopiarAccesoComponent implements OnInit {

  public usuarioList: Usuario[] = [];

  public usuarioSelected!: Usuario;

  public aplicacionList: Aplicacion[] = [];

  public aplicacionSelected!: Aplicacion;

  public filtro!: string;

  constructor(public spinner: NgxSpinnerService,
              public ref: DynamicDialogRef, 
              public config: DynamicDialogConfig,
              private usuarioService: UsuarioService,
              private aplicacionService: AplicacionService) { }

  ngOnInit(): void {
    this.spinner.show();
    this.aplicacionService.getAllAplicaciones().subscribe(
      aplicacionList => {
        this.aplicacionList = aplicacionList;
        this.spinner.hide();
      },
      _err => {
        swal.fire('Error', 'Problemas al obtener las aplicacion', 'error');
        this.spinner.hide();
      }
    );
  }

  public buscar(): void {
    if (this.filtro === undefined) {
      swal.fire('Advertencia!', 'Debe ingresar el criterio de búsqueda', 'warning');
      return;
    }

    if (this.filtro.trim().length < 5) {
      swal.fire('Advertencia!', 'Debe ingresar por lo menos 5 caracteres', 'warning');
      return;
    }

    this.spinner.show();
    this.usuarioService.getFindUsuarios(this.filtro).subscribe(
      usuarioList => {
        this.usuarioList = usuarioList;
        this.spinner.hide();
      },
      _err => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al obtener la información de los usuarios', 'error');
      }
    );
  }

  public aceptar(): void {
    if (!this.usuarioSelected) {
      swal.fire('Advertencia!', 'Debe seleccionar un usuario', 'warning');
      return;
    }

    let data: Response = {codigo: this.usuarioSelected.codigo, applicationId: this.aplicacionSelected.id};

    this.ref.close(data);
  }

  public cerrar(): void {
    this.ref.close();
  }

}
