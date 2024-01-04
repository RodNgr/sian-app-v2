import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import { NgxSpinnerService } from 'ngx-spinner';

import { UsuarioService } from '../../services/usuario.service';

import { Usuario } from 'src/app/shared/entity/usuario';

import { AsignarAccesosComponent } from '../../components/asignar-accesos/asignar-accesos.component';
import { AsignarUsuarioTiendaComponent } from '../../components/asignar-usuario-tienda/asignar-usuario-tienda.component';
import { VerDispositivosComponent } from '../../components/ver-dispositivos/ver-dispositivos.component';

import swal from 'sweetalert2';
import { CopiarAccesoComponent } from '../../components/copiar-acceso/copiar-acceso.component';
import { CopiarPermisoDto } from '../../dto/copiar-permiso-dto';
import { AsignarTiendasComponent } from '../../components/asignar-tiendas/asignar-tiendas.component';

@Component({
  selector: 'app-lista-usuario',
  templateUrl: './lista-usuario.component.html',
  styleUrls: ['./lista-usuario.component.css']
})
export class ListaUsuarioComponent implements OnInit, OnDestroy {

  public usuarioList: Usuario[] = [];

  public usuarioSelected!: Usuario;

  public filtro!: string;

  public cantidadMap = {
    '=0': 'No existen coincidencias',
    '=1': 'En total hay 1 coincidencia',
    'other': 'En total hay # coincidencias'
  }

  public isMobile: boolean = window.innerWidth < 641;

  private ref!: DynamicDialogRef;

  constructor(private spinner: NgxSpinnerService,
              private usuarioService: UsuarioService,
              private dialogService: DialogService,
              private router: Router) { }

  ngOnInit(): void {
    sessionStorage.removeItem('user');
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

  public viewUsuario() {
    if (!this.usuarioSelected) {
      swal.fire('Alerta!', 'Debe seleccionar un usuario', 'warning');
      return;
    }

    sessionStorage.setItem('user', this.usuarioSelected.codigo);

    this.router.navigateByUrl("/home/seguridad/usuario");
  }

  public asignarGrupo(): void {
    if (!this.usuarioSelected) {
      swal.fire('Alerta!', 'Debe seleccionar un grupo', 'warning');
      return;
    } 

    this.ref = this.dialogService.open(AsignarUsuarioTiendaComponent, {
      header: 'Grupos asignados al Usuario: ' + this.usuarioSelected.fullName,
      width: '60%',
      contentStyle: {"overflow": "auto"},
      data: this.usuarioSelected
    });
  }

  public asignarPermisos(): void {
    if (!this.usuarioSelected) {
      swal.fire('Alerta!', 'Debe seleccionar un grupo', 'warning');
      return;
    } 

    this.ref = this.dialogService.open(AsignarAccesosComponent, {
      header: 'Accesos asignados al Usuario: ' + this.usuarioSelected.fullName,
      width: '60%',
      contentStyle: {"overflow": "auto"},
      data: this.usuarioSelected
    });
  }

  public asignarTiendas(): void {
    if (!this.usuarioSelected) {
      swal.fire('Alerta!', 'Debe seleccionar un usuario', 'warning');
      return;
    }
    if (!this.usuarioSelected.applicationRolList.some(a => ['ROL_EPICO_GERENTE', 'ROL_SUPERVISOR'].includes(a.rol.id))) {
      swal.fire('Alerta!', 'Debe ser supervisor o gerente', 'warning');
      return;
    }

    this.ref = this.dialogService.open(AsignarTiendasComponent, {
      header: 'Asignar tiendas al usuario: ' + this.usuarioSelected.fullName,
      width: '60%',
      contentStyle: {"overflow": "auto"},
      data: this.usuarioSelected
    });
  }

  public viewDevice(): void {
    if (!this.usuarioSelected) {
      swal.fire('Alerta!', 'Debe seleccionar un usuario', 'warning');
      return;
    } 

    this.ref = this.dialogService.open(VerDispositivosComponent, {
      header: 'Dispositivos del Usuario: ' + this.usuarioSelected.fullName,
      width: '75%',
      contentStyle: {"overflow": "auto"},
      data: this.usuarioSelected
    });
  }

  public copiarPermisos(): void {
    if (!this.usuarioSelected) {
      swal.fire('Alerta!', 'Debe seleccionar un usuario', 'warning');
      return;
    }

    this.ref = this.dialogService.open(CopiarAccesoComponent, {
      header: 'Copia de Permisos',
      width: '75%',
      contentStyle: {"overflow": "auto"},
    });

    this.ref.onClose.subscribe((data: any) => {
      if (data) {
        this.spinner.show();

        let dto: CopiarPermisoDto = new CopiarPermisoDto();
        dto.usuarioOrigen = data.codigo;
        dto.usuarioDestino = this.usuarioSelected.codigo;
        dto.applicationId = data.applicationId;

        this.usuarioService.copiarPrivilegios(dto).subscribe(
          _rpta => {
            this.spinner.hide();
            swal.fire('Éxito', 'Permisos copiados exitosamente', 'success');
          },
          err => {
            this.spinner.hide();
            console.log(err);
            swal.fire('Error', 'Problemas al copiar los permisos', 'error');
          }
        );
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: any) {
      this.isMobile = window.innerWidth < 641;
  }

  ngOnDestroy(): void {
    if (this.ref) {
      this.ref.destroy();
    }
  }

}
