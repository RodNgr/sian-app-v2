export class CrearBeneficio {
  codCargo: string;
  codMarca: string;
  canal: string;
  tipoDescuento: string;
  porcentaje: number;
  descuentoMaximo: number;

  static validate(body: CrearBeneficio) {
    // const ipRegex = new RegExp('^((25[0-5]|(2[0-4]|1d|[1-9]|)d).?\b){3}$');
    // const emailRegex = new RegExp('^w+([.-]?w+)*@w+([.-]?w+)*(.w{2,3})+$');
    if (
      !body.codCargo ||
      !body.codMarca ||
      !body.canal ||
      !body.tipoDescuento ||
      !body.porcentaje ||
      !body.descuentoMaximo
    ) {
      return false;
    }

    return true;
  }

  static format(body): CrearBeneficio {
    return {
      ...body,
      porcentaje: +body.porcentaje,
      descuentoMaximo: +body.descuentoMaximo,
    };
  }
}
