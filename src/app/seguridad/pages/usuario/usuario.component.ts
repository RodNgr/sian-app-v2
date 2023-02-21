import { Component, OnInit } from '@angular/core';

import { NgxSpinnerService } from 'ngx-spinner';

import { TreeNode } from 'primeng/api';

import { Aplicacion } from '../../entity/aplicacion';
import { AplicacionRol } from '../../entity/aplicacion-rol';
import { Usuario } from 'src/app/shared/entity/usuario';
import { UsuarioService } from '../../services/usuario.service';

import swal from 'sweetalert2';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {

  public usuario: Usuario = new Usuario();

  public accesosNodes: TreeNode[] = [];

  constructor(private spinner: NgxSpinnerService,
              private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.spinner.show();
    this.usuarioService.getUsuario(sessionStorage.getItem('user') || '').subscribe(
      usuario => {
        this.spinner.hide();
        this.usuario = usuario;

        console.log(usuario);

        this.procesaAccesos();
      }, 
      err => {
        this.spinner.hide();
        swal.fire('Error', err.error.mensaje === undefined ? err.error.message : err.error.mensaje, 'error');
      }
    );
  }

  private procesaAccesos() {
    let privilegios: AplicacionRol[] = [...this.usuario.applicationRolList];
    const aplicaciones = this.obtieneAplicaciones(privilegios);
    
    aplicaciones.forEach(app => {
      this.accesosNodes.push({
        key: app.id.toString(),
        label: app.name,
        expandedIcon: 'pi pi-folder-open',
        collapsedIcon: 'pi pi-folder',
        children: this.obtieneAccesosPadre(app.id, null, privilegios)
      });
    });
  }

  private obtieneAplicaciones(accesos: AplicacionRol[]): Aplicacion[] {
    const aplicaciones: Aplicacion[] = [];
    const map = new Map();

    for (const item of accesos) {
        if(!map.has(item.application.id)){
            map.set(item.application.id, true);    // set any value to Map
            aplicaciones.push({
                id: item.application.id,
                name: item.application.name,
                urlApplication: item.application.urlApplication,
                sendNotificationUnfamiliarLogin: item.application.sendNotificationUnfamiliarLogin,
                includeInactive: item.application.includeInactive,
                status: item.application.status,
                usuarioCreacion: item.application.usuarioCreacion,
                fechaCreacion: item.application.fechaCreacion,
                usuarioModificacion: item.application.usuarioModificacion,
                fechaModificacion: item.application.fechaModificacion
            });
        }
    }

    aplicaciones.sort(function (a, b) {
      if (a.name > b.name) {
        return 1;
      }
      if (a.name < b.name) {
        return -1;
      }

      return 0;
    });

    return aplicaciones;
  }

  private obtieneAccesosPadre(idAplicacion: number, rolPadre: String | null, accesos: AplicacionRol[]): TreeNode[] {
    let nodes: TreeNode[] = [];

    const encontrados: AplicacionRol[] = accesos.filter(ar => {
      return ar.application.id === idAplicacion && ar.rol.idPadre === rolPadre
    });

    if (encontrados.length > 0) {
      encontrados.sort(function (a, b) {
        if (a.rol.name > b.rol.name) {
          return 1;
        }
        if (a.rol.name < b.rol.name) {
          return -1;
        }
  
        return 0;
      })

      encontrados.forEach(x => {
        accesos = accesos.filter(acceso => {
          return acceso.id !== x.id;
        })

        nodes.push({
          key: x.id.toString(),
          label: x.rol.name,
          type: 'children',
          expandedIcon: 'pi pi-folder-open',
          collapsedIcon: 'pi pi-folder',
          children: this.obtieneAccesosPadre(x.application.id, x.rol.id, accesos)
        });
      });

      return nodes;
    } else {
      return [];
    }
  }

}
