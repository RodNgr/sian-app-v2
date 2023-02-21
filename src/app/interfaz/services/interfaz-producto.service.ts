import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { EmpresaService } from 'src/app/shared/services/empresa.service';

import { CategoriaSap } from '../entity/categoria-sap';
import { Empresa } from '../../shared/entity/empresa';
import { ProductoPixel } from '../entity/producto-pixel';
import { ProductoSap } from '../entity/producto-sap';

import { CargaMasivaDto } from '../dto/carga-masiva-dto';
import { TransferenciaArticuloDto } from '../dto/transferencia-articulo-dto';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InterfazProductoService {

  private urlEndPoint: string

  constructor(private http: HttpClient,
              private empresaService: EmpresaService) {
      this.urlEndPoint = environment.urlInterfazProducto;
  }

  findProductoPixel(fecha: string): Observable<ProductoPixel[]> {
    const empresa: Empresa = this.empresaService.getEmpresaSeleccionada();
    return this.http.get<ProductoPixel[]>(`${this.urlEndPoint}/api/interfaz-articulo/buscar/${empresa.idEmpresa}/${empresa.codSap}/${fecha}`);
  }

  getCategoriasSap(): Observable<CategoriaSap[]> {
    return this.http.get<CategoriaSap[]>(`${this.urlEndPoint}/api/interfaz-articulo/categoria-sap`);
  }

  transferir(dto: TransferenciaArticuloDto): Observable<ProductoSap[]> {
    return this.http.post<ProductoSap[]>(`${this.urlEndPoint}/api/interfaz-articulo/transferir`, dto);
  }

  getArticulosSap(coPixel: string): Observable<ProductoSap[]> {
    const idEmpresaSap: string = this.empresaService.getEmpresaSeleccionada().codSap;
    const idEmpresa: number = this.empresaService.getEmpresaSeleccionada().idEmpresa;
    return this.http.get<ProductoSap[]>(`${this.urlEndPoint}/api/interfaz-articulo/articulo/buscar/${idEmpresa}/${idEmpresaSap}/${coPixel}`);
  }

  actualizarArticuloSap(articuloSap: ProductoSap): Observable<any> {
    return this.http.post<any>(`${this.urlEndPoint}/api/interfaz-articulo/articulo/actualizar/`, articuloSap);
  }

  generateFile(): Observable<any> {
    let idEmpresa: number = this.empresaService.getEmpresaSeleccionada().idEmpresa;
    return this.http.get<any>(`${this.urlEndPoint}/api/interfaz-articulo/articulo/masivo/generate/${idEmpresa}`);
  }

  uploadFile(archivo: File): Observable<CargaMasivaDto> {
    const idEmpresaSap: string = this.empresaService.getEmpresaSeleccionada().codSap;
    const idEmpresa: number = this.empresaService.getEmpresaSeleccionada().idEmpresa;

    let formData = new FormData();
    formData.append("archivo", archivo);
    formData.append('idempresa', idEmpresa.toString());
    formData.append('idempresasap', idEmpresaSap);

    return this.http.post<CargaMasivaDto>(`${this.urlEndPoint}/api/interfaz-articulo/articulo/upload/`, formData);
  }

  exportArticuloSap(): Observable<ProductoSap[]> {
    const idEmpresaSap: string = this.empresaService.getEmpresaSeleccionada().codSap;
    const idEmpresa: number = this.empresaService.getEmpresaSeleccionada().idEmpresa;

    return this.http.get<ProductoSap[]>(`${this.urlEndPoint}/api/interfaz-articulo/export/${idEmpresa}/${idEmpresaSap}`);
  }

  actualizarCargaMasivaArticulo(dto: CargaMasivaDto): Observable<any> {
    return this.http.post<any>(`${this.urlEndPoint}/api/interfaz-articulo/articulo/masivo/actualizar`, dto);
  }

}
