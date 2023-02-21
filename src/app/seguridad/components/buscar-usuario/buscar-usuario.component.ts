import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../../shared/entity/usuario';
import { NgxSpinnerService } from 'ngx-spinner';
import { UsuarioService } from '../../services/usuario.service';
import swal from 'sweetalert2';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-buscar-usuario',
  templateUrl: './buscar-usuario.component.html',
  styleUrls: ['./buscar-usuario.component.css']
})
export class BuscarUsuarioComponent implements OnInit {

  public usuarioList: Usuario[] = [];

  public usuarioSelected!: Usuario;

  public filtro!: string;

  constructor(public spinner: NgxSpinnerService,
              public ref: DynamicDialogRef, 
              public config: DynamicDialogConfig,
              private usuarioService: UsuarioService) { }

  ngOnInit(): void {
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

    this.ref.close(this.usuarioSelected);
  }

  public cerrar(): void {
    this.ref.close();
  }

}
