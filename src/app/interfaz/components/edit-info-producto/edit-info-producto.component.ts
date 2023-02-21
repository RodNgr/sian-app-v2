import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';

import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { NgxSpinnerService } from 'ngx-spinner';

import { AuthService } from 'src/app/auth/services/auth.service';
import { EmpresaService } from '../../../shared/services/empresa.service';
import { InterfazProductoService } from '../../services/interfaz-producto.service';

import { FindJerarquiaComponent } from '../find-jerarquia/find-jerarquia.component';

import { ProductoSap } from '../../entity/producto-sap';
import { SeleccionarFamiliaDto } from '../../dto/seleccionar-familia-dto';
import { SubFamilia1 } from '../../entity/sub-familia1';
import { SubFamilia2 } from '../../entity/sub-familia2';
import { SubFamilia3 } from '../../entity/sub-familia3';
import { SubFamilia4 } from '../../entity/sub-familia4';

import swal from 'sweetalert2';

@Component({
  selector: 'app-edit-info-producto',
  templateUrl: './edit-info-producto.component.html',
  styleUrls: ['./edit-info-producto.component.css']
})
export class EditInfoProductoComponent implements OnInit, OnDestroy {

  public productoSapList: ProductoSap[] = [];

  public codigoPixel!: string;

  public isMobile: boolean = window.innerWidth < 641

  private ref!: DynamicDialogRef;

  constructor(private spinner: NgxSpinnerService,
              private interfazProductoService: InterfazProductoService,
              public empresaService: EmpresaService,
              private authService: AuthService,
              private dialogService: DialogService) { }

  ngOnInit(): void {
  }

  public buscar() {
    this.spinner.show();

    this.interfazProductoService.getArticulosSap(this.codigoPixel).subscribe(
      productoSapList => {
        this.productoSapList = productoSapList;
        this.productoSapList.forEach(producto => {
          let desJerarquia: string = '';

          if (producto.familia) {
            desJerarquia = producto.familia.descripcion;
          }
          
          if (producto.subFamilia1) {
            desJerarquia +=  ' -> ' + producto.subFamilia1.descripcion;
          }

          if (producto.subFamilia2) {
            desJerarquia +=  ' -> ' + producto.subFamilia2.descripcion;
          }

          if (producto.subFamilia3) {
            desJerarquia +=  ' -> ' + producto.subFamilia3.descripcion;
          }

          if (producto.subFamilia4) {
            desJerarquia +=  ' -> ' + producto.subFamilia4.descripcion;
          }

          producto.jerarquia = desJerarquia;
        });

        this.spinner.hide();
      },
      _err => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al buscar el artículo', 'error');
      }
    );
  }

  public editarFamilia(articulo: ProductoSap) {
    this.ref = this.dialogService.open(FindJerarquiaComponent, {
      header: 'Asignar Familia',
      width: '50%', 
      contentStyle: {"max-height": "500px", "overflow": "auto"},
      data: {editarDescripcion: true, descripcion: articulo.descripcionArticulo, clasica: articulo.clasica, premium: articulo.premium}
    });

    this.ref.onClose.subscribe((jerarquia: SeleccionarFamiliaDto) => {
      if (jerarquia) {
        let desJerarquia: string;

        articulo.descripcionArticulo = jerarquia.descripcion;
        articulo.tipoConsumo = jerarquia.tipoConsumo;
        articulo.familia = jerarquia.familia;
        
        desJerarquia = jerarquia.familia.descripcion;
        
        if (jerarquia.subFamilia1.id) {
          articulo.subFamilia1 = jerarquia.subFamilia1;
          desJerarquia +=  ' -> ' + jerarquia.subFamilia1.descripcion;
        } else {
          articulo.subFamilia1 = new SubFamilia1();
          articulo.subFamilia1.id = -1;
        }

        if (jerarquia.subFamilia2.id) {
          articulo.subFamilia2 = jerarquia.subFamilia2;
          desJerarquia +=  ' -> ' + jerarquia.subFamilia2.descripcion;
        } else {
          articulo.subFamilia2 = new SubFamilia2();
          articulo.subFamilia2.id = -1;
        }

        if (jerarquia.subFamilia3.id) {
          articulo.subFamilia3 = jerarquia.subFamilia3;
          desJerarquia +=  ' -> ' + jerarquia.subFamilia3.descripcion;
        } else {
          articulo.subFamilia3 = new SubFamilia3();
          articulo.subFamilia3.id = -1;
        }

        if (jerarquia.subFamilia4.id) {
          articulo.subFamilia4 = jerarquia.subFamilia4;
          desJerarquia +=  ' -> ' + jerarquia.subFamilia4.descripcion;
        } else {
          articulo.subFamilia4 = new SubFamilia4();
          articulo.subFamilia4.id = -1;
        }

        articulo.jerarquia = desJerarquia;
        articulo.clasica = jerarquia.clasica;
        articulo.premium = jerarquia.premium;

        this.spinner.show();
        articulo.coUsuModificacion = this.authService.usuario.username;
        this.interfazProductoService.actualizarArticuloSap(articulo).subscribe(
          _response => {
            this.spinner.hide();
            swal.fire('Éxito!', 'Artículo actualizado', 'success');
          },
          err => {
            this.spinner.hide();
            swal.fire(err.error.mensaje, err.error.error, 'error');
          }
        )
      }
    });
  }

  ngOnDestroy() {
    if (this.ref) {
        this.ref.destroy();
    }
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: any) {
      this.isMobile = window.innerWidth < 641;
  }
  
}
