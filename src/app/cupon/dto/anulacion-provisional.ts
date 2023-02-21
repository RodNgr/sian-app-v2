import { DocumentoSAP } from './documento-sap';

export class AnulacionProvisional {

     public documento!: DocumentoSAP;
     public vales: string[] = [];
     public id!: number;
     public usuarioId!: string;
     public serie!: string;
     public correlativo!: string;
     public docCobranza!: string;
	public fechaEmision!: string;
	public monto!: number;

}