import { Component, OnInit } from '@angular/core';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { NgxSpinnerService } from 'ngx-spinner';

import { UsuarioService } from '../../services/usuario.service';

import { Grupo } from '../../entity/grupo';
import { GrupoService } from '../../services/grupo.service';
import { Usuario } from 'src/app/shared/entity/usuario';
import { UsuarioGrupoDto } from '../../dto/usuario-grupo-dto';

import swal from 'sweetalert2';

@Component({
  selector: 'app-asignar-usuario-tienda',
  templateUrl: './asignar-usuario-tienda.component.html',
  styleUrls: ['./asignar-usuario-tienda.component.css']
})
export class AsignarUsuarioTiendaComponent implements OnInit {

  public grupos: Grupo[] = [];

  public gruposSeleccionados: Grupo[] = [];

  public usuario!: Usuario;

  constructor(public ref: DynamicDialogRef, 
              public config: DynamicDialogConfig,
              private grupoService: GrupoService,
              private usuarioService: UsuarioService,
              private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.spinner.show();

    this.usuarioService.getUsuario(this.config.data.codigo).subscribe(
      usuario => {
        this.usuario = usuario;
        this.gruposSeleccionados = usuario.groupList;
        this.grupoService.getAllGrupos().subscribe(
          grupos => {
            this.grupos = grupos;
            this.spinner.hide();
          },
          _err => {
            this.spinner.hide();
            swal.fire({title:'Error', html: 'Problemas al obtener la información de los grupos', icon: 'error', target: 'container', backdrop: 'false'});
          }
        );
      },
      _err => {
        this.spinner.hide();
        swal.fire({title:'Error', html: 'Problemas al obtener la información del usuario', icon: 'error', target: 'container', backdrop: 'false'});
      }
    );
  }

  public aplicar(): void {
    this.spinner.show();

    const dto: UsuarioGrupoDto = new UsuarioGrupoDto();
    dto.codigo = this.usuario.codigo;
    dto.groupList = this.gruposSeleccionados;

    this.usuarioService.asignarGrupos(dto).subscribe(
      _response => {
        this.spinner.hide();
        this.ref.close('aceptado');
      },
      _err => {
        swal.fire({title:'Error', html: 'Problemas al asignar los grupos al usuario', icon: 'error', target: 'container', backdrop: 'false'});
      }
    );
  }

  public cerrar(): void {
    this.ref.close();
  }

}
