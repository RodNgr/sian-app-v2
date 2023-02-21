import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tipoCentro'
})
export class TipoCentroPipe implements PipeTransform {

  transform(value: string): string {
    if (value === 'E') {
      return "ECOMMERCE";
    } else {
      return "CALL CENTER";
    }
  }

}
