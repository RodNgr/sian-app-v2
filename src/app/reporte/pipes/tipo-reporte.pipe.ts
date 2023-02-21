import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tipoReporte'
})
export class TipoReportePipe implements PipeTransform {

  transform(value: string): string {
    if (value === 'T') {
      return "Transacción";
    } else if (value === 'C') {
      return "Consulta";
    } else {
      return "";
    }
  }

}
