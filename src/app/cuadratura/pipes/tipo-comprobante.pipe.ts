import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tipoComprobante'
})
export class TipoComprobantePipe implements PipeTransform {

  transform(value: string): string {
    if (value === '01') {
      return 'FACTURA';
    } else if (value === '03') {
      return 'BOLETA';
    } else if (value === '07') {
      return 'NOTA DE CRÉDITO';
    } else {
      return '';
    }
  }

}
