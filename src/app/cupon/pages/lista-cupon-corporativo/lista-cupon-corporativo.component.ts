import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';

import { AuthService } from 'src/app/auth/services/auth.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ValeService } from '../../services/vale.service';

import { AmpliarFechaComponent } from '../../components/ampliar-fecha/ampliar-fecha.component';
import { AnulacionProvisional } from '../../dto/anulacion-provisional';
import { AnularValeProvisionalComponent } from '../../components/anular-vale-provisional/anular-vale-provisional.component';
import { AprobarValeComponent } from '../../components/aprobar-vale/aprobar-vale.component';
import { ReimprimirValeComponent } from '../../components/reimprimir-vale/reimprimir-vale.component';
import { ViewPdfComponent } from 'src/app/shared/components/view-pdf/view-pdf.component';

import { DatePipe } from '@angular/common';

import { CabValeVerde } from '../../entity/cabValeVerde';
import { Cell, Workbook } from 'exceljs';
import { ValeCorporativo } from '../../dto/vale-corporativo';

import swal from 'sweetalert2';

import * as fs from 'file-saver';

import { environment } from 'src/environments/environment';

interface Estado {
  name: string;
}

@Component({
  selector: 'app-lista-cupon-corporativo',
  templateUrl: './lista-cupon-corporativo.component.html',
  styleUrls: ['./lista-cupon-corporativo.component.css']
})
export class ListaCuponCorporativoComponent implements OnInit, OnDestroy {

  public cabValeVerdeList: CabValeVerde[] = [];

  public valeSelected!: CabValeVerde;

  public estados: Estado[] = [{name: 'TODOS'}, {name: 'NUEVO'}, {name: 'APROBADO'}, {name: 'ANULADO'}, {name: 'IMPRESO'}]

  public rangeDates: Date[] = [];

  public descripcion: string = '';

  public estadoSelected: Estado = {name: 'TODOS'};

  private ref!: DynamicDialogRef;

  public cantidadMap = {
    '=0': 'No existen vales',
    '=1': 'En total hay 1 vale',
    'other': 'En total hay # vales'
  }

  private pipe = new DatePipe("en-US");

  public isMobile: boolean = window.innerWidth < 641

  constructor(public authService: AuthService,
              private spinner: NgxSpinnerService,
              private valeCorporativoService: ValeService,
              private dialogService: DialogService,
              private router: Router) { }

  ngOnInit(): void {
    if (sessionStorage.getItem('message')) {
      swal.fire('Éxito!', sessionStorage.getItem('message')!, 'success');
      sessionStorage.removeItem('message');
    }

    sessionStorage.removeItem('tipoOperacion');
    sessionStorage.removeItem('vale-corporativo');

    const feInicio = new Date();
    const feFin = new Date();

    feInicio.setDate(1);

    this.rangeDates.push(feInicio);
    this.rangeDates.push(feFin);

    this.buscar();
  }

  public buscar(): void {
    this.spinner.show();
    const desde = this.pipe.transform(this.rangeDates[0], "yyyyMMdd") || '';
    const hasta = this.pipe.transform(this.rangeDates[1], "yyyyMMdd") || '';

    this.valeCorporativoService.getValesCorporativos(desde, hasta, this.descripcion, this.estadoSelected.name).subscribe (
      vales => {
        this.cabValeVerdeList = vales;
        this.spinner.hide();
      },
      _err => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al obtener los vales corporativos', 'error');
      }
    )
  }

  public newVale(): void {
    sessionStorage.setItem('tipoOperacion', 'N');
    this.router.navigateByUrl('/home/cupon/cupon-corporativo')
  }

  public viewVale(): void {
    if (!this.valeSelected) {
      swal.fire('Alerta!', 'Debe seleccionar un vale', 'warning');
      return;
    }

    sessionStorage.setItem('tipoOperacion', 'V');
    sessionStorage.setItem('vale-corporativo', this.valeSelected.id.toString());
    this.router.navigateByUrl('/home/cupon/cupon-corporativo')
  }

  public anularVale(): void {
    if (!this.valeSelected) {
      swal.fire('Alerta!', 'Debe seleccionar un vale', 'warning');
      return;
    } else if (this.valeSelected.anulado) {
      swal.fire('Alerta!', 'El vale ya se encuentra anulado', 'warning');
      return;
    }
    
    if (this.valeSelected.clasificacion === 1) {
      this.anularValeFinal();
    } else {
      this.anularValeProvisional();
    }
  }

  private anularValeFinal() {
    swal.fire({
      title: '¿Está seguro de anular este vale?',
      html: 'Esta acción no se puede deshacer',
      showCancelButton: true,
      icon: 'question',
      confirmButtonText: `Aceptar`,
      cancelButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.show();

        this.valeSelected.usuario = this.authService.usuario.username;
        
        this.valeCorporativoService.anulaVale(this.valeSelected).subscribe(
          _data => {
            this.spinner.hide();
            this.valeSelected.anulado = true;
            swal.fire('Éxito!', 'Vale anulado exitosamente!', 'success');            
          },
          err => {
            this.spinner.hide();
            swal.fire(err.error.mensaje, err.error.error, 'error');
          }
        );
      }
    });
  }

  private anularValeProvisional() {
    this.ref = this.dialogService.open(AnularValeProvisionalComponent, {
      header: 'Anular Vale Provisional',
      width: '80%', 
      contentStyle: {"max-height": "500px", "overflow": "auto"},
      data: this.valeSelected
    });

    this.ref.onClose.subscribe((dto: AnulacionProvisional) => {
      if (dto) {
        dto.id = this.valeSelected.id;
        dto.usuarioId = this.authService.usuario.username;

        dto.serie = dto.documento.serie;
        dto.correlativo = dto.documento.correlativo;
        dto.docCobranza = dto.documento.serie + '-' + dto.documento.correlativo;
        dto.fechaEmision = this.pipe.transform(dto.documento.fechaEmision, 'yyyyMMdd') || '';
        dto.monto = dto.documento.vaMontoTotal;

        this.spinner.show();
        this.valeCorporativoService.anulaValeProvisional(dto).subscribe(
          _response => {
            this.spinner.hide();
            swal.fire('Éxito!', 'Vale Provisional anulado exitosamente', 'success')
          }, 
          err => {
            this.spinner.hide();
            swal.fire('Error', err.error.error, 'error');
          }
        )
      }
    });
  }

  public exportXLS(): void {
    if (!this.valeSelected) {
      swal.fire('Alerta!', 'Debe seleccionar un vale', 'warning');
      return;
    }

    if (this.valeSelected.subTipDoc != 1) {
      swal.fire('Alerta!', 'No se puede visualizar porque el vale es físico', 'warning');
      return;
    }

    this.spinner.show();

    this.valeCorporativoService.getValesCorporativosVirtuales(this.valeSelected.id).subscribe(
      data => {
        let workbook = new Workbook();
        let worksheet = workbook.addWorksheet('Vales Digitales');
    
        worksheet.addRow(["Cod. Barra", "Total", "Observación"]);
        worksheet.columns = [{ width: 30 }, { width: 10 }, { width: 40 }];
        
        worksheet.getRow(1).eachCell(function(cell: Cell, _colNumber: number) {
          cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
          cell.font = { size: 8, bold: true,  name: 'Arial' };
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
          cell.fill = {type: 'pattern', pattern:'solid', fgColor:{argb:'CCCCCC'}};
        });

        // Contenido del archivo
        let contador: number = 2;
        data.forEach(vale => {
          let codbarra = vale.codBarra.replace('%', '');
          codbarra = codbarra.replace('*', '');
          codbarra = codbarra.replace('*', '');

          worksheet.addRow([codbarra, vale.total, vale.observacion]);
    
          worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
            cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
            cell.font = { size: 8,  name: 'Arial' };
          });
    
          contador++;
        })
        
        workbook.xlsx.writeBuffer().then((data) => {
          let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          fs.saveAs(blob, 'Vales_' + this.pipe.transform(new Date(), 'yyyyMMddHHmmss') + '.xlsx');
        });

        this.spinner.hide();
      },
      err => {
        this.spinner.hide();
        swal.fire(err.error.mensaje, err.error.error, 'error');
      }
    );
  }

  public aprobarVale(): void {
    if (!this.valeSelected) {
      swal.fire('Alerta!', 'Debe seleccionar un vale', 'warning');
      return;
    } else if (this.valeSelected.anulado) {
      swal.fire('Alerta!', 'No se puede aprobar un vale anulado', 'warning');
      return;
    } else if (this.valeSelected.isprint) {
      swal.fire('Alerta!', 'No se puede aprobar un vale impreso', 'warning');
      return;
    } else if (this.valeSelected.aprobado) {
      swal.fire('Alerta!', 'El vale ya se encuentra aprobado', 'warning');
      return;
    } else {
      this.ref = this.dialogService.open(AprobarValeComponent, {
        header: 'Aprobar Vale',
        width: '50%', 
        contentStyle: {"max-height": "500px", "overflow": "auto"},
        data: this.valeSelected
      });

      this.ref.onClose.subscribe((tipo: number) => {
        if (tipo) {
          this.spinner.show();

          this.valeSelected.usuario = this.authService.usuario.username;
          this.valeSelected.clasificacion = tipo;

          this.valeCorporativoService.aprobarVale(this.valeSelected).subscribe(
            _data => {
              this.spinner.hide();
              this.valeSelected.aprobado = true;
              swal.fire('Éxito!', 'Vale aprobado exitosamente!', 'success');            
            },
            err => {
              this.spinner.hide();
              swal.fire(err.error.mensaje, err.error.error, 'error');
            }
          );
        }
      });
    }
  }

  public imprimirVale(): void {
    if (!this.valeSelected) {
      swal.fire('Alerta!', 'Debe seleccionar un vale', 'warning');
      return;
    } else if (this.valeSelected.isprint) {
      swal.fire('Alerta!', 'El vale ya se encuentra impreso, por favor seleccione la opción reimprimir', 'warning');
      return;
    } else if (this.valeSelected.anulado) {
      swal.fire('Alerta!', 'No se puede imprimir un vale anulado', 'warning');
      return;
    } else if (!this.valeSelected.aprobado) {
      swal.fire('Alerta!', 'No se puede imprimir porque el vale no ha sido aprobado', 'warning');
      return;
    }

    this.valeSelected.usuario = this.authService.usuario.username;
    
    this.spinner.show();
    this.valeCorporativoService.imprimirVale(this.valeSelected).subscribe(
      rpta => {
        this.spinner.hide();

        this.valeSelected.isprint = true;
        this.ref = this.dialogService.open(ViewPdfComponent, {
          header: 'Imprimir Vale',
          width: '75%',
          contentStyle: {"overflow": "auto"},
          data: environment.urlCupones + '/api/vale/corporativo/show/' + rpta.mensaje
        });

        if (this.valeSelected.subTipDoc == 1) {
          let archivo: String = rpta.mensaje;
          archivo = archivo.replace(".pdf", ".zip");

          window.location.href = environment.urlCupones + '/api/vale/corporativo/download/' + archivo;
        }
      }, 
      err => {
        this.spinner.hide();
        swal.fire(err.error.mensaje, err.error.error, 'error');
      }
    );
  }
  
  public reimprimir(): void {
    if (!this.valeSelected) {
      swal.fire('Alerta!', 'Debe seleccionar un vale', 'warning');
      return;
    } else if (!this.valeSelected.isprint) {
      swal.fire('Alerta!', 'No se puede reimprimir porque el vale no ha sido impreso', 'warning');
      return;
    }

    this.ref = this.dialogService.open(ReimprimirValeComponent, {
      header: 'Reimprimir Vale',
      width: '50%', 
      contentStyle: {"max-height": "500px", "overflow": "auto"},
      
      data: this.valeSelected
    });

    this.ref.onClose.subscribe((valeCorporativo: ValeCorporativo) => {
      if (valeCorporativo) {
        this.spinner.show();

        valeCorporativo.vale.usuario = this.authService.usuario.username;

        this.valeCorporativoService.reimprimirVale(valeCorporativo).subscribe(
          rpta => {
            this.spinner.hide();

            this.ref = this.dialogService.open(ViewPdfComponent, {
              header: 'Imprimir Vale',
              width: '75%',
              contentStyle: {"overflow": "auto"},
              data: environment.urlCupones + '/api/vale/corporativo/show/' + rpta.mensaje
            });

            if (this.valeSelected.subTipDoc == 1) {
              let archivo: String = rpta.mensaje;
              archivo = archivo.replace(".pdf", ".zip");

              window.location.href = environment.urlCupones + '/api/vale/corporativo/download/' + archivo;
            }
          },
          err => {
            this.spinner.hide();
            swal.fire(err.error.mensaje, err.error.error, 'error');
          }
        );
      }
    });
  }

  public ampliarFecha(): void {
    if (!this.valeSelected) {
      swal.fire('Alerta!', 'Debe seleccionar un vale', 'warning');
      return;
    } else if (this.valeSelected.anulado) {
      swal.fire('Alerta!', 'No se puede ampliar la fecha a un vale anulado', 'warning');
      return;
    } else if (!this.valeSelected.aprobado) {
      swal.fire('Alerta!', 'No se puede ampliar la fecha a un vale no aprobado', 'warning');
      return;
    } else {
      this.ref = this.dialogService.open(AmpliarFechaComponent, {
        header: 'Ampliar Fecha de Vale',
        width: '25%', 
        contentStyle: {"max-height": "300px", "overflow": "auto"},
        data: this.valeSelected
      });

      this.ref.onClose.subscribe((fecha: Date) => {
          if (!fecha) {
            return;
          }

          this.spinner.show();
          this.valeSelected.usuario = this.authService.usuario.username;
          this.valeSelected.vhasta = fecha.toISOString();

          this.valeCorporativoService.ampliarFecha(this.valeSelected).subscribe(
            _data => {
              this.spinner.hide();
              swal.fire('Éxito!', 'Fecha del vale ampliada exitosamente!', 'success');            
            },
            err => {
              this.spinner.hide();
              swal.fire(err.error.mensaje, err.error.error, 'error');
            }
          );
      });
    }    
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
