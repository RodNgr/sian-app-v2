import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatoVale'
})
export class FormatoValePipe implements PipeTransform {

  transform(value: number): string {
    if (value === 1) {
      return 'DIGITAL';
    } else {
      return 'FISICO';
    }
  }

}
