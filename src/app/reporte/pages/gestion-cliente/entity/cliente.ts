export class ClienteActualiza {
  documento: string;
  tipoDoc: string;
  marca: string;
  gestionDatos: number;

  static parseUpdate(data: ClienteActualiza) {
    return {
      ...data,
      gestionDatos: +(!!data.gestionDatos),
      marca: data.marca.toString(),
    }
  }

  static validate(data: ClienteActualiza) {
    return !(!data.documento || !data.gestionDatos || !data.marca || !data.tipoDoc);
  }
}

export class ClienteRegistro {
  documento: string;
  tipoDoc: string;
  marca: string;
  gestionDatos: number;

  nombre: string;
  apellidoPater: string;
  apellidoMat: string;
  fechNac: string;
  telefono: string;
  correo: string;
  direccion: string;
  canal: string;
  publicidad: number;

  static parseRegister(data: ClienteRegistro) {
    return {
      ...data,
      fechNac: new Date(data.fechNac).toISOString().split('T')[0],
      apellidoMat: data.apellidoMat || '',
      telefono: data.telefono || '',
      correo: data.correo || '',
      direccion: data.direccion || '',
      gestionDatos: +(!!data.gestionDatos),
      publicidad: +(!!data.publicidad),
    }
  }

  static validateParams(data: ClienteRegistro) {
    console.log('data', data);
    return !(!data.nombre || !data.apellidoPater || !data.canal || !data.documento || !data.tipoDoc || !data.marca || !data.fechNac);
  }
}
