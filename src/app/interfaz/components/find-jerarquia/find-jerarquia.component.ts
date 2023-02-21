import { Component, OnInit } from '@angular/core';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { NgxSpinnerService } from 'ngx-spinner';

import { FamiliaService } from '../../services/familia.service';
import { EmpresaService } from '../../../shared/services/empresa.service';

import { Familia } from '../../entity/familia';
import { SubFamilia1 } from '../../entity/sub-familia1';
import { SubFamilia2 } from '../../entity/sub-familia2';
import { SubFamilia3 } from '../../entity/sub-familia3';
import { SubFamilia4 } from '../../entity/sub-familia4';
import { TipoConsumo } from '../../entity/tipo-consumo';

import { SubFamilia1Service } from '../../services/sub-familia1.service';
import { SubFamilia2Service } from '../../services/sub-familia2.service';
import { SubFamilia3Service } from '../../services/sub-familia3.service';
import { SubFamilia4Service } from '../../services/sub-familia4.service';
import { TipoConsumoService } from '../../services/tipo-consumo.service';

import { SeleccionarFamiliaDto } from '../../dto/seleccionar-familia-dto';

import swal from 'sweetalert2';

@Component({
  selector: 'app-find-jerarquia',
  templateUrl: './find-jerarquia.component.html',
  styleUrls: ['./find-jerarquia.component.css']
})
export class FindJerarquiaComponent implements OnInit {

  public descripcion: string = '';
  public clasicas!: number;
  public premiums!: number;
  public tipoConsumoList: TipoConsumo[] = [];
  public familiaList: Familia[] = [];
  public subFamilia1List: SubFamilia1[] = [];
  public subFamilia2List: SubFamilia2[] = [];
  public subFamilia3List: SubFamilia3[] = [];
  public subFamilia4List: SubFamilia4[] = [];

  public tipoConsumo!: TipoConsumo;
  public familia!: Familia;
  public subFamilia1!: SubFamilia1;
  public subFamilia2!: SubFamilia2;
  public subFamilia3!: SubFamilia3;
  public subFamilia4!: SubFamilia4;

  private seleccionarFamiliaDto: SeleccionarFamiliaDto = new SeleccionarFamiliaDto();

  public editarDescripcion: boolean = true;

  constructor(private  spinner: NgxSpinnerService,
              private tipoConsumoService: TipoConsumoService,
              private familiaService: FamiliaService,
              private subFamilia1Service: SubFamilia1Service,
              private subFamilia2Service: SubFamilia2Service,
              private subFamilia3Service: SubFamilia3Service,
              private subFamilia4Service: SubFamilia4Service,
              public empresaService: EmpresaService,
              public ref: DynamicDialogRef, 
              public config: DynamicDialogConfig) { }

  ngOnInit(): void {
    this.editarDescripcion = this.config.data.editarDescripcion;
    this.descripcion = this.config.data.descripcion;
    this.clasicas = this.config.data.clasica;
    this.premiums = this.config.data.premium;

    this.spinner.show();

    this.tipoConsumoService.getAll().subscribe(
      tipoConsumoList => {
        this.tipoConsumoList = tipoConsumoList

        this.familiaService.getAll().subscribe(
          familiaList => {
            this.familiaList = familiaList;
            this.spinner.hide();
          },
          _err=> {
            this.spinner.hide();
            swal.fire('Error', 'Problemas al obtener las familias', 'error');
          }
        );
      },
      _err => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al obtener los tipos de consumo', 'error');
      }
    );

  }

  public aceptar(): void {
    if (!this.descripcion && this.editarDescripcion) {
      swal.fire({title:'Alerta!', html: 'Debe ingresar la descripción del producto', icon: 'warning', target: 'id', backdrop: 'false'});
      return;
    }

    if (this.descripcion.trim().length < 5 && this.editarDescripcion) {
      swal.fire({title:'Alerta!', html: 'Debe ingresar la descripción del producto', icon: 'warning', target: 'id', backdrop: 'false'});
      return;
    }

    if (!this.tipoConsumo) {
      swal.fire({title:'Alerta!', html: 'Debe seleccionar un tipo de consumo', icon: 'warning', target: 'id', backdrop: 'false'});
      return;
    }

    if (!this.familia) {
      swal.fire({title:'Alerta!', html: 'Debe seleccionar una familia', icon: 'warning', target: 'id', backdrop: 'false'});
      return;
    }

    this.seleccionarFamiliaDto.descripcion = this.descripcion;
    this.seleccionarFamiliaDto.tipoConsumo = this.tipoConsumo;
    this.seleccionarFamiliaDto.familia = this.familia;
    this.seleccionarFamiliaDto.subFamilia1 = this.subFamilia1;
    this.seleccionarFamiliaDto.subFamilia2 = this.subFamilia2;
    this.seleccionarFamiliaDto.subFamilia3 = this.subFamilia3;
    this.seleccionarFamiliaDto.subFamilia4 = this.subFamilia4;
    this.seleccionarFamiliaDto.clasica = this.clasicas;
    this.seleccionarFamiliaDto.premium = this.premiums;

    this.ref.close(this.seleccionarFamiliaDto);
  }

  public cancelar(): void {
    this.ref.close();
  }

  public changeFamilia(): void {
    this.subFamilia1 = new SubFamilia1();
    this.subFamilia2 = new SubFamilia2();
    this.subFamilia3 = new SubFamilia3();
    this.subFamilia4 = new SubFamilia4();

    if (!this.familia) {
      return;
    }

    this.spinner.show();
    this.subFamilia1Service.getAllPorPadre(this.familia.id).subscribe(
      subfamilia => {
        this.subFamilia1List = subfamilia;
        this.spinner.hide();
      },
      _err => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al obtener las sub familias 1', 'error');
      }
    );
  }

  public changeSubFamilia1(): void {
    this.subFamilia2 = new SubFamilia2();
    this.subFamilia3 = new SubFamilia3();
    this.subFamilia4 = new SubFamilia4();

    if (!this.subFamilia1) {
      return;
    }

    this.spinner.show();
    this.subFamilia2Service.getAllPorPadre(this.subFamilia1.id).subscribe(
      subfamilia => {
        this.subFamilia2List = subfamilia;
        this.spinner.hide();
      },
      _err => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al obtener las sub familias 2', 'error');
      }
    );
  }

  public changeSubFamilia2(): void {
    this.subFamilia3 = new SubFamilia3();
    this.subFamilia4 = new SubFamilia4();
    
    if (!this.subFamilia2) {
      return;
    }

    this.spinner.show();
    this.subFamilia3Service.getAllPorPadre(this.subFamilia2.id).subscribe(
      subfamilia => {
        this.subFamilia3List = subfamilia;
        this.spinner.hide();
      },
      _err => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al obtener las sub familias 3', 'error');
      }
    );
  }

  public changeSubFamilia3(): void {
    this.subFamilia4 = new SubFamilia4();

    if (!this.subFamilia3) {
      return;
    }

    this.spinner.show();
    this.subFamilia4Service.getAllPorPadre(this.subFamilia3.id).subscribe(
      subfamilia => {
        this.subFamilia4List = subfamilia;
        this.spinner.hide();
      },
      _err => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al obtener las sub familias 4', 'error');
      }
    );
  }

}
