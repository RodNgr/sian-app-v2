import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'estadoReporte'
})
export class EstadoReportePipe implements PipeTransform {

  transform(value: string): string {
    if (value === 'P') {
      return "Pendiente";
    } else if (value === 'X') {
      return "En Proceso";
    } else if (value === 'F') {
      return "Finalizado";
    } else if (value === 'E') {
      return "Error";
    } else {
      return "";
    }
  }

}
