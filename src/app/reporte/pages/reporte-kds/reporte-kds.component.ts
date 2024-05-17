import { Component, OnInit } from '@angular/core';
import { kds } from '../../entity/kds';
import { NgxSpinnerService } from 'ngx-spinner';
import { EmpresaService } from 'src/app/shared/services/empresa.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { ParamDto } from '../../dto/param-dto';
import { ReporteService } from '../../services/reporte.service';
import { Console } from 'console';
import { Tienda } from '../../entity/tienda';


@Component({
  selector: 'app-reporte-kds',
  templateUrl: './reporte-kds.component.html',
  styleUrls: ['./reporte-kds.component.css']
})
export class ReporteKdsComponent implements OnInit {

  public KdsList: kds[] = [];

  public cantidadMap = {
    '=0': 'No existen registros KDS',
    '=1': 'En total hay 1 registro KDS',
    'other': 'En total hay # de registros KDS'
  }

  public rangeDates: Date[] = [];

  public isMobile: boolean = window.innerWidth < 641
  public tiendaList: Tienda[] = [];
  public tiendaSeleccionada: Tienda[] = [];
  private pipe = new DatePipe("en-US");
  public feInicio: Date = new Date();
  public feFin: Date = new Date();

  constructor(private spinner: NgxSpinnerService,
              private empresaService: EmpresaService,
              private authService: AuthService,
              private reporteService: ReporteService){ }

  ngOnInit(): void {

    this.spinner.show();      
      this.reporteService.getTiendasPorEmpresakds(this.empresaService.getEmpresaSeleccionada().idEmpresa, this.authService.getUsuarioInterface()).subscribe(
      tiendaList => {
        this.tiendaList = tiendaList;

        this.spinner.hide();
      },
      _err => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al obtener la información de las tiendas', 'error');
      }
    );
  }

  public changeTienda(): void {     
  }

  public buscar(): void {
    let dto: ParamDto = new ParamDto();


    dto.feInicio = this.pipe.transform(this.feInicio, 'yyyyMMdd') || '';  
    dto.feFin = this.pipe.transform(this.feFin, 'yyyyMMdd') || '';  
    dto.tiendaList = this.tiendaSeleccionada;

    this.spinner.show();
      this.reporteService.getReporteKDS(dto).subscribe(
        response => {
          this.KdsList = response.lista;          
          console.log(this.KdsList);
          this.spinner.hide()
        },
        _err => {
          this.spinner.hide();
          swal.fire('Error', 'Problemas al ejecutar el reporte', 'error');
        }
      );
    
    
  }

}
