import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'estadoCuadratura'
})
export class EstadoCuadraturaPipe implements PipeTransform {

  transform(value: string): string {
    let retorno: string = '';
    if (value === 'F') {
      retorno = 'FALTANTE';
    } else if (value === 'S') {
      retorno = 'SOBRANTE';
    } else if (value === 'C') {
      retorno = 'CUADRADO';
    } 

    return retorno;
  }

}
