import { Component, OnInit } from '@angular/core';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TreeNode } from 'primeng/api';

import { NgxSpinnerService } from 'ngx-spinner';

import { AplicacionRolService } from '../../services/aplicacion-rol.service';
import { AuthService } from '../../../auth/services/auth.service';
import { UsuarioService } from '../../services/usuario.service';

import { Aplicacion } from '../../entity/aplicacion';
import { AplicacionRol } from '../../entity/aplicacion-rol';
import { Usuario } from 'src/app/shared/entity/usuario';
import { UsuarioAplicacionRolDto } from '../../dto/usuario-aplicacion-rol-dto';

import swal from 'sweetalert2';

@Component({
  selector: 'app-asignar-accesos',
  templateUrl: './asignar-accesos.component.html',
  styleUrls: ['./asignar-accesos.component.css']
})
export class AsignarAccesosComponent implements OnInit {

  public usuario: Usuario = new Usuario();

  private aplicacionRolList: AplicacionRol[] = [];

  public selectedNodes: TreeNode[] = [];

  public accesosNodes: TreeNode[] = [];
  
  constructor(public ref: DynamicDialogRef, 
              public config: DynamicDialogConfig,
              private aplicacionRolService: AplicacionRolService,
              private usuarioService: UsuarioService,
              private authService: AuthService,
              private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.spinner.show();
    this.aplicacionRolService.getAll().subscribe(
      aplicacionRolList => {
        this.aplicacionRolList = aplicacionRolList;
        this.procesaAccesos();

        this.usuarioService.getUsuario(this.config.data.codigo).subscribe(
          usuario => {
            this.usuario = usuario;

            this.usuario.applicationRolList.forEach(ar => {
              const find: string = ar.application.id + '-' + ar.id;
              this.accesosNodes.forEach(node => {
                if (find === node.key) {
                  this.selectedNodes.push(node);
                }

                if (node.children) {
                  node.children.forEach(subNode1 => {
                    if (find === subNode1.key) {
                      this.selectedNodes.push(subNode1);
                    }

                    if (subNode1.children) {
                      subNode1.children.forEach(subNode2 => {
                        if (find === subNode2.key) {
                          this.selectedNodes.push(subNode2);
                        };

                        if (subNode2.children) {
                          subNode2.children.forEach(subNode3 => {
                            if (find === subNode3.key) {
                              this.selectedNodes.push(subNode3);
                            };
                          });
                        }
                      });
                    }
                  });
                }
              });

              /*
              this.selectedNodes.push({
                key: ar.application.id + '-' + ar.id,
                label: ar.rol.name,
                type: 'children',
                expandedIcon: 'pi pi-folder-open',
                collapsedIcon: 'pi pi-folder',
                data: ar.id,
              });
              */
            })

            this.spinner.hide();
          },
          _err => {
            this.spinner.hide();
            swal.fire({title:'Error', html: 'Problemas al obtener la información del usuario', icon: 'error', target: 'container', backdrop: 'false'});            
          }
        );
      },
      _err => {
        this.spinner.hide();
        swal.fire({title:'Error', html: 'Problemas al obtener la información de los accesos', icon: 'error', target: 'container', backdrop: 'false'});
      }
    );
  }

  private procesaAccesos() {
    let privilegios: AplicacionRol[] = [...this.aplicacionRolList];
    const aplicaciones = this.obtieneAplicaciones(privilegios);
    
    aplicaciones.forEach(app => {
      if (app.status === 'A') {
        let node: TreeNode = {
          key: app.id.toString(),
          label: app.name,
          expandedIcon: 'pi pi-folder-open',
          collapsedIcon: 'pi pi-folder',
        }

        node.children = this.obtieneAccesosPadre(app.id, null, privilegios, node);

        this.accesosNodes.push(node);
      }
    });
  }

  private obtieneAplicaciones(accesos: AplicacionRol[]): Aplicacion[] {
    const aplicaciones: Aplicacion[] = [];
    const map = new Map();

    for (const item of accesos) {
        if(!map.has(item.application.id)){
            map.set(item.application.id, true);
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
                fechaModificacion: undefined //item.application.fechaModificacion
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

  private obtieneAccesosPadre(idAplicacion: number, rolPadre: String | null, accesos: AplicacionRol[], nodeParent: TreeNode): TreeNode[] {
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

        let node: TreeNode = {
          key: x.application.id + '-' + x.id,
          label: x.rol.name,
          type: 'children',
          expandedIcon: 'pi pi-folder-open',
          collapsedIcon: 'pi pi-folder',
          data: x.id,
          parent: nodeParent
        }

        node.children = this.obtieneAccesosPadre(x.application.id, x.rol.id, accesos, node)
        nodes.push(node);
      });

      return nodes;
    } else {
      return [];
    }
  }
  
  public aplicar(): void {
    this.spinner.show();
    let usuarioAplicacionRolDto: UsuarioAplicacionRolDto = new UsuarioAplicacionRolDto();
    usuarioAplicacionRolDto.codigo = this.usuario.codigo;
    usuarioAplicacionRolDto.usuarioModificacion = this.authService.usuario.username;

    let aplicacionRolSeleccionado: AplicacionRol[] = [];
    this.selectedNodes.forEach(node => {
      if (node.type === 'children') {
        const appRol: AplicacionRol = new AplicacionRol();
        appRol.id = node.data;
        aplicacionRolSeleccionado.push(appRol);

        if (node.parent) {
          if (node.parent.data) {
            const appRolParent: AplicacionRol = new AplicacionRol();
            appRolParent.id = node.parent.data;
            aplicacionRolSeleccionado.push(appRolParent);
          }
        }
      }
    })

    usuarioAplicacionRolDto.aplicacionRolList = aplicacionRolSeleccionado;

    this.usuarioService.asignarAccesos(usuarioAplicacionRolDto).subscribe(
        _response => {
            this.spinner.hide();
            this.ref.close();
        },
        _err => {
          this.spinner.hide();
          swal.fire({title:'Error', html: 'Problemas al obtener la información de los grupos', icon: 'error', target: 'container', backdrop: 'false'});
        }
    );
  }

  public cancelar(): void {
    this.ref.close();
  }

}
