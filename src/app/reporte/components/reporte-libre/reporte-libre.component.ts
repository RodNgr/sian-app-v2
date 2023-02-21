import { Component, OnInit } from '@angular/core';
//import { ReporteStandardService } from '../../services/reporte-standard.service';
import { NgxSpinnerService } from 'ngx-spinner';
import swal from 'sweetalert2';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
//import { ReporteDto } from '../../dto/reporte-dto';
import { AuthService } from '../../../auth/services/auth.service';
import { Tienda } from '../../entity/tienda';
import { ReporteService } from '../../services/reporte.service';
import { Reporte } from '../../entity/reporte';
import { ReporteTienda } from '../../entity/reporte-tienda';
import { EmpresaService } from 'src/app/shared/services/empresa.service';

interface Tipo {
  codigo: string;
  descripcion: string;
}

@Component({
  selector: 'app-reporte-libre',
  templateUrl: './reporte-libre.component.html',
  styleUrls: ['./reporte-libre.component.css']
})
export class ReporteLibreComponent implements OnInit {

  public tiendaList: Tienda[] = [];

  public tiendaSeleccionadaList: Tienda[] = [];

  public tipoList: Tipo[] = [{codigo: 'T', descripcion: 'Transacción'}, {codigo: 'C', descripcion: 'Consulta'}];

  public tipoSeleccionado: Tipo = {codigo: 'T', descripcion: 'Transacción'};

  public baseList: Tipo[] = [{codigo: 'M', descripcion: 'MySQL'}, {codigo: 'S', descripcion: 'Sybase'}];

  public baseSeleccionado: Tipo = {codigo: 'M', descripcion: 'MySQL'};

  public uploadedFile!: File;

  public content!: string;

  public lan: string[] = ['sql'];

  public checked: boolean = false;

  public usuario!: string;

  public password!: string;

  constructor(private spinner: NgxSpinnerService,
              private reporteService: ReporteService,
              private authService: AuthService,
              private empresaService: EmpresaService,
              public ref: DynamicDialogRef, 
              public config: DynamicDialogConfig) { }

  ngOnInit(): void {
    this.spinner.show();
    
    this.reporteService.getTiendas().subscribe(
      tiendaList => {
        this.tiendaList = tiendaList;
        this.spinner.hide();
      },
      _err => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al obtener la información de las tiendas', 'error');
      }
    )
  }

  public aceptar(): void {
    if (!this.tiendaSeleccionadaList) {
      swal.fire('Advertencia!', 'Debe seleccionar por lo menos una tienda', 'warning');
      return;
    }

    if (this.tiendaSeleccionadaList.length === 0) {
      swal.fire('Advertencia!', 'Debe seleccionar por lo menos una tienda', 'warning');
      return;
    }

    if (!this.content) {
      swal.fire('Advertencia!', 'Debe agregar el script de base de datos', 'warning');
      return;
    }

    if (this.checked && !this.usuario) {
      swal.fire('Advertencia!', 'Debe ingresar el usuario', 'warning');
      return;
    }

    if (this.checked && !this.password) {
      swal.fire('Advertencia!', 'Debe ingresar la clave', 'warning');
      return;
    }

    this.ref.close(this.buildReporteDto());
  }

  public cancelar(): void {
    this.ref.close();
  }

  private buildReporteDto(): Reporte {
    const reporteDto: Reporte = new Reporte();

    reporteDto.idEmpresa = this.empresaService.getEmpresaSeleccionada().idEmpresa;
    reporteDto.idUsuario = this.authService.usuario.username;
    reporteDto.query = this.content;
    reporteDto.inBaseDatos = this.baseSeleccionado.codigo;
    reporteDto.tiReporte = this.tipoSeleccionado.codigo;

    if (this.checked) {
      reporteDto.usuario = this.usuario;
      reporteDto.clave = this.password;
    }

    reporteDto.reporteTiendaList = [];
    this.tiendaSeleccionadaList.forEach(tienda => {
      let reporteTienda: ReporteTienda = new ReporteTienda();
      reporteTienda.idEmpresa = reporteDto.idEmpresa;
      reporteTienda.clienteSap = tienda.pk.clienteSap;

      reporteDto.reporteTiendaList.push(reporteTienda);
    });

    return reporteDto;
  }

  public onUpload(event: any) {
    this.uploadedFile = event.files[0];
    this.content = '';

    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.content = fileReader.result?.toString() || '';
    }

    fileReader.readAsText(this.uploadedFile);
  }

}
