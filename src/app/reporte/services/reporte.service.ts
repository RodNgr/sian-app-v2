import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { environment } from 'src/environments/environment';
import { Reporte } from '../entity/reporte';
import { Tienda } from '../entity/tienda';
import { EmpresaService } from '../../shared/services/empresa.service';
import { ParamDto } from '../dto/param-dto';
import { MethodPay } from '../entity/method-pay';
import { TreeNode } from 'primeng/api';
import { map } from 'rxjs/operators';
import { CallVentasBaseDto } from '../dto/call-ventas-base-dto';
import { ProcesoAutomatico } from '../entity/procesoautomatico';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {

  private urlEndPoint: string;

  constructor(private http: HttpClient,
              private empresaService: EmpresaService,
              private authService: AuthService) {
    this.urlEndPoint = environment.urlReporte;
  }

  getTiendas(): Observable<Tienda[]> {
    const idEmpresa = this.empresaService.getEmpresaSeleccionada().idEmpresa;
    return this.http.get<Tienda[]>(`${this.urlEndPoint}/api/tienda/${idEmpresa}/${this.authService.getUsuarioInterface()}`);
  }

  getTiendasPorEmpresa(idEmpresa: number): Observable<Tienda[]> {
    return this.http.get<Tienda[]>(`${this.urlEndPoint}/api/tienda/${idEmpresa}/${this.authService.getUsuarioInterface()}`);
  }

  getTiendasAgregador(idEmpresa: number): Observable<Tienda[]> {
    const empresaNombre = this.empresaService.getEmpresa(idEmpresa).nombre;
    return this.http.get<Tienda[]>(`${this.urlEndPoint}/api/tienda/agregador/${idEmpresa}/${this.authService.getUsuarioInterface()}`)
    .pipe(
      map(response => {
        let tiendas = response as Tienda[];

        return tiendas.map(tienda => {
          tienda.empresa = empresaNombre;
          return tienda;
        });
      })
    );
  }

  getMethodPays(): Observable<MethodPay[]> {
    const idEmpresa = this.empresaService.getEmpresaSeleccionada().idEmpresa;
    return this.http.get<MethodPay[]>(`${this.urlEndPoint}/api/forma-pago/${idEmpresa}`);
  }
  
  getReporteProsegurRemitos(dto: ParamDto): Observable<any> {
    return this.http.post<any>(`${this.urlEndPoint}/api/reporte/gestion/prosegur/remito`, dto);
  }

  getReporteProsegurDiferencia(dto: ParamDto): Observable<any> {
    return this.http.post<any>(`${this.urlEndPoint}/api/reporte/gestion/prosegur/diferencia`, dto);
  }

  getReporteVentas(dto: ParamDto): Observable<any> {
    return this.http.post<any>(`${this.urlEndPoint}/api/reporte/gestion/ventas/ventas`, dto);
  }

  getReporteVentasFinales(dto: ParamDto): Observable<any> {
    return this.http.post<any>(`${this.urlEndPoint}/api/reporte/gestion/ventas/finales`, dto);
  }

  getReporteVentasPorHora(dto: ParamDto): Observable<any> {
    return this.http.post<any>(`${this.urlEndPoint}/api/reporte/gestion/ventas/ventas-hora`, dto);
  }

  getReporteVentasResumen(dto: ParamDto): Observable<any> {
    return this.http.post<any>(`${this.urlEndPoint}/api/reporte/gestion/ventas/ventas-resumen`, dto);
  }

  getReporteVentasPaloteoPixel(dto: ParamDto): Observable<any> {
    return this.http.post<any>(`${this.urlEndPoint}/api/reporte/gestion/ventas/paloteo-pixel`, dto);
  }

  getReporteVentasPaloteoPixelTotalizado(dto: ParamDto): Observable<any> {
    return this.http.post<any>(`${this.urlEndPoint}/api/reporte/gestion/ventas/paloteo-pixel-total`, dto);
  }

  getReporteVentasVentaAgregador(dto: ParamDto): Observable<any> {
    return this.http.post<any>(`${this.urlEndPoint}/api/reporte/gestion/ventas/ventas-agregador`, dto);
  }

  getReporteVentasFormaPago(dto: ParamDto): Observable<any> {
    return this.http.post<any>(`${this.urlEndPoint}/api/reporte/gestion/venta-forma-pago`, dto);
  }

  getReporteVentasFormaPagoTransaccion(dto: ParamDto): Observable<any> {
    return this.http.post<any>(`${this.urlEndPoint}/api/reporte/gestion/venta-forma-pago/transaccion`, dto);
  }

  getReporteVentasFormaPagoTienda(dto: ParamDto): Observable<any> {
    return this.http.post<any>(`${this.urlEndPoint}/api/reporte/gestion/venta-forma-pago/tienda`, dto);
  }

  getReporteVentasFormaPagoCajero(dto: ParamDto): Observable<any> {
    return this.http.post<any>(`${this.urlEndPoint}/api/reporte/gestion/venta-forma-pago/cajero`, dto);
  }

  getReporteVentasFormaPagoDetallado(dto: ParamDto): Observable<any> {
    return this.http.post<any>(`${this.urlEndPoint}/api/reporte/gestion/venta-forma-pago/detallado`, dto);
  }

  getReportePagoCobradoEfectivo(dto: ParamDto): Observable<any> {
    return this.http.post<any>(`${this.urlEndPoint}/api/reporte/gestion/pagado-cobrado-efectivo`, dto);
  }

  getReporteVentaAgregador(dto: ParamDto): Observable<any> {
    return this.http.post<any>(`${this.urlEndPoint}/api/reporte/gestion/agregador`, dto);
  }

  getReporteRendidoTarjeta(dto: ParamDto): Observable<any> {
    return this.http.post<any>(`${this.urlEndPoint}/api/reporte/gestion/rendido-tarjeta`, dto);
  }

  getReporteRendidoTarjetaDetallado(dto: ParamDto): Observable<any> {
    return this.http.post<any>(`${this.urlEndPoint}/api/reporte/gestion/rendido-tarjeta/detallado`, dto);
  }

  getReporteRendidoTarjetaTransaccion(dto: ParamDto): Observable<any> {
    return this.http.post<any>(`${this.urlEndPoint}/api/reporte/gestion/rendido-tarjeta/transaccion`, dto);
  }
  
  getReporteCallVentaBase(dto: ParamDto): Observable<CallVentasBaseDto[]> {
    return this.http.post<any>(`${this.urlEndPoint}/api/reporte/gestion/call-center/venta/base`, dto);
  }

  getReporteCallVentaTckPromedio(dto: ParamDto): Observable<CallVentasBaseDto[]> {
    return this.http.post<any>(`${this.urlEndPoint}/api/reporte/gestion/call-center/venta/ticket-promedio`, dto);
  }

  getReporteCallVentaFrecuenciaSemestral(dto: ParamDto): Observable<CallVentasBaseDto[]> {
    return this.http.post<any>(`${this.urlEndPoint}/api/reporte/gestion/call-center/venta/frecuencia-semestral`, dto);
  }

  getReporteCallVentaResumen(dto: ParamDto): Observable<CallVentasBaseDto[]> {
    return this.http.post<any>(`${this.urlEndPoint}/api/reporte/gestion/call-center/venta/resumen`, dto);
  }

  getReporteCallMembresiaBase(dto: ParamDto): Observable<any> {
    return this.http.post<any>(`${this.urlEndPoint}/api/reporte/gestion/call-center/membresia/base`, dto);
  }

  getReporteCallMembresiaEvolutivo(dto: ParamDto): Observable<any> {
    return this.http.post<any>(`${this.urlEndPoint}/api/reporte/gestion/call-center/membresia/evolutivo`, dto);
  }

  getReporteCallMembresiaTipoNivel(dto: ParamDto): Observable<any> {
    return this.http.post<any>(`${this.urlEndPoint}/api/reporte/gestion/call-center/membresia/tipo-nivel`, dto);
  }

  getReporteCallMembresiaTipoTelefono(dto: ParamDto): Observable<any> {
    return this.http.post<any>(`${this.urlEndPoint}/api/reporte/gestion/call-center/membresia/tipo-telefono`, dto);
  }

  getReporteValeAlimento(dto: ParamDto): Observable<any> {
    return this.http.post<any>(`${this.urlEndPoint}/api/reporte/control/vale-alimento`, dto);
  }

  getReporteCmrDetallado(dto: ParamDto): Observable<any> {
    return this.http.post<any>(`${this.urlEndPoint}/api/reporte/control/crm/detallado`, dto);
  }

  getReporteCmrAgrupadoTienda(dto: ParamDto): Observable<any> {
    return this.http.post<any>(`${this.urlEndPoint}/api/reporte/control/crm/agrupado-tienda`, dto);
  }

  getReporteCmrAgrupadoMes(dto: ParamDto): Observable<any> {
    return this.http.post<any>(`${this.urlEndPoint}/api/reporte/control/crm/agrupado-mes`, dto);
  }

  getReporteControlVentaTicketAnulado(dto: ParamDto): Observable<any> {
    return this.http.post<any>(`${this.urlEndPoint}/api/reporte/control/venta/ticket-anulado`, dto);
  }

  getReporteControlVentaAnulado(dto: ParamDto): Observable<any> {
    return this.http.post<any>(`${this.urlEndPoint}/api/reporte/control/venta/venta-anulada`, dto);
  }

  getReporteControlPji(dto: ParamDto): Observable<any> {
    return this.http.post<any>(`${this.urlEndPoint}/api/reporte/control/venta/pji`, dto);
  }

  getReporteControlClienteDelivery(dto: ParamDto): Observable<any> {
    return this.http.post<any>(`${this.urlEndPoint}/api/reporte/control/venta/clientes-delivery`, dto);
  }

  getReporteVentasLocatarios(dto: ParamDto): Observable<any> {
    return this.http.post<any>(`${this.urlEndPoint}/api/reporte/gestion/ventas-locatarios`, dto);
  }
  
  addTransaccion(reporte: Reporte): Observable<any> {
    return this.http.post<any>(`${this.urlEndPoint}/api/reporte/transaccion`, reporte);
  }

  getListaReportes(idUsuario: string): Observable<Reporte[]> {
    return this.http.get<Reporte[]>(`${this.urlEndPoint}/api/reporte/transaccion/${idUsuario}`);
  }

  getReporte(idReporte: number): Observable<Reporte> {
    return this.http.get<Reporte>(`${this.urlEndPoint}/api/reporte/transaccion/detalle/${idReporte}`);
  }

  getReporteRedimido(dto: ParamDto): Observable<any> {
    return this.http.post<any>(`${this.urlEndPoint}/api/reporte/control/redimido`, dto);
  }

  getListaProcesoAutomatico(idempresa: number,tienda: number): Observable<ProcesoAutomatico[]> {
    return this.http.get<ProcesoAutomatico[]>(`${this.urlEndPoint}/api/reporte/procesoautomatico/${idempresa}/${tienda}`);
  }

  addProcesoAutomatico(objProceso: ProcesoAutomatico): Observable<any> {
    return this.http.post<any>(`${this.urlEndPoint}/api/reporte/procesoautomatico`, objProceso);
  }


}
