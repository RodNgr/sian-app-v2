import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'estadoInterface'
})
export class EstadoInterfacePipe implements PipeTransform {

  transform(value: string): string {
    let estado: string = '';

    if (value === 'P') {
      estado = 'PENDIENTE';
    } else if (value === 'C') {
      estado = 'CERRADA';
    } else if (value === 'E') {
      estado = 'ERROR';
    } else if (value === 'X') {
      estado = 'ASUMIDA';
    }

    return estado;
  }

}
