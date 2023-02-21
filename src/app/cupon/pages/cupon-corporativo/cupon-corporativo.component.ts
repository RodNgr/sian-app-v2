import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';

import { AuthService } from '../../../auth/services/auth.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ValeService } from '../../services/vale.service';

import { FindDocumentoCobranzaComponent } from '../../components/find-documento-cobranza/find-documento-cobranza.component';

import { CabValeVerde } from '../../entity/cabValeVerde';
import { DetalleVale } from '../../dto/detalle-vale';
import { DocumentoSAP } from '../../dto/documento-sap';
import { ValeCorporativo } from '../../dto/vale-corporativo';

import swal from 'sweetalert2';

@Component({
  selector: 'app-cupon-corporativo',
  templateUrl: './cupon-corporativo.component.html',
  styleUrls: ['./cupon-corporativo.component.css']
})
export class CuponCorporativoComponent implements OnInit, OnDestroy {

  public vale: CabValeVerde = new CabValeVerde();

  public detalles: DetalleVale[] = [];

  public title: string = '';

  public type: string = 'V';

  public feInicio: Date = new Date();

  public feFin: Date = new Date();

  public estadoVale: string = 'NUEVO';

  public esDigital: boolean = false;

  private ref!: DynamicDialogRef;

  constructor(private spinner: NgxSpinnerService,
              private authService: AuthService,
              private valeService: ValeService,
              private dialogService: DialogService,
              private router: Router) { }

  public isMobile: boolean = window.innerWidth < 641

  ngOnInit(): void {
    if (sessionStorage.getItem('tipoOperacion')) {
      this.type = sessionStorage.getItem('tipoOperacion')!;
      
      this.initFechas();
      this.handledTitle();

      if (this.type !== "N") {
        if (sessionStorage.getItem('vale-corporativo')) {
          this.loadInfoVale();
        } else {
          swal.fire('Error', 'Problemas al ingresar a la ventana de vales corporativos', 'error');
          this.type = 'V';
        }
      }
    } else {
      swal.fire('Error', 'Problemas al ingresar a la ventana de vales corporativos', 'error');
      this.type = 'V';
    }
  }

  private loadInfoVale(): void {
    this.spinner.show();
    const id = Number(sessionStorage.getItem('vale-corporativo')!)

    this.valeService.getVale(id).subscribe(
      vale => {
        this.vale = vale;

        this.feInicio = new Date(this.vale.vdesde);
        this.feFin = new Date(this.vale.vhasta);
        this.esDigital = vale.subTipDoc === 1;

        this.valeService.getDetalleVales(this.vale.id).subscribe(
          detalles => {
            this.spinner.hide();
            this.detalles = detalles;
          }, 
          err => {
            this.spinner.hide();
            swal.fire('Error', err.error.mensaje === undefined ? err.error.message : err.error.mensaje, 'error');
            this.type = 'V';
          }
        );
      }, 
      err => {
        this.spinner.hide();
        swal.fire('Error', err.error.mensaje === undefined ? err.error.message : err.error.mensaje, 'error');
        this.type = 'V';
      }
    );
  }

  private initFechas(): void {
    this.feInicio = new Date();
    this.feInicio.setHours(0);
    this.feInicio.setMinutes(0);
    this.feInicio.setSeconds(0);
    this.feInicio.setMilliseconds(0);

    this.feFin = new Date()
    this.feFin.setMonth(this.feFin.getMonth() + 4);
    this.feInicio.setHours(0);
    this.feInicio.setMinutes(0);
    this.feInicio.setSeconds(0);
    this.feInicio.setMilliseconds(0);
  }

  private handledTitle(): void {
    if (this.type === 'N') {
      this.title = 'Nuevo Vale Corporativo';
    } else if (this.type === 'V') {
      this.title = 'Ver Vale Corporativo'; 
    }
  }

  public changeFechaInicio(): void {
    this.feFin = new Date();
    this.feFin.setDate(this.feInicio.getDate());
    this.feFin.setMonth(this.feInicio.getMonth());
    this.feFin.setFullYear(this.feInicio.getFullYear());

    this.feFin.setMonth(this.feFin.getMonth() + 4);
  }

  public guardar(): void {
    if (this.detalles.length === 0) {
      swal.fire('Alerta!', 'Debe seleccionar el documento de cobranza', 'warning');
      return;
    }

    this.spinner.show();
    this.vale.usuario = this.authService.usuario.username;
    this.vale.vdesde = this.feInicio.toISOString();
    this.vale.vhasta = this.feFin.toISOString();
    this.vale.subTipDoc = this.esDigital ? 1 : 0;    

    const valeCorporativo: ValeCorporativo = new ValeCorporativo();
    valeCorporativo.vale = this.vale;
    valeCorporativo.detalles = this.detalles;

    this.valeService.generarValeCorporativo(valeCorporativo).subscribe(
      _data => {
        sessionStorage.setItem('message', 'Vale creado exitosamente!');
        this.router.navigateByUrl("/home/cupon/lista-cupon-corporativo");
        this.spinner.hide();
      },
      err => {
        this.spinner.hide();
        swal.fire(err.error.mensaje, err.error.error, 'error');
      }
    );
  }

  public seleccionarDocumentoSAP(): void {
    this.ref = this.dialogService.open(FindDocumentoCobranzaComponent, {
      header: 'Búsqueda en SAP',
      width: '80%', 
      contentStyle: {"max-height": "500px", "overflow": "auto"}
    });

    this.ref.onClose.subscribe((documento: DocumentoSAP) =>{
        if (documento) {
          this.vale.nrofactura = documento.serie + '-' + documento.correlativo;
          this.vale.serie = documento.serie;
          this.vale.correlativo = documento.correlativo;
          this.vale.tipoDocumento = documento.tipoDocumento;
          this.vale.tipodoc = documento.tipo;
          this.vale.fechaEmision = documento.fechaEmision;
          this.vale.moneda = documento.moneda;
          this.vale.montoTotal = documento.vaMontoTotal;
          this.vale.ruc = documento.ruc;
          this.vale.razonSocial = documento.razonSocial;
          
          const detalle: DetalleVale = new DetalleVale();
          detalle.codigo = documento.coProducto;
          detalle.descripcion = documento.noProducto;
          detalle.precio = documento.vaPrecioUnitariovale;
          detalle.cantidad = documento.caVale;
          detalle.total = documento.vaPrecioUnitariovale * documento.caVale;

          this.detalles = [];
          this.detalles.push(detalle);
        }
    });
  }

  public cancelar(): void {
    this.router.navigateByUrl('/home/cupon/lista-cupon-corporativo');
  }

  ngOnDestroy() {
    if (this.ref) {
        this.ref.close();
    }
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: any) {
      this.isMobile = window.innerWidth < 641;
  }
  
}
