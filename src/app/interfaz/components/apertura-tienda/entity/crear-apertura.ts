export class CrearApertura {
  idEmpresa: number;
  codeEmpresa: string;
  MVFormato: string;
  empresaSAP: string;
  tiendaSap: string;
  tiendaPixel: number;
  ip: string;
  codigoBase: number;
  centroBeneficio: string;
  nombreTienda: string;
  fechaInicioOpera: string;
  emailTienda: string;
  inmuebleRP: string;
  localRP?: string;
  tiendaSapPadre?: string;

  static validate(body: CrearApertura) {
    // const ipRegex = new RegExp('^((25[0-5]|(2[0-4]|1d|[1-9]|)d).?\b){3}$');
    // const emailRegex = new RegExp('^w+([.-]?w+)*@w+([.-]?w+)*(.w{2,3})+$');
    if (
      !body.ip.includes('.') ||
      !body.emailTienda ||
      !body.fechaInicioOpera ||
      !body.idEmpresa ||
      !body.empresaSAP ||
      !body.tiendaSap ||
      !body.tiendaPixel || 
      !body.codigoBase || 
      !body.centroBeneficio || 
      !body.nombreTienda ||
      !(body.MVFormato || body.tiendaSapPadre)
    ) {
        return false;
    }

    return true;
  }

  static format(body): CrearApertura {
    const [first, second, third] = body.ip.split('.');
    const newIp = `${first}.${second}.${third}`;
    return {
        ...body,
        ip: newIp,
        MVFormato: body.MVFormato.id,
        tiendaPixel: +body.tiendaPixel,
        codigoBase: +body.codigoBase,
        tiendaSapPadre: body.tiendaSapPadre || null
    }
  }
}
