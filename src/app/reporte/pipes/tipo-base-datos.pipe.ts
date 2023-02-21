import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tipoBaseDatos'
})
export class TipoBaseDatosPipe implements PipeTransform {

  transform(value: string): string {
    if (value === 'M') {
      return "MySQL";
    } else if (value === 'S') {
      return "SyBase";
    } else {
      return "";
    }
  }

}
