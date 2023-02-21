import { Component, OnInit, OnDestroy } from '@angular/core';

import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { NgxSpinnerService } from 'ngx-spinner';

import { EmpresaService } from '../../../shared/services/empresa.service';
import { InterfazProductoService } from '../../services/interfaz-producto.service';

import { ErrorCargaMasivaComponent } from '../error-carga-masiva/error-carga-masiva.component';

import { CargaMasivaDto } from '../../dto/carga-masiva-dto';

import swal from 'sweetalert2';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-carga-masiva-producto',
  templateUrl: './carga-masiva-producto.component.html',
  styleUrls: ['./carga-masiva-producto.component.css']
})
export class CargaMasivaProductoComponent implements OnInit, OnDestroy {

  public dto: CargaMasivaDto = new CargaMasivaDto();

  public url!: string;

  public isMobile: boolean = window.innerWidth < 641

  private ref!: DynamicDialogRef;

  constructor(private interfazArticuloService: InterfazProductoService,
              public empresaService: EmpresaService,
              private spinner: NgxSpinnerService,
              private dialogService: DialogService) { 
    this.url = environment.urlInterfazProducto;
  }

  ngOnInit(): void {
  }

  public loadData(): void {
    this.spinner.show();

    this.interfazArticuloService.actualizarCargaMasivaArticulo(this.dto).subscribe(
      _response => {
        this.spinner.hide();
        this.dto = new CargaMasivaDto();
        swal.fire('Éxito', 'Artículos actualizados exitosamente', 'success');
      },
      _err => {
        this.spinner.hide();
        console.log(_err);
        swal.fire('Error', 'Problemas al actualizar masivamente los artículos', 'error');
      }
    )
  }

  public customUpload(event: any, fileUpload: any) {
    if (event.files) {
      this.spinner.show();

      this.interfazArticuloService.uploadFile(event.files[0]).subscribe(
        response => {
          this.spinner.hide();
          this.dto = response;

          this.dto.articuloList.forEach(articulo => {
            let desJerarquia: string;

            desJerarquia = articulo.familia.descripcion;
        
            if (articulo.subFamilia1) {
              desJerarquia +=  ' -> ' + articulo.subFamilia1.descripcion;
            }

            if (articulo.subFamilia2) {
              desJerarquia +=  ' -> ' + articulo.subFamilia2.descripcion;
            }

            if (articulo.subFamilia3) {
              desJerarquia +=  ' -> ' + articulo.subFamilia3.descripcion;
            }

            if (articulo.subFamilia4) {
              desJerarquia +=  ' -> ' + articulo.subFamilia4.descripcion;
            }

            articulo.jerarquia = desJerarquia;
          });
          
          if (this.dto.rowInvalidList.length > 0) {
            this.ref = this.dialogService.open(ErrorCargaMasivaComponent, {
              header: 'Errores de Carga',
              width: '75%', 
              contentStyle: {"max-height": "500px", "overflow": "auto"},
              data: this.dto.rowInvalidList
            });
          }
        },
        _err => {
          this.spinner.hide();
          swal.fire('Error', 'Problemas al cargar el archivo', 'error');   
        }
      );
    }

    fileUpload.clear();
  }

  ngOnDestroy() {
    if (this.ref) {
        this.ref.destroy();
    }
  }

}
