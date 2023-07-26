export class CuentaBancarias {
	marca: number;
    marcaDesc: String;
    codTienda: number;
    tienda:String;
    codBanco: number;
    banco:String;
    codMoneda: number;
    moneda:String;
    codNumero: number;
    numero:string;
    cuenta:string;
    idCuenta: number;

    
}

export class cbobancos{
    idCuenta: number;
    codBanco: number;
    banco: string;
    cuenta: string;
    moneda: string;
    numero: string;
    codNumero: number;
    get cuentaDescipcion(): string {
        return `${this.banco} (${this.moneda}) - ${this.numero}- ${this.cuenta}`;
    }
}