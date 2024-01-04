import swal from 'sweetalert2';
import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { Grupo } from '../../entity/grupo';
import { Usuario } from 'src/app/shared/entity/usuario';
import { UsuarioGrupoDto } from '../../dto/usuario-grupo-dto';

import { UsuarioService } from '../../services/usuario.service';
import { TiendaService } from '../../services/tienda.service';
import { EmpresaService } from 'src/app/shared/services/empresa.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Tienda } from '../../entity/tienda';
import { UsuarioTienda } from 'src/app/shared/entity/usuariotienda';

@Component({
  selector: 'app-asignar-tiendas',
  templateUrl: './asignar-tiendas.component.html',
  styleUrls: ['./asignar-tiendas.component.css'],
})
export class AsignarTiendasComponent implements OnInit {
  public grupos: Grupo[] = [];
  public gruposSeleccionados: Grupo[] = [];
  public usuario!: Usuario;

  public stores: Tienda[] = [];
  public selectedStore: Tienda;
  public usuarioTienda: UsuarioTienda[];

  public isGerente: boolean = false;
  public isSupervisor: boolean = false;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private empresaService: EmpresaService,
    private usuarioService: UsuarioService,
    private tiendaService: TiendaService,
    private authService: AuthService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.spinner.show();
    this.usuario = this.config.data;

    if (!this.usuario) {
      swal.fire({
        title: 'Error',
        html: 'Debe cargar un usuario',
        icon: 'error',
        target: 'container',
        backdrop: 'false',
      });
      this.ref.close();
      return;
    }

    this.isGerente = this.usuario.applicationRolList.some(
      (a) => 'ROL_EPICO_GERENTE' === a.rol.id
    );
    this.isSupervisor = this.usuario.applicationRolList.some(
      (a) => 'ROL_SUPERVISOR' === a.rol.id
    );

    if (!(this.isGerente || this.isSupervisor)) {
      swal.fire({
        title: 'Error',
        html: 'Debe ser un gerente o supervisor',
        icon: 'error',
        target: 'container',
        backdrop: 'false',
      });
      this.ref.close();
      return;
    }

    this.tiendaService
      .getTiendasPorEmpresa(
        this.empresaService.getEmpresaSeleccionada().idEmpresa,
        this.authService.getUsuarioInterface()
      )
      .subscribe({
        next: (result) => {
          this.spinner.hide();
          this.stores = result;
        },
        error: (error) => {
          this.spinner.hide();
          swal.fire({
            title: 'Error',
            html: 'Problemas al obtener la información de las tiendas',
            icon: 'error',
            target: 'container',
            backdrop: 'false',
          });
        },
      });

    this.usuarioService
      .getTiendasPorUsuario(this.config.data.codigo)
      .subscribe({
        next: (usuarioTienda) => {
          this.usuarioTienda = usuarioTienda;
          const userStoreMap = usuarioTienda.map((u) => u.codtienda);
          this.selectedStore = this.stores.find((s) =>
            userStoreMap.includes(s.idEmpresa)
          );
        },
        error: () => {
          this.spinner.hide();
          swal.fire({
            title: 'Error',
            html: 'Problemas al obtener la información del usuario',
            icon: 'error',
            target: 'container',
            backdrop: 'false',
          });
        },
      });
  }

  public aplicar(): void {
    this.spinner.show();

    const dto: UsuarioGrupoDto = new UsuarioGrupoDto();
    dto.codigo = this.usuario.codigo;
    dto.groupList = this.gruposSeleccionados;

    if (this.isGerente && this.usuarioTienda[0].codtienda) {
      this.usuarioService
        .deleteTiendasPorUsuario(
          this.usuario.codigo,
          this.usuarioTienda[0].codtienda
        )
        .subscribe({
          next: () => {
            console.log('Se elimino la anterior seleccion');
          },
          error: () => {
            swal.fire({
                title: 'Error',
                html: 'Problemas al desvincular la anterior tienda',
                icon: 'error',
                target: 'container',
                backdrop: 'false',
              });
          }
        });
    }

    this.usuarioService
      .saveTiendasPorUsuario(this.usuario.codigo, this.selectedStore.tienda)
      .subscribe({
        next: () => {
          this.spinner.hide();
          swal.fire({
            title: 'Success',
            html: '¡Vinculado exitosamente!',
            icon: 'success',
            target: 'container',
            backdrop: 'false',
          });
          if (this.isGerente) {
            this.ref.close();
          }
        },
        error: () => {
          this.spinner.hide();
          swal.fire({
            title: 'Error',
            html: 'Error al vincular la tienda con el usuario',
            icon: 'error',
            target: 'container',
            backdrop: 'false',
          });
        },
      });
  }

  public cerrar(): void {
    this.ref.close();
  }
}
