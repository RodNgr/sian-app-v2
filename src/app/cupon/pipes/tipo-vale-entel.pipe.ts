import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tipoValeEntel'
})
export class TipoValeEntelPipe implements PipeTransform {

  transform(value: string): string {
    if (value === 'D') {
      return 'ENTEL';
    } else if (value === 'V') {
      return 'THE VOICE';
    } else {
      return '';
    }
  }

}
