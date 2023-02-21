import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';

import { AuthService } from 'src/app/auth/services/auth.service';
import { EmpresaService } from 'src/app/shared/services/empresa.service';
import { SubFamilia1Service } from '../../services/sub-familia1.service';
import { SubFamilia2Service } from '../../services/sub-familia2.service';

import { SubFamilia1 } from '../../entity/sub-familia1';
import { SubFamilia2 } from '../../entity/sub-familia2';

import swal from 'sweetalert2';

@Component({
  selector: 'app-sub-familia2',
  templateUrl: './sub-familia2.component.html',
  styleUrls: ['./sub-familia2.component.css']
})
export class SubFamilia2Component implements OnInit {

  public title: string = 'Nuevo Sub Familia 2';

  public type: string = 'V';

  public subFamilias1: SubFamilia1[] = [];

  public subFamilia: SubFamilia2 = new SubFamilia2();

  constructor(private spinner: NgxSpinnerService,
              private authService: AuthService,
              private familiaService: SubFamilia1Service,
              private subFamiliaService: SubFamilia2Service,
              private empresaService: EmpresaService,
              private router: Router) { }

  ngOnInit(): void {
    if (sessionStorage.getItem('tipoOperacion')) {
      this.spinner.show();
      this.familiaService.getAll().subscribe(
        familias => {
          this.subFamilias1 = familias;
          
          this.subFamilias1.forEach(sub => {
            sub.descripcionFamilia = sub.familia.descripcion + ' -> ' + sub.descripcion;
          });

          this.type = sessionStorage.getItem('tipoOperacion')!;
          this.handledTitle();

          if (this.type !== "N") {
            if (sessionStorage.getItem('subfamilia')) {
              this.loadInfoSubFamilia();
            } else {
              this.spinner.hide();
              swal.fire('Error', 'Problemas al ingresar a la ventana de sub familias', 'error');
              this.type = 'V';
            }
          }

          this.spinner.hide();
        },
        err => {
          this.spinner.hide();
          swal.fire('Error', err.error.mensaje === undefined ? err.error.message : err.error.mensaje, 'error');
        }
      );
    } else {
      swal.fire('Error', 'Problemas al ingresar a la ventana de sub familias', 'error');
      this.type = 'V';
    }
  }

  private handledTitle(): void {
    if (this.type === 'N') {
      this.title = 'Nueva Sub Familia 2';
    } else if (this.type === 'E') {
      this.title = 'Editar Sub Familia 2'; 
    } else if (this.type === 'V') {
      this.title = 'Ver Sub Familia 2'; 
    }
  }

  private loadInfoSubFamilia(): void {
    this.subFamiliaService.get(Number(sessionStorage.getItem('subfamilia'))).subscribe(
      subFamilia => {
        this.spinner.hide();
        this.subFamilia = subFamilia;
        this.subFamilia.subFamilia1.descripcionFamilia = subFamilia.subFamilia1.familia.descripcion + ' -> ' + subFamilia.subFamilia1.descripcion;
      }, 
      err => {
        this.spinner.hide();
        swal.fire('Error', err.error.mensaje === undefined ? err.error.message : err.error.mensaje, 'error');
        this.type = 'V';
      }
    );
  }

  public cancelar(): void {
    this.router.navigateByUrl("/home/interfaz/lista-subfamilia2");
  }

  public save(): void {
    if (this.type === 'N') {
      this.nuevo();
    } else if (this.type === 'E') {
      this.editar();
    }
  }

  private nuevo(): void {
    this.spinner.show();
    this.subFamilia.idEmpresa = this.empresaService.getEmpresaSeleccionada().idEmpresa;
    this.subFamilia.estado = 'A';
    this.subFamilia.usuarioCreacion = this.authService.usuario.username;

    this.subFamiliaService.create(this.subFamilia).subscribe(
      _data => {
        sessionStorage.setItem('message', 'Sub Familia creada exitosamente!');
        this.spinner.hide();

        this.router.navigateByUrl("/home/interfaz/lista-subfamilia2");
      },
      err => {
        this.spinner.hide();
        swal.fire('Error', err.error.mensaje, 'error');
      }
    );
  }

  private editar(): void {
    this.spinner.show();
    this.subFamiliaService.edit(this.subFamilia).subscribe(
      _data => {
        sessionStorage.setItem('message', 'Sub Familia editada exitosamente!');
        this.spinner.hide();

        this.router.navigateByUrl("/home/interfaz/lista-subfamilia2");
      },
      err => {
        this.spinner.hide();
        swal.fire('Error', err.error.mensaje, 'error');
      }
    );
  }

}
