import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { EmpresaService } from 'src/app/shared/services/empresa.service';

import { AnulacionProvisional } from '../dto/anulacion-provisional';
import { CabValeVerde } from '../entity/cabValeVerde';
import { CabValeVerdef } from '../entity/cabValeVerdef';
import { DocumentoCobranza } from '../dto/documento-cobranza';
import { DocumentoCobranzaDet } from '../dto/documento-cobranza-det';
import { DetalleVale } from '../dto/detalle-vale';
import { ValeCorporativo } from '../dto/vale-corporativo';
import { ValeEntel } from '../dto/vale-entel';
import { ValeEntelDet } from '../dto/vale-entel-det';
import { ValeDto } from '../dto/vale-dto';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ValeService {

  private urlEndPoint: string

  constructor(private http: HttpClient,
              private empresaService: EmpresaService) {
      this.urlEndPoint = environment.urlCupones;
  }

  getValesCortesia(desde: string, hasta: string): Observable<CabValeVerde[]> {
    const idEmpresa = this.empresaService.getEmpresaSeleccionada().idEmpresa;
    return this.http.get<CabValeVerde[]>(`${this.urlEndPoint}/api/vale/cortesia/${idEmpresa}/${desde}/${hasta}`);
  }

  generaValeCortesia(vale: CabValeVerde): Observable<any> {
    vale.idEmpresa = this.empresaService.getEmpresaSeleccionada().idEmpresa;
    return this.http.post<any>(`${this.urlEndPoint}/api/vale/cortesia`, vale);
  }



  generarValeCorporativo(valeCorporativo: ValeCorporativo): Observable<any> {
    valeCorporativo.vale.idEmpresa = this.empresaService.getEmpresaSeleccionada().idEmpresa;
    return this.http.post<any>(`${this.urlEndPoint}/api/vale/corporativo`, valeCorporativo);
  }

  getValesCorporativos(desde: string, hasta: string, descripcion: string, estado: string): Observable<CabValeVerde[]> {
    const idEmpresa = this.empresaService.getEmpresaSeleccionada().idEmpresa;
    
    if (descripcion === undefined || descripcion === '') {
      return this.http.get<CabValeVerde[]>(`${this.urlEndPoint}/api/vale/corporativo/${idEmpresa}/${desde}/${hasta}/ALL/${estado}`);
    } else {
      return this.http.get<CabValeVerde[]>(`${this.urlEndPoint}/api/vale/corporativo/${idEmpresa}/${desde}/${hasta}/${descripcion}/${estado}`);
    }
  }

  getDetalleVales(cabId: number): Observable<DetalleVale[]> {
    return this.http.get<DetalleVale[]>(`${this.urlEndPoint}/api/vale/corporativo/detalle/${cabId}`);
  }

  getValesCorporativosVirtuales(cabId: number): Observable<CabValeVerdef[]> {
    return this.http.get<CabValeVerdef[]>(`${this.urlEndPoint}/api/vale/corporativo/virtual/${cabId}`);
  }

  findDocumentosContables(factura: string, desde: string, hasta: string): Observable<any> {
    const idEmpresa = this.empresaService.getEmpresaSeleccionada().codSap;
    if (factura === undefined || factura === '') {
      return this.http.get<any>(`${this.urlEndPoint}/api/vale/sap/documento/${idEmpresa}/ALL/${desde}/${hasta}`);
    } else {
      return this.http.get<any>(`${this.urlEndPoint}/api/vale/sap/documento/${idEmpresa}/${factura}/${desde}/${hasta}`);
    }
  }

  findDocumentosContablesReemplazo(idVale: number): Observable<any> {
    return this.http.get<any>(`${this.urlEndPoint}/api/vale/sap/reemplazar/${idVale}`);
  }

  aprobarVale(vale: CabValeVerde): Observable<any> {
    vale.idEmpresa = this.empresaService.getEmpresaSeleccionada().idEmpresa;
    return this.http.post<any>(`${this.urlEndPoint}/api/vale/aprobar`, vale);
  }

  ampliarFecha(vale: CabValeVerde): Observable<any> {
    return this.http.post<any>(`${this.urlEndPoint}/api/vale/ampliar`, vale);
  }

  imprimirVale(vale: CabValeVerde): Observable<any> {
    vale.idEmpresa = this.empresaService.getEmpresaSeleccionada().idEmpresa;
    return this.http.post<any>(`${this.urlEndPoint}/api/vale/imprimir`, vale);
  }

  reimprimirVale(valeCorporativo: ValeCorporativo): Observable<any> {
    valeCorporativo.vale.idEmpresa = this.empresaService.getEmpresaSeleccionada().idEmpresa;
    return this.http.post<any>(`${this.urlEndPoint}/api/vale/reimprimir`, valeCorporativo);
  }
  


  getValesEntel(desde: string, hasta: string): Observable<ValeEntel[]> {
    const idEmpresa = this.empresaService.getEmpresaSeleccionada().idEmpresa;
    return this.http.get<ValeEntel[]>(`${this.urlEndPoint}/api/vale/entel/${idEmpresa}/${desde}/${hasta}`);
  }

  generaValesEntel(valeEntel: ValeEntel): Observable<any> {
    valeEntel.idEmpresa = this.empresaService.getEmpresaSeleccionada().idEmpresa;
    return this.http.post<any>(`${this.urlEndPoint}/api/vale/entel`, valeEntel);
  }

  anulaValeNoUsadosEntel(vale: ValeEntel): Observable<any> {
    return this.http.post<any>(`${this.urlEndPoint}/api/vale/entel/anula`, vale);
  }

  getDetalleValesEntel(id: number): Observable<ValeEntelDet[]> {
    return this.http.get<ValeEntelDet[]>(`${this.urlEndPoint}/api/vale/entel/detalle/${id}`);
  }



  getReporteConsulta(desde: string, hasta: string): Observable<CabValeVerde[]> {
    const idEmpresa = this.empresaService.getEmpresaSeleccionada().idEmpresa;

    return this.http.get<CabValeVerde[]>(`${this.urlEndPoint}/api/vale/reporte/consulta/${idEmpresa}/${desde}/${hasta}`);
  }

  getReporteDocumentoCobranza(desde: string, hasta: string, serie: string, tipo: string): Observable<DocumentoCobranza[]> {
    const idEmpresa = this.empresaService.getEmpresaSeleccionada().idEmpresa;
    return this.http.get<DocumentoCobranza[]>(`${this.urlEndPoint}/api/vale/reporte/cobranza/${idEmpresa}/${desde}/${hasta}/${serie}/${tipo}`);
  }

  getReporteDocumentoCobranzaDet(id: string): Observable<DocumentoCobranzaDet[]> {
    const idEmpresa = this.empresaService.getEmpresaSeleccionada().idEmpresa;
    return this.http.get<DocumentoCobranzaDet[]>(`${this.urlEndPoint}/api/vale/reporte/cobranzadet/${idEmpresa}/${id}`);
  }


  

  anulaVale(vale: CabValeVerde): Observable<any> {
    vale.idEmpresa = this.empresaService.getEmpresaSeleccionada().idEmpresa;
    return this.http.post<any>(`${this.urlEndPoint}/api/vale/anula`, vale);
  }

  anulaValeProvisional(anulacion: AnulacionProvisional): Observable<any> {
    return this.http.post<any>(`${this.urlEndPoint}/api/vale/anula/provisional`, anulacion);
  }



  getVale(id: number): Observable<CabValeVerde> {
    return this.http.get<CabValeVerde>(`${this.urlEndPoint}/api/vale/${id}`);
  }

  getValesPorDocumento(documento: string): Observable<ValeDto[]> {
      return this.http.get<ValeDto[]>(`${this.urlEndPoint}/api/vale/consulta/documento/${documento}`);
  }

  getValesPorBolsa(idbolsa: string): Observable<ValeDto[]> {
    return this.http.get<ValeDto[]>(`${this.urlEndPoint}/api/vale/consulta/bolsa/${idbolsa}`);
  }

  getValesPorBarra(barra: string): Observable<ValeDto[]> {
    return this.http.get<ValeDto[]>(`${this.urlEndPoint}/api/vale/consulta/barra/${barra}`);
  }

  getValesPorFecha(tipo: string, inicio: string, fin: string): Observable<ValeDto[]> {
    return this.http.get<ValeDto[]>(`${this.urlEndPoint}/api/vale/consulta/fecha/${tipo}/${inicio}/${fin}`);
  }

  cambiarNoRedimido(strCodigos: string): Observable<Boolean> {
    return this.http.get<Boolean>(`${this.urlEndPoint}/api/vale/cambiarNoRedimido/${strCodigos}`);
  }

  anularNoRedimido(idBolsa: string): Observable<Boolean> {
    return this.http.get<Boolean>(`${this.urlEndPoint}/api/vale/anularNoRedimido/${idBolsa}`);
  }

  ampliarFechaIdBolsa(idBolsa: string, vhasta: string): Observable<Boolean> {
    return this.http.get<Boolean>(`${this.urlEndPoint}/api/vale/ampliarFechaIdBolsa/${idBolsa}/${vhasta}`);
  }

  ampliarFechaPorCodigo(strCodigos: string, vhasta: string): Observable<Boolean> {
    return this.http.get<Boolean>(`${this.urlEndPoint}/api/vale/ampliarFechaPorCodigo/${strCodigos}/${vhasta}`);
  }
}
