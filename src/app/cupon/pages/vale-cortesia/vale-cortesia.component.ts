import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';

import { AuthService } from '../../../auth/services/auth.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EmpresaService } from 'src/app/shared/services/empresa.service';
import { ValeService } from '../../services/vale.service';

import { FindPrefijoComponent } from '../../components/find-prefijo/find-prefijo.component';
import { SeleccionarFormatoComponent } from '../../components/seleccionar-formato/seleccionar-formato.component';

import { CabValeVerde } from '../../entity/cabValeVerde';
import { FormatoVale } from '../../entity/formato-vale';
import { Prefijo } from '../../entity/prefijo';

import swal from 'sweetalert2'

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-vale-cortesia',
  templateUrl: './vale-cortesia.component.html',
  styleUrls: ['./vale-cortesia.component.css']
})
export class ValeCortesiaComponent implements OnInit, OnDestroy {

  public title: string = 'Nuevo Prefijo';

  public type: string = 'V';

  public vale: CabValeVerde = new CabValeVerde();

  public feInicio!: Date;

  public feFin!: Date;

  public prefijoSeleccionado!: Prefijo;

  public isMobile: boolean = window.innerWidth < 641

  public url!: string;

  private ref!: DynamicDialogRef;

  constructor(private authService: AuthService,
              private spinner: NgxSpinnerService,
              private valeCortesiaService: ValeService,
              private empresaService: EmpresaService,
              private router: Router,
              public dialogService: DialogService) { }

  ngOnInit(): void {
    this.url = environment.urlCupones;
    
    if (sessionStorage.getItem('tipoOperacion')) {
      this.type = sessionStorage.getItem('tipoOperacion')!;

      this.initFechas();
      this.handledTitle();

      if (this.type !== "N") {
        if (sessionStorage.getItem('vale-cortesia')) {
          this.loadInfoVale();
        } else {
          swal.fire('Error', 'Problemas al ingresar a la ventana de vales de cortesía', 'error');
          this.type = 'V';
        }
      }
    } else {
      swal.fire('Error', 'Problemas al ingresar a la ventana de vales de cortesía', 'error');
      this.type = 'V';
    }
  }

  private initFechas(): void {
    this.feInicio = new Date();
    this.feInicio.setHours(0);
    this.feInicio.setMinutes(0);
    this.feInicio.setSeconds(0);
    this.feInicio.setMilliseconds(0);

    this.feFin = new Date()
    this.feFin.setMonth(this.feFin.getMonth() + 1);
    this.feInicio.setHours(0);
    this.feInicio.setMinutes(0);
    this.feInicio.setSeconds(0);
    this.feInicio.setMilliseconds(0);
  }

  private handledTitle(): void {
    if (this.type === 'N') {
      this.title = 'Nuevo Vale Cortesía';
    } else if (this.type === 'V') {
      this.title = 'Ver Vale Cortesía'; 
    }
  }

  private loadInfoVale(): void {
    this.spinner.show();
    const id = Number(sessionStorage.getItem('vale-cortesia')!)

    this.valeCortesiaService.getVale(id).subscribe(
      vale => {
        this.spinner.hide();
        this.vale = vale;

        this.feInicio = new Date(this.vale.vdesde);
        this.feFin = new Date(this.vale.vhasta);
      }, 
      err => {
        this.spinner.hide();
        swal.fire('Error', err.error.mensaje === undefined ? err.error.message : err.error.mensaje, 'error');
        this.type = 'V';
      }
    );
  }

  public findPrefijo(): void {
    const ref = this.dialogService.open(FindPrefijoComponent, {
        header: 'Buscar Prefijo',
        width: '400px'
    });

    ref.onClose.subscribe((prefijo: Prefijo) => {
      if (prefijo) {
        this.vale.prefijo = prefijo.prefijo;
      } else {
        this.vale.prefijo = '';
      }
    });
  }

  public cancelar(): void {
    this.router.navigateByUrl("/home/cupon/lista-vale-cortesia");
  }

  public save(): void {
    if (this.type === 'N') {
      this.spinner.show();

      this.vale.idEmpresa = this.empresaService.getEmpresaSeleccionada().idEmpresa;
      this.vale.usuario = this.authService.usuario.username;
      this.vale.vdesde = this.feInicio.toISOString();
      this.vale.vhasta = this.feFin.toISOString();

      console.log(this.vale);

      this.valeCortesiaService.generaValeCortesia(this.vale).subscribe(
        _data => {
          sessionStorage.setItem('message', 'Vale creado exitosamente!');
          this.router.navigateByUrl("/home/cupon/lista-vale-cortesia");
          this.spinner.hide();
        },
        err => {
          this.spinner.hide();
          swal.fire(err.error.mensaje, err.error.error, 'error');
        }
      );
    }
  }

  public buscarImagen(): void {
    const ref = this.dialogService.open(SeleccionarFormatoComponent, {
      header: 'Buscar Formato',
      width: '75%'
    });

    ref.onClose.subscribe((formato: FormatoVale) => {
      if (formato) {
        this.vale.idFormato = formato.id;
        this.vale.rutaImagen = formato.nombreAlmacenado;
      } else {
        this.vale.idFormato = -1;
        this.vale.rutaImagen = undefined;
      }
    })
  }

  public limpiarImagen(): void {
    this.vale.rutaImagen = undefined;
    this.vale.idFormato = -1;
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: any) {
      this.isMobile = window.innerWidth < 641;
  }

  ngOnDestroy() {
    if (this.ref) {
        this.ref.close();
    }
  }

}
