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
    nombreCampanha!: string;
	codigo!: string;
	activoCompraMin!: number;
	marca!: string;
	monto!: number;
	tipoCupon!: number;
	tipo!: number;
	descripcion!: string;
	user!: string;
	fecInicio!: Date;
	fecFin!: Date;
	nroUso!: number;
	nroCuponAGenerar!: number;
	montoMax!: number;
	compraMin!: number;
	alianza!: string;
	percentdsct: number;
}

export class detalle{
	Canal!: string;
	NomProducto!: string;
	CodProducto!: string;
}