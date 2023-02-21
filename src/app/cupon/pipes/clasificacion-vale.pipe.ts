import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'clasificacionVale',
  pure: false
})
export class ClasificacionValePipe implements PipeTransform {

  transform(value: number): string {
    if (value === 1) {
      return 'FINAL';
    } else if (value === 2) {
      return 'PROVISIONAL';
    } else {
      return '';
    }
  }

}
