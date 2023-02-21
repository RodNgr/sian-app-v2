export class CierreTurno{

    public idEmpresa!: number;
	public idTienda!: number;
	public idCierre!: number;
	public idTurno!: number; //Es el id consecutivo
	public turno!: number; //Es el que se guarda en la tabla Howpaid (campo PunchIndex)
	public cajero!: string;
	public tboleta!: number;
	public tfactura!: number;
	public tnotaCredito!: number;
	public ttotal: number = 0;
	public diferencia!: number;
	public openDate!: string;

}