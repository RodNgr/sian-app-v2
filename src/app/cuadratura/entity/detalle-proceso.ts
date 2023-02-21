import { DetalleProcesoPk } from './detalle-proceso-pk';

export class DetalleProceso {

     public pk!: DetalleProcesoPk;
     public tiPaso!: number;
     public idDetalle!: number;
     public deDetalle!: string;
     public feInicio!: Date;
     public feFin!: Date;
     public deError!: string;

}
