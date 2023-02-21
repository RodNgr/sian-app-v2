import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'estado'
})
export class EstadoPipe implements PipeTransform {

  transform(value: number): unknown {
    if (value === 1) {
      return 'Activo';
    } else {
      return 'Inactivo';
    }
  }

}
