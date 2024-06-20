export class LibroReclamaciones {
    id: string;
    idmarca: number;
    marca!: string;
    codigo!: string;
    nombre: string;
    apellido!: string;//###
    tipodocumento: string;
    nrodoc: string;
    telefono: string;
    email: string;
    departamento: string;
    provincia!: string;//###
    distrito!: string;//###
    direccion: string;
    esmenordeedad!: string;//###
    datospadres: string;
    datospadrestelefono!: string;//###
    datospadresdireccion!: string;//###
    datospadrescorreo!: string;//###
    biendelcontrato: string;
    montoreclamado: string;
    motivoreclamado: string;
    tipo: string;
    tiendadepartamento: string;
    codigotienda: string;
    tienda: string;
    canal! : string;//### New
    canaldesc! : string;//### New
    numeropedido: string;
    fechapedido! : string;//###
    tipodealle: string;
    motivo!: string;//### New
    submotivo!: string;//### New
    tipodealleconcreto!: string;//###
    nombrearchivo: string;
    observacionesyacciones: string;
    fecha: Date;
}
