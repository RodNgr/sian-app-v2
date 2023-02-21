import { Pipe, PipeTransform } from '@angular/core';

import { Aplicacion } from '../entity/aplicacion';

@Pipe({
  name: 'aplicacion'
})
export class AplicacionPipe implements PipeTransform {

  transform(value: number, aplicaciones: Aplicacion[]): string {
    const app: Aplicacion[] = aplicaciones.filter(a => a.id === value);

    if (app.length > 0) {
      return app[0].name;
    }

    return '';
  }

}
