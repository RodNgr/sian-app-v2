import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'estadoSunat'
})
export class EstadoSunatPipe implements PipeTransform {

  transform(value: string): string {
    let retorno: string = '';
    if (value === '0') {
      retorno = 'NO ENVIADO';
    } else if (value === '2') {
      retorno = 'APROBADO';
    } else if (value === '4') {
      retorno = 'REPARADO';
    } else if (value === '3') {
      retorno = 'RECHAZADO';
    }

    return retorno;
  }

}
