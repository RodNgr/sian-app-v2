import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';

import { AuthService } from 'src/app/auth/services/auth.service';
import { EmpresaService } from 'src/app/shared/services/empresa.service';
import { SubFamilia3Service } from '../../services/sub-familia3.service';
import { SubFamilia4Service } from '../../services/sub-familia4.service';

import { SubFamilia3 } from '../../entity/sub-familia3';
import { SubFamilia4 } from '../../entity/sub-familia4';

import swal from 'sweetalert2';

@Component({
  selector: 'app-sub-familia4',
  templateUrl: './sub-familia4.component.html',
  styleUrls: ['./sub-familia4.component.css']
})
export class SubFamilia4Component implements OnInit {

  public title: string = 'Nuevo Sub Familia 4';

  public type: string = 'V';

  public subFamilias3: SubFamilia3[] = [];

  public subFamilia: SubFamilia4 = new SubFamilia4();

  constructor(private spinner: NgxSpinnerService,
              private authService: AuthService,
              private familiaService: SubFamilia3Service,
              private subFamiliaService: SubFamilia4Service,
              private empresaService: EmpresaService,
              private router: Router) { }

  ngOnInit(): void {
    if (sessionStorage.getItem('tipoOperacion')) {
      this.spinner.show();
      this.familiaService.getAll().subscribe(
        familias => {
          this.subFamilias3 = familias;

          this.subFamilias3.forEach(sub => {
            sub.descripcionFamilia = sub.subFamilia2.subFamilia1.familia.descripcion + ' -> ' + sub.subFamilia2.subFamilia1.descripcion + ' -> ' + sub.subFamilia2.descripcion
              + ' -> ' + sub.descripcion;
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
      this.title = 'Nueva Sub Familia 4';
    } else if (this.type === 'E') {
      this.title = 'Editar Sub Familia 4'; 
    } else if (this.type === 'V') {
      this.title = 'Ver Sub Familia 4'; 
    }
  }

  private loadInfoSubFamilia(): void {
    this.subFamiliaService.get(Number(sessionStorage.getItem('subfamilia'))).subscribe(
      subFamilia => {
        this.spinner.hide();
        this.subFamilia = subFamilia;

        this.subFamilia.subFamilia3.descripcionFamilia = subFamilia.subFamilia3.subFamilia2.subFamilia1.familia.descripcion + ' -> ' + 
          subFamilia.subFamilia3.subFamilia2.subFamilia1.descripcion + ' -> ' + subFamilia.subFamilia3.subFamilia2.descripcion + ' -> ' + 
          subFamilia.subFamilia3.descripcion;
      }, 
      err => {
        this.spinner.hide();
        swal.fire('Error', err.error.mensaje === undefined ? err.error.message : err.error.mensaje, 'error');
        this.type = 'V';
      }
    );
  }

  public cancelar(): void {
    this.router.navigateByUrl("/home/interfaz/lista-subfamilia4");
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

        this.router.navigateByUrl("/home/interfaz/lista-subfamilia4");
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

        this.router.navigateByUrl("/home/interfaz/lista-subfamilia4");
      },
      err => {
        this.spinner.hide();
        swal.fire('Error', err.error.mensaje, 'error');
      }
    );
  }

}
