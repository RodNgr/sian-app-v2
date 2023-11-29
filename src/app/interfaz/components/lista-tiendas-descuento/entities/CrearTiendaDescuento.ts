export class CrearTiendaDescuento {
  centroCosto: number;
  codTienda: number;
  storeName: string;
  canUseDiscount: string;

  static validate(body: CrearTiendaDescuento) {
    if (
      !body.centroCosto ||
      !body.codTienda ||
      !body.storeName ||
      !body.canUseDiscount
    ) {
      return false;
    }

    return true;
  }

  static format(body): CrearTiendaDescuento {
    return {
      ...body,
      dia: +body.dia,
      mes: +body.mes,
    };
  }
}
