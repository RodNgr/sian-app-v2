import { Component, HostListener, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { NgxSpinnerService } from 'ngx-spinner';

import { GrupoTiendaService } from '../../services/grupo-tienda.service';
import { EmpresaService } from '../../../shared/services/empresa.service';

import { Empresa } from 'src/app/shared/entity/empresa';
import { Grupo } from '../../entity/grupo';
import { GroupStore } from '../../entity/group-store';
import { Store } from '../../entity/store';

import swal from 'sweetalert2';

@Component({
  selector: 'app-asignar-tienda',
  templateUrl: './asignar-tienda.component.html',
  styleUrls: ['./asignar-tienda.component.css']
})
export class AsignarTiendaComponent implements OnInit {

  public grupoTiendaList: GroupStore[] = [];

  public grupo!: Grupo;

  public isMobile: boolean = window.innerWidth < 641;

  public tiendas: Store[] = [];

  public tiendaSeleccionada!: Store;

  public empresaSeleccionada!: Empresa;

  constructor(public ref: DynamicDialogRef, 
              public config: DynamicDialogConfig,
              private grupoTiendaService: GrupoTiendaService,
              public empresaService: EmpresaService,
              private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.grupo = this.config.data;

    this.spinner.show();

    this.grupoTiendaService.getTiendasPorGrupo(this.grupo.id).subscribe(
      grupoTiendaList => {
        this.grupoTiendaList = grupoTiendaList;
        this.grupoTiendaList.forEach(gt => {
          gt.store.marca = this.empresaService.getEmpresa(gt.store.pk.idEmpresa).nombre;
        })
        
        this.spinner.hide();
      },
      _err => {
        this.spinner.hide();
        swal.fire({title:'Error', html: 'Problemas al obtener la información de las tiendas', icon: 'error', target: 'dt', backdrop: 'false'});
      }
    );
  }

  public cerrar() {
    this.ref.close();
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: any) {
      this.isMobile = window.innerWidth < 641;
  }

  public agregar(): void {
    if (this.tiendaSeleccionada == null) {
      return;
    } else {
      let grupoTienda = new GroupStore();
      grupoTienda.group = this.grupo;
      grupoTienda.store = this.tiendaSeleccionada;
      let existe: boolean = false;

      for (let entry of this.grupoTiendaList) {
        if (entry.store.pk.clienteSAP === this.tiendaSeleccionada.pk.clienteSAP) {
          existe = true;
          break;
        }
      }

      if (!existe) {
        this.spinner.show();
        this.grupoTiendaService.create(grupoTienda).subscribe(
          response => {
            response.groupStore.store.marca = this.empresaService.getEmpresa(response.groupStore.store.pk.idEmpresa).nombre;
            this.grupoTiendaList.push(response.groupStore);
            this.spinner.hide();
          },
          _err=> {
            swal.fire({title:'Error', html: 'Problemas al agregar la tienda al grupo', icon: 'error', target: 'dt', backdrop: 'false'});
            this.spinner.hide();
          }
        );
      }
    }
  }

  public delete(gs: GroupStore) {
    swal.fire({
      title: '¿Estás seguro?',
      text: `¿Seguro de eliminar esta tienda del grupo?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.spinner.show();
        this.grupoTiendaService.delete(gs.id).subscribe(
          _appRol => {
            this.spinner.hide();
            this.grupoTiendaList = this.grupoTiendaList.filter(a => {
              return a.id !== gs.id;
            })
          },
          _err => {
            this.spinner.hide();
            swal.fire({title:'Error', html: 'Problemas al eliminar la tienda del grupo', icon: 'error', target: 'dt', backdrop: 'false'});
          }
        );
      } 
    })
  }

  public changeEmpresa() {
    if (!this.empresaSeleccionada) {
      return;
    }

    this.spinner.show();
    this.grupoTiendaService.getTiendasPorMarca(this.empresaSeleccionada.idEmpresa).subscribe(
      tiendasList => {
        this.tiendas = tiendasList;
        this.spinner.hide();
      },
      _err => {
        this.spinner.hide();
        swal.fire({title:'Error', html: 'Problemas al buscar las tiendas', icon: 'error', target: 'dt', backdrop: 'false'});        
      }
    );
  }
}
