export class ProductoCarta{
    carta: string;
    codigo: string;
    nombre: string;
    detalle: string;

    menu: string;
    producto: string;
}

export class CartaConsolidada{
    canal!: number;
    producto!: string;
    cantidad!: number;
}

export class CartaDetalleVista{
    canal!: number;
    producto!: string;
    nombre!: string;
}