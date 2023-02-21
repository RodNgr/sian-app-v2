import { DetalleArchivo } from './detalle-archivo';
import { DetalleProceso } from './detalle-proceso';

export class Proceso {

     public idProceso!: number;
     public tiProceso!: number;
     public idEmpresa!: number;
     public deProceso!: string;
     public feInicioPeriodo!: Date;
     public feFinPeriodo!: Date;
     public feInicioProceso!: Date;
     public feFinProceso!: Date;
     public esProceso!: string;
     public idCreacion!: string;
     public feCreacion!: string;
     public inResultado!: boolean;
     public deCorreos!: string;
     public noInforme!: string;
     public vaBolsa!: number;
     public pcComision!: number;
     public inFormato!: number;
     public detalles: DetalleProceso[] = [];
     public archivos: DetalleArchivo[] = [];

     public marca!: string;
	
}
