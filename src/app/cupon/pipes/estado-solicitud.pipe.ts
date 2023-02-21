import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'estadoSolicitud'
})
export class EstadoSolicitudPipe implements PipeTransform {

  transform(value: string): unknown {
    if (value === 'P') {
      return 'En Proceso';
    } else if (value === 'X') {
      return 'DIEN Asignado';
    } else if (value === 'F') {
      return 'Finalizado';
    } else if (value === 'A') {
      return 'Anulado';
    } else {
      return '';
    }
  }

}
