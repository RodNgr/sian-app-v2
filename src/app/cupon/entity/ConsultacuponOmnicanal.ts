export interface Resultado {
	cupon: ConsultaCuponOmnicanal
	transacciones: Transacciones[]
  }


export class ConsultaCuponOmnicanal {
	pk: string
	sk: string
	nombreCampanha: string
	nombreCupon: any
	codCupon: string
	Marca: any
	codMarca: any
	habilitado: any
	anulado: any
	stanulado: string
	//activoCompraMin: number
	activoCompraMin: any
	//monto: number
	monto: any
	//montoMax: number
	montoMax: any
	//compraMin: number
	compraMin: any
	//estado: number
	estado: any
	stestado: string
	//idTipoCupon: number
	idTipoCupon: any
	stTipoCupon: String
	//cantidadProductUso: number
	cantidadProductUso: any
	//validaDelivery: number
	validaDelivery: any
	usuarioReg: string
	fecReg: string
	fecActualizacion: string
	usuarioActualizacion: any
	fecInicio: string
	fecFin: string
	//nroUso: number
	nroUso: any
	//cantidadRedimido: number
	cantidadRedimido: any
	nroCuponAGenerar: any
	canalDetalle: any
	canalJson: any
	alianza: any
  }
  
  export class Transacciones {
	nroPedido: string
	sk: string
	codMarca: any
	Marca:String
	codCanal: any
	Canal: any
	codTienda: any
	codCupon: string
	codCajero: string
	nombreCampanha: string
	//pedidoAnulado: number
	pedidoAnulado: any
	stpedidoAnulado: string
	fecRegistro: string
	fecActualizacion: string
	usuarioActualiza: any
	detallePedido: string
	pedidoOrigen: any
	tiendaSap: any
	nombreCajero: any
	nombreTienda: any
	fecVenta: any
  }

  export class Canal {
	codCanal: string
	Canal: string
  }
  