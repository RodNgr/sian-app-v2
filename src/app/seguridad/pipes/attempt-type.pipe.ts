import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'attemptType'
})
export class AttemptTypePipe implements PipeTransform {

  transform(value: string): string {
    if (value === '0') {
      return 'Login exitoso';
    } else if (value === '1') {
      return 'Usuario no existe';
    } else if (value === '2') {
      return 'Usuario no asignado a la aplicación';
    } else if (value === '3') {
      return 'Usuario inactivo';
    } else if (value === '4') {
      return 'Clave inválida';
    } else {
      return 'IP Bloqueada temporalmente';
    }
  }

}
