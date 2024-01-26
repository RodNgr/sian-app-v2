export class CrearFeriado {
  dia: number;
  mes: number;
  descripcion: string;

  static validate(body: CrearFeriado) {
    if (!body.dia || !body.mes || !body.descripcion) {
      return false;
    }

    return true;
  }

  static format(body): CrearFeriado {
    return {
      ...body,
      dia: +body.dia,
      mes: +body.mes,
    };
  }
}
