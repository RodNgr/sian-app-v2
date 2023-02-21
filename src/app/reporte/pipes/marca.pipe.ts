import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'marca'
})
export class MarcaPipe implements PipeTransform {

  transform(value: string): string {
    if (value === 'BB') {
      return "BEMBOS";
    } else if (value === 'CW') {
      return "CHINAWOK";
    } else if (value === 'DB') {
      return "DON BELISARIO";
    } else if (value === 'PP') {
      return "POPEYES";
    } else if (value === 'DD') {
      return "DUNKINS DONUTS";
    } else if (value === 'PJ') {
      return "PAPA JOHNS";
    } else {
      return "";
    }
  }

}
