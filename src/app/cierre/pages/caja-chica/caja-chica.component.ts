import { DatePipe } from '@angular/common';
import { Component, HostListener, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Tienda } from '../../entity/tienda';
import { ReporteService } from '../../services/reporte.service';
import { EmpresaService } from '../../../shared/services/empresa.service';
import swal from 'sweetalert2';
import { CierreOtro } from '../../entity/cierre-otro';
import { CierreOtroDto } from '../../dto/cierre-otro-dto';
import { CajaChicaService } from '../../services/caja-chica.service';
import { InputNumber } from 'primeng/inputnumber';

@Component({
  selector: 'app-caja-chica',
  templateUrl: './caja-chica.component.html',
  styleUrls: ['./caja-chica.component.css']
})
export class CajaChicaComponent implements OnInit {

  public tiendaList: Tienda[] = [];

  public tiendaSeleccionada!: Tienda;

  public cajaChicaList: CierreOtro[] = [];
  
  public cuadraturaSeleccionada!: CierreOtro;

  public fechaSeleccionada!: Date;

  public montoIngresado!: number;

  public codAutorizacion!: string;

  private pipe = new DatePipe("en-US");

  public isMobile: boolean = window.innerWidth < 641;

  @ViewChild('monto') selMonto: InputNumber;

  constructor(private spinner: NgxSpinnerService,
              private empresaService: EmpresaService,
              private cajaChicaService: CajaChicaService,
              private reporteService: ReporteService,
              private authService: AuthService
              ) { }

  ngOnInit(): void {
    this.fechaSeleccionada = new Date();
    this.codAutorizacion = this.genearAutorizacion();

    this.spinner.show();
    this.reporteService.getTiendasPorEmpresa(this.empresaService.getEmpresaSeleccionada().idEmpresa, this.authService.getUsuarioInterface()).subscribe(
      tiendaList => {
        this.tiendaList = tiendaList;
        this.tiendaSeleccionada = this.tiendaList[0];
        
        this.listarCajaChica();
      },
      _err => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al obtener la información de las tiendas', 'error');
      }
    );
  }

  private genearAutorizacion() {
    const chars: string = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const length: number = 10;
    let result: string = '';

    for (var i = length; i > 0; --i) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
      
    return result.toUpperCase();
  }

  public listarCajaChica(): void {
    if (this.tiendaSeleccionada === undefined || this.tiendaSeleccionada === null) {
      this.spinner.hide();
      return;
    }

    const cierreOtroDto: CierreOtroDto = new CierreOtroDto();
    cierreOtroDto.idEmpresa = this.empresaService.getEmpresaSeleccionada().idEmpresa;
    cierreOtroDto.idTienda = this.tiendaSeleccionada.tienda;   
    cierreOtroDto.fechaInicio = this.pipe.transform(this.fechaSeleccionada, "dd/MM/yyyy") || '';
    
    this.spinner.show();
    this.cajaChicaService.getCierreOtraCierreCaja(cierreOtroDto).subscribe(
      json => {
        this.cajaChicaList = json.data;
        this.spinner.hide();
      },
      err => {
        this.spinner.hide();
        swal.fire(err.error.mensaje, err.error.error, 'error');
      }
    );  
  }

  public aceptarCajaChica(){
    if (!this.montoIngresado) {
      swal.fire({
        title: 'Advertencia',
        text: 'Ingrese un valor para el campo monto',
        icon: 'warning',
        didClose: () => { this.selMonto.input.nativeElement.focus(); }
      });
      return;
    }

    this.spinner.show();

    let otro: CierreOtro = new CierreOtro();
    otro.empresa.idEmpresa = this.empresaService.getEmpresaSeleccionada().idEmpresa;
    otro.tienda = this.tiendaSeleccionada;
    otro.moneda.idMoneda = 1;
    otro.fechaParam = this.pipe.transform(this.fechaSeleccionada, "yyyyMMdd")
    otro.fechaVenta = this.fechaSeleccionada;
    otro.motivo.idMotivo = 4;
    otro.codigoAutorizacion = this.codAutorizacion;
    otro.monto = this.montoIngresado;
    otro.idUsuario = parseInt(this.authService.usuario.user.codigo);
    otro.empleadoCajaChica = this.authService.usuario.user.fullName.toUpperCase();

    this.cajaChicaService.saveCajaChica(otro).subscribe(
      respuesta => {
        if (respuesta.status == 'I'){ //Grabo ok
          swal.fire('Caja chica', "Se guardó correctamente la caja chica", 'warning');  
          this.listarCajaChica();
          this.codAutorizacion = this.genearAutorizacion();        
        }
        else{ //Warning de validación
          swal.fire('Alerta', respuesta.mensaje, 'warning');
        }
        this.spinner.hide();
      },
      err => {
        this.spinner.hide();
        swal.fire(err.error.mensaje, err.error.error, 'error');
      }
    )
  }

  public anularCajaChica(){
    if (!this.cuadraturaSeleccionada) {      
      swal.fire('Advertencia','Debe seleccionar un registro para anular','warning');      
      return;
    }

    if (this.cuadraturaSeleccionada.estado == 0){
      swal.fire('Advertencia','El registro seleccionado ya está anulado','warning');      
      return;
    }

    swal.fire({
      title: 'Anular registro',
      text: '¿Está seguro que desea anular este registro?',
      icon: 'question',
      showCancelButton: true
    }).then(respuesta => {
      if (respuesta.isConfirmed){
        this.spinner.show();

        let otro: CierreOtro = new CierreOtro();
        otro.idCierre = this.cuadraturaSeleccionada.idCierre;
        otro.idCajaChica = this.cuadraturaSeleccionada.idCajaChica;
        otro.empresa.idEmpresa = this.cuadraturaSeleccionada.empresa.idEmpresa;
        otro.tienda.tienda = this.cuadraturaSeleccionada.tienda.tienda;
        otro.fechaParam = this.pipe.transform(this.cuadraturaSeleccionada.fechaVenta, "dd/MM/yyyy");

        this.cajaChicaService.cajaChicaUsada(otro).subscribe(
          esUsada => {
            if (esUsada){
              this.spinner.hide();
              swal.fire('Advertencia','Este registro está siendo utilizado, no puede anularse','warning');
              return;
            }
            else{
              this.cajaChicaService.updateEstadoCajaChica(otro).subscribe(
                respuesta => {                  
                  this.listarCajaChica();
                  this.spinner.hide();
                },
                error => {
                  this.spinner.hide();
                  swal.fire('Error', 'Se produjo un error al actualizar la caja chica','error');
                }      
              )
            }
          },
          error => {
            this.spinner.hide();
            swal.fire('Error', 'Se produjo un error al consultar la caja chica','error');
          }
        )        
      }
    })
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: any) {
      this.isMobile = window.innerWidth < 641;
  }

}
