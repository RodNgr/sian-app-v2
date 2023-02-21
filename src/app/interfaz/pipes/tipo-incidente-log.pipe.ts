import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tipoIncidenteLog'
})
export class TipoIncidenteLogPipe implements PipeTransform {

  transform(value: string): string {
    let tipo: string = '';

    if (value === '0') {
      tipo = 'Sin Error';
    } else if (value === '1') {
      tipo = 'Validación';
    } else if (value === '2') {
      tipo = 'No Manejado';
    } else if (value === '3') {
      tipo = 'Data';
    } 

    return tipo;
  }

}
