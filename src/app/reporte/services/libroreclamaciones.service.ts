import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LibroReclamaciones } from '../entity/libro-reclamaciones';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LibroReclamacionesService {

  private urlEndPoint: string;

  constructor(private http: HttpClient) {
    this.urlEndPoint = environment.urlReporte;
  }

  get(marca: number,fecha1:String,Fecha2:String): Observable<any> {
    return this.http.get<any>(`${this.urlEndPoint}/api/somos/reporte/reclamo?marca=${marca}&fecha1=${fecha1}&fecha2=${Fecha2}`);
  }

  downloadFile(nombreArchivo: string, urlarchivo: string) {
    const url = urlarchivo;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.get(url, { headers: headers, responseType: 'blob' }).subscribe(
      (response: Blob) => {
        const blob = new Blob([response], { type: 'application/octet-stream' });
        const urlArchivo = window.URL.createObjectURL(blob);
        const enlace = document.createElement('a');
        enlace.href = urlArchivo;
        enlace.download = nombreArchivo; // Puedes asignar el nombre del archivo aquí
        document.body.appendChild(enlace);
        enlace.click();
        setTimeout(() => {
          window.URL.revokeObjectURL(urlArchivo);
          document.body.removeChild(enlace);
        }, 0);
      },
      error => {
        console.error('Error al descargar el archivo:', error);
      }
    );
  }


}
