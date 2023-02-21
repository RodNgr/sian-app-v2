import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'estadoProceso'
})
export class EstadoProcesoPipe implements PipeTransform {

  transform(estado: string): string {
    let descripcion!: string;

    if (estado === 'P') {
      descripcion = 'Pendiente';
    } else if (estado === 'F') {
      descripcion = 'Finalizado';
    } else {
      descripcion = 'En Proceso'
    }

    return descripcion;
  }

}
