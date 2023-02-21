import { CabValeVerde } from '../entity/cabValeVerde';
import { DetalleVale } from './detalle-vale';

export class ValeCorporativo {

     public vale!: CabValeVerde;
     public detalles!: DetalleVale[];

     public motivo!: string;

}