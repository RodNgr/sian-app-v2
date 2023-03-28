import { CanalDetalle } from "./canalDetalle";

export class CuponOmnicanal {
    nombreCampanha: string;
	codigo: string;
	activoCompraMin: number;
	marca: string;
	monto: number;
	tipoCupon: number;
	descripcion: string;
	user: string;
	fecInicio: Date;
	fecFin: Date;
	nroUso: number;
	nroCuponAGenerar: number;
	montoMax: number;
	compraMin: number;
	canaldetalle: CanalDetalle[] = [];
	alianza: string;
	percentdsct: number;
}

export class CuponOmnicanalC {
	
	// activoCompraMin!: number;
	// marca!: string;
	// monto!: number;
	// descripcion!: string;
	// nroUso!: number;
	// nroCuponAGenerar!: number;
	// montoMax!: number;
	// compraMin!: number;
	// percentdsct: number;
	// user!: string;
	
    nombreCampanha!: string;
	tipoCupon!: number;
	fecInicio!: Date;
	fecFin!: Date;
	alianza!: string;
	tipo!: number;
	nroCuponAGenerar!: number; 
	maximouso!: number; 
	codigo!: string; 
	monto!: number; 
	activoCompraMin!: number; 
	compraMin!: number; 
	montoMax!: number; 
	percentdsct!: number; 
	delivery!: number; 
	montodescuento!: number; 
}

export class detalle{
	Canal!: string;
	NomProducto!: string;
	CodProducto!: string;
}