import { Pipe, PipeTransform } from '@angular/core';

import { CabValeVerde } from '../entity/cabValeVerde';

@Pipe({
  name: 'estadoVale',
  pure: false
})
export class EstadoValePipe implements PipeTransform {

  transform(value: CabValeVerde): string {
    let estado: string = '';
    if (value.aprobado && value.isprint && !value.anulado) {
      estado = 'IMPRESO';
    } else if (!value.aprobado && !value.isprint && !value.anulado) {
      estado = 'NUEVO';
    } else if (value.anulado) {
      estado = 'ANULADO';
    } else if (value.aprobado && !value.isprint) {
      estado = 'APROBADO'
    } else if (value.pagado) {
      estado = 'PAGADO'
    }

    return estado;
  }

}
