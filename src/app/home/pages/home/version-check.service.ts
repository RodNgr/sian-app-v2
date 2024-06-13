import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VersionCheckService {
  private currentVersion: string;
  //private versionUrl = 'http://localhost:9838/api/interfaz-articulo/version'; // URL de tu endpoint
  //private token = 'eyJhb...';

  private urlEndPoint: string

  constructor(private http: HttpClient) {
    //this.urlEndPoint = environment.urlInterfazProducto;
    this.urlEndPoint = environment.urlSecurity;
  }

  public loadCurrentVersion() {
    this.http.get<{ version: string }>(environment.path + '/assets/version.json')
      .subscribe(
        response => {
          this.currentVersion = response.version;
          this.initVersionCheck();
        },
        err => {
          console.error('Error loading current version from JSON:', err);
        }
      );
    }

  public initVersionCheck() {
    interval(30000) // Verificar cada 30 segundos
      .pipe(
        //switchMap(() => this.http.get<{ version: string }>(`${this.urlEndPoint}/api/interfaz-articulo/version`))
        switchMap(() => this.http.get<{ version: string }>(`${this.urlEndPoint}/api/users/version`))
        
        //switchMap(() => this.http.get<{ version: string }>(`${this.urlEndPoint}/api/interfaz-articulo/version`, {
        //  headers: new HttpHeaders({
        //    'Authorization': `Bearer ${this.token}`
        //  })
        //}))

      )
      .subscribe(
        response => {
          //console.log("verificaaaaaaaa");
          //console.log(response.version);
          //console.log(this.currentVersion);
          //if (response.version !== this.currentVersion) {
          //  this.currentVersion = response.version;
          //  this.promptUser();
          //}
          console.log("Versión Servidor: " + response.version);
          console.log("Versión Cliente: " + this.currentVersion);

          if (isVersionGreater(this.currentVersion, response.version)) {
            
            this.promptUser();
          }

        },
        err => {
          console.error('Error checking version:', err);
        }
      );
  }

  private promptUser() {
    console.log("Borra cache");
    // Mostrar un mensaje al usuario para recargar la página
    //if (confirm('Hay una nueva versión disponible. ¿Deseas recargar la página para obtener la última versión?')) {
      window.location.reload();
      //window.location.reload(true); 
      //window.location.href = window.location.href + '?nocache=' + new Date().getTime();
      window.location.href = window.location.href.split('?')[0] + '?nocache=' + new Date().getTime();
    //}
  }

}

function isVersionGreater(currentVersion: string, newVersion: string): boolean {
  const currentParts = currentVersion.split('.').map(Number);
  const newParts = newVersion.split('.').map(Number);

  for (let i = 0; i < newParts.length; i++) {
    if (newParts[i] > (currentParts[i] || 0)) {
      return true;
    } else if (newParts[i] < (currentParts[i] || 0)) {
      return false;
    }
  }
  return false;
}
