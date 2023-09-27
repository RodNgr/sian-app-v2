import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TipoCuponOmnicanal } from '../../entity/tipo-cupon-omnicanal';
import { CartaConsolidada, CartaDetalleVista, ProductoCarta } from '../../entity/producto-carta';
import { ProductoCartaService } from '../../services/producto-carta.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { OmnicanalDto } from '../../dto/omnicalanal-dto';
import swal from 'sweetalert2';
import { CartaOmnicanal } from '../../entity/cartaOmnicanal';
import { CuponOmnicanal, CuponOmnicanalC, detalle } from '../../entity/cuponOmnicanal';
import { EmpresaService } from 'src/app/shared/services/empresa.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { CanalDetalle } from '../../entity/canalDetalle';
import Swal from 'sweetalert2';

import * as $ from 'jquery';
import { environment } from 'src/environments/environment';
import { CuponesOmnicanalService } from '../../services/cupones-omnicanal.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-cupon-omnicanal',
  templateUrl: './cupon-omnicanal.component.html',
  styleUrls: ['./cupon-omnicanal.component.css'],
})
export class CuponOmnicanalComponent implements OnInit {
  public selectCountTimes: string = '1';
  public activeOptions: boolean = false;
  public selectionTypeCupon: string = '0';
  public SeleccionOrigen: string = '0';
  public SeleccionAliados: string = '0';
  public validacion: string = '';
  public validacionC: string = '';

  /* Validaciones Campos */
  public showCuponesGenerar: boolean = false;
  public showCantidadMaximaUso: boolean = false;
  public showCodigo: boolean = false;
  public showMontoPagar: boolean = false;
  public showtipo1: boolean = true;
  public showtipo2: boolean = true;
  public showNecesitaMontoMinimo: boolean = false;
  public showMontoMinimo: boolean = false;
  public showCanales: boolean = true;
  public showExento: boolean = true;
  public showTableProducts: boolean = false;
  public showProductsWeb: boolean = false;
  public showProductsCall: boolean = false;
  public showProductsSalon: boolean = false;
  public showProductsRColas: boolean = false;
  public showProductsBot: boolean = false;
  public shoPorcentajeDescuento: boolean = false;
  public showMaximoDescuento: boolean = false;
  public showVacio: boolean = false;
  public showVacio2: boolean = false;
  public showVacio3: boolean = false;
  public showDelivery: boolean = false;
  public showMontoDescuento: boolean = false;
  public validaBembos: boolean = false;
  public disCupones: boolean = true;

  public type: string = 'V';
  public campana: string;
  public displayModal: boolean;
  isChecked: boolean = false;

  public nameProductSelect: string;

  public productosCartaWeb: ProductoCarta[] = [];
  public productosCartaCallCenter: ProductoCarta[] = [];
  public productosCartaSalon: ProductoCarta[] = [];
  public productosCartaRcolas: ProductoCarta[] = [];
  public productosCartaConsolidado: ProductoCarta[] = [];
  public CartaFinal: CartaConsolidada[] = [];
  public CartaFinaltipos: CartaConsolidada[] = [];
  public CartaDetalleVista: CartaDetalleVista[] = [];

  public CartaWebSelected!: ProductoCarta[];
  public CartaCallSelected!: ProductoCarta[];
  public CartaSalonSelected!: ProductoCarta[];
  public CartaRcolasSelected!: ProductoCarta[];
  public CartaConsolidadoSelectedSelected!: ProductoCarta;
  public DetalleSelected!: detalle;
  public maxCantidadProductos: number = 0;

  public canalDetalle: CanalDetalle[] = [];

  public searchWeb: string = '';
  public searchCall: string = '';
  public searchSalon: string = '';
  public searchrColas: string = '';
  public Cantidad: number;

  public productosCartaWebTemp: ProductoCarta[] = [];
  public productosCartaCallCenterTemp: ProductoCarta[] = [];
  public productosCartaSalonTemp: ProductoCarta[] = [];
  public productosRcolasTemp: ProductoCarta[] = [];

  public selectionProduct: ProductoCarta = {
    carta: '',
    nombre: '',
    codigo: '',
    detalle: '',
    menu: '',
    producto: '',
  };
  public CartasDetalle = {
    canal: '',
    producto: '',
    cantidad: '',
    nombreProducto: '',
  };

  public feInicio!: Date;
  public feFin!: Date;
  public montoMinimo: number;
  public cantidadActivo: boolean = false;
  public CodigoCabecera: number;

  inputValueCaracter: string = '';
  inputValueCaracterAlianza: string = '';
  inputValueValidacionCodigo: string = '';

  // public tipos: TipoCuponOmnicanal[] = [
  //   { nombre: 'Seleccionar tipo', estado: true, codigo: 0 },
  //   { nombre: 'Cupón Precio Fijo a un producto', estado: false, codigo: 1 },
  //   { nombre: 'Cupón descuento % a un producto', estado: false, codigo: 2 },
  //   { nombre: 'Cupón descuento % a varios producto', estado: false, codigo: 3 },
  //   { nombre: 'Cupón descuento Recargo de Delivery', estado: false, codigo: 4 },
  //   {
  //     nombre: 'Cupón descuento monto fijo al  total',
  //     estado: false,
  //     codigo: 5,
  //   },
  //   { nombre: 'Cupón descuento % al monto total', estado: false, codigo: 6 },
  //   { nombre: 'Cupón 2 x 1', estado: false, codigo: 7 },
  // ];

  public tipos: TipoCuponOmnicanal[] = [
    { nombre: 'Seleccionar tipo', estado: true, codigo: 0 },
  ];

  public origenes: TipoCuponOmnicanal[] = [
    { nombre: 'Seleccionar origen', estado: true, codigo: 0 },
  ];

  public Aliados: TipoCuponOmnicanal[] = [
    { nombre: 'Seleccionar Aliado', estado: true, codigo: 0 },
  ];

  public getProductSelect: ProductoCarta[] = [];

  Bucket: String;
  cartaOmnicanal: CartaOmnicanal[] = [];

  public cuponOmni: CuponOmnicanal = new CuponOmnicanal();
  public cuponOmniD: CuponOmnicanalC[] = [];
  public detalles: detalle[] = [];
  public cuponOmni2: {};
  public cuponOmni4: {};
  public cuponOmni3: {};
  private urlEndPointOmnicanal: string;
  private urlLista: string;

  constructor(
    private router: Router,
    private cartaService: ProductoCartaService,
    private empresaService: EmpresaService,
    private dataCupones: CuponesOmnicanalService,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private datePipe: DatePipe
  ) {
    this.urlEndPointOmnicanal = environment.urlOmnicanalA;
    this.urlLista = environment.urlCarta;
  }

  ngOnInit(): void {
    this.ListadoTipo();
    this.ListadoOrigen();
    this.ListadoAliados();
    this.clearCuponData();
    this.tipoOperacion();
    this.disCupones;
    this.isChecked = false;
    this.showMontoMinimo = false;
    this.getProductSelect = this.cartaService.getDataProductSelect();

    this.productosCartaConsolidado.splice(0, 1);

    if (this.empresaService.getEmpresaSeleccionada().idEmpresa == 2) {
      this.validaBembos = true;
    }
  }

  ListadoTipo() {
    const ruta = `${this.urlLista}/getCombosId/3`;

    this.ajaxQueryPostListaTipo(ruta);
  }

  ListadoOrigen() {
    const ruta = `${this.urlLista}/getCombos/1`;

    this.ajaxQueryPostListaOrigen(ruta);
  }

  ListadoAliados() {
    const ruta = `${this.urlLista}/getCombos/2`;

    this.ajaxQueryPostListaAliados(ruta);
  }

  HabilitarCupones() {
    this.disCupones = false;
  }

  filtroWeb() {
    if (this.searchWeb.length > 0) {
      this.productosCartaWeb = this.productosCartaWebTemp.filter((item) => {
        if (
          item.producto.toLowerCase().indexOf(this.searchWeb.toLowerCase()) > 0
        ) {
          return true;
        }
        if (
          item.codigo
            .toString()
            .toLowerCase()
            .indexOf(this.searchWeb.toLowerCase()) >= 0
        ) {
          return true;
        }
        if (
          item.menu.toLowerCase().indexOf(this.searchWeb.toLowerCase()) >= 0
        ) {
          return true;
        }
        return false;
      });
    } else {
      this.productosCartaWeb = this.productosCartaWebTemp;
    }
  }

  filtrorCOLAS() {
    if (this.searchrColas.length > 0) {
      this.productosCartaRcolas = this.productosRcolasTemp.filter((item) => {
        if (
          item.producto.toLowerCase().indexOf(this.searchrColas.toLowerCase()) >
          0
        ) {
          return true;
        }
        if (
          item.codigo
            .toString()
            .toLowerCase()
            .indexOf(this.searchrColas.toLowerCase()) >= 0
        ) {
          return true;
        }
        if (
          item.menu.toLowerCase().indexOf(this.searchrColas.toLowerCase()) >= 0
        ) {
          return true;
        }
        return false;
      });
    } else {
      this.productosCartaRcolas = this.productosRcolasTemp;
    }
  }

  filtroCall() {
    if (this.searchCall.length > 0) {
      this.productosCartaCallCenter = this.productosCartaCallCenterTemp.filter(
        (item) => {
          if (
            item.producto.toLowerCase().indexOf(this.searchCall.toLowerCase()) >
            0
          ) {
            return true;
          }
          if (
            item.codigo
              .toString()
              .toLowerCase()
              .indexOf(this.searchCall.toLowerCase()) >= 0
          ) {
            return true;
          }
          if (
            item.menu.toLowerCase().indexOf(this.searchCall.toLowerCase()) >= 0
          ) {
            return true;
          }
          return false;
        }
      );
    } else {
      this.productosCartaCallCenter = this.productosCartaCallCenterTemp;
    }
  }

  filtroSalon() {
    if (this.searchSalon.length > 0) {
      this.productosCartaSalon = this.productosCartaSalonTemp.filter((item) => {
        if (
          item.producto.toLowerCase().indexOf(this.searchSalon.toLowerCase()) >
          0
        ) {
          return true;
        }
        if (
          item.codigo
            .toString()
            .toLowerCase()
            .indexOf(this.searchSalon.toLowerCase()) >= 0
        ) {
          return true;
        }
        if (
          item.menu.toLowerCase().indexOf(this.searchSalon.toLowerCase()) >= 0
        ) {
          return true;
        }
        return false;
      });
    } else {
      this.productosCartaSalon = this.productosCartaSalonTemp;
    }
  }

  minDate = new Date();
  delivery = 100;

  private tipoOperacion(): void {
    if (sessionStorage.getItem('tipoOperacion')) {
      this.type = sessionStorage.getItem('tipoOperacion')!;
      if (this.type !== 'N') {
        if (sessionStorage.getItem('cupon-omnicanal')) {
          this.getDetailsSelectCupon();
        } else {
          this.type = 'V';
        }
      }
    }
  }

  private clearCuponData(): void {
    this.cuponOmni.nombreCampanha = '';
    this.cuponOmni.alianza = '';
    this.cuponOmni.codigo = '';
    this.cuponOmni.activoCompraMin = 0;
    this.cuponOmni.marca = this.empresaService.getEmpresaSeleccionada().codSap;
    this.cuponOmni.monto = 0;
    this.cuponOmni.tipoCupon = 0;
    this.cuponOmni.descripcion = '';
    this.cuponOmni.user = this.getUsuario();
    this.cuponOmni.nroUso = 0;
    this.cuponOmni.nroCuponAGenerar = 1;
    this.cuponOmni.montoMax = 0;
    this.cuponOmni.compraMin = 0;
    this.cuponOmni.canaldetalle = [];
    this.CartaFinal = [];
    this.CartaFinaltipos = [];
    this.CartaDetalleVista = [];
    this.cuponOmni.compraMin = 0;
    this.cuponOmni.codigo = '';
    this.cuponOmni.monto = 0;
    this.cuponOmni.nroUso = 0;
  }

  formatoCodigo: boolean = false;

  codigoChange(): void {
    if (this.cuponOmni.codigo) {
      if (
        this.cuponOmni.codigo.length > 3 &&
        this.cuponOmni.codigo.length < 31 &&
        this.cuponOmni.codigo.toUpperCase().search('Ñ') < 0 &&
        this.cuponOmni.codigo.toUpperCase().search('O') < 0 &&
        this.cuponOmni.codigo.toUpperCase().search(' ') < 0
      ) {
        this.formatoCodigo = true;
      } else {
        this.formatoCodigo = false;
      }
    }
  }

  private getUsuario(): string {
    return this.authService.usuario.user.shortName;
  }

  showModalDialog() {
    if (
      this.selectionProduct.carta.length > 0 &&
      this.selectionProduct.codigo.length > 0 &&
      this.selectionProduct.nombre.length > 0
    ) {
      if (this.selectionTypeCupon == '1' || this.selectionTypeCupon == '2') {
        if (this.cuponOmni.canaldetalle.length < 1) {
          this.displayModal = true;
        } else {
          Swal.fire(
            'Producto.',
            'Tipo de cupón solo para 1 producto.',
            'error'
          );
        }
      } else {
        this.displayModal = true;
      }
    } else {
      console.error('Error en detalle del producto', this.selectionProduct);
    }
  }

  showModalDialogCartaWeb() {
    const tipo = parseInt(this.selectionTypeCupon);
    const CHANNEL = 2;
    if (this.addProductCondition(this.CartaWebSelected, tipo, CHANNEL)) {
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'No se puede añadir más de un producto o repetidos.',
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }
    this.productosCartaConsolidado.push(...this.CartaWebSelected);
    const productsToValidation = this.parseProductToValidate(
      CHANNEL,
      this.CartaWebSelected
    );
    this.CartaFinal.push(...productsToValidation);
    this.CartaDetalleVista.push(...productsToValidation);
  }

  showModalDialogCartaRcolas() {
    const tipo = parseInt(this.selectionTypeCupon);
    const CHANNEL = 2;
    if (this.addProductCondition(this.CartaRcolasSelected, tipo, CHANNEL)) {
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'No se puede añadir más de un producto o repetidos.',
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }
    this.productosCartaConsolidado.push(...this.CartaRcolasSelected);
    this.CartaFinal.push(
      ...this.parseProductToValidate(CHANNEL, this.CartaRcolasSelected)
    );
    this.CartaDetalleVista.push(
      ...this.parseProductToValidate(100, this.CartaRcolasSelected)
    );
  }

  showModalDialogCartaCall() {
    const tipo = parseInt(this.selectionTypeCupon);
    const CHANNEL = 1;
    if (
      this.addProductCondition(
        this.CartaCallSelected,
        tipo,
        CHANNEL,
        this.CartaFinal
      )
    ) {
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'No se puede añadir más de un producto o repetidos.',
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }
    this.productosCartaConsolidado.push(...this.CartaCallSelected);
    const productsToValidation = this.parseProductToValidate(
      CHANNEL,
      this.CartaCallSelected
    );
    this.CartaFinal.push(...productsToValidation);
    this.CartaDetalleVista.push(...productsToValidation);
  }

  showModalDialogCartaSalon() {
    const tipo = parseInt(this.selectionTypeCupon);
    const CHANNEL = 0;
    if (
      this.addProductCondition(
        this.CartaSalonSelected,
        tipo,
        CHANNEL,
        this.CartaFinal
      )
    ) {
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'No se puede añadir más de un producto o repetidos.',
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }
    this.productosCartaConsolidado.push(...this.CartaSalonSelected);
    const productsToValidation = this.parseProductToValidate(
      CHANNEL,
      this.CartaSalonSelected
    );
    this.CartaFinal.push(...productsToValidation);
    this.CartaDetalleVista.push(...productsToValidation);
  }

  QuitarProducto() {
    if (this.CartaConsolidadoSelectedSelected) {
      this.productosCartaConsolidado = this.productosCartaConsolidado.filter(
        (x) => x.codigo != this.CartaConsolidadoSelectedSelected.codigo
      );
      this.CartaFinal = this.CartaFinal.filter(
        (x) => x.producto != this.CartaConsolidadoSelectedSelected.codigo
      );
      this.CartaDetalleVista = this.CartaDetalleVista.filter(
        (x) => x.producto != this.CartaConsolidadoSelectedSelected.codigo
      );
    }

    console.table(this.productosCartaConsolidado);
    console.table(this.CartaFinal);
  }

  cancelarModal() {
    this.displayModal = false;
  }

  Exento: string = ''; // Boolean flag
  webVal: string = '';
  callVal: string = '';
  salonVal: string = '';
  rcolasVal: string = '';

  // Mostrar opciones por tipo de cupon
  showADetailsUnique(event) {
    this.productosCartaConsolidado = [];
    this.CartaFinal = [];

    this.cuponOmni.tipoCupon = parseInt(this.selectionTypeCupon);
    var tipo = parseInt(this.selectCountTimes);
    var cantidadMaxGenerar = this.cuponOmni.nroCuponAGenerar;

    if (this.selectionTypeCupon == '1' && tipo == 1) {
      this.showCuponesGenerar = true;
      this.showCantidadMaximaUso = false;
      this.showCodigo = false;
      this.showMontoPagar = true;
      this.showNecesitaMontoMinimo = false;
      this.showMontoMinimo = false;
      this.showCanales = true;
      this.showTableProducts = true;
      this.showMaximoDescuento = false;
      this.shoPorcentajeDescuento = false;
      this.showVacio = false;
      this.showVacio2 = false;
      this.showVacio3 = false;
      this.showDelivery = false;
      this.showMontoDescuento = false;
      this.showExento = true;
    } else if (this.selectionTypeCupon == '1' && tipo == 2) {
      this.showCuponesGenerar = true;
      this.showCantidadMaximaUso = true;
      this.showCodigo = true;
      this.cuponOmni.nroCuponAGenerar = 1;
      this.showMontoPagar = true;
      this.showNecesitaMontoMinimo = false;
      this.showMontoMinimo = false;
      this.showCanales = true;
      this.showTableProducts = true;
      this.showMaximoDescuento = false;
      this.shoPorcentajeDescuento = false;
      this.showVacio = false;
      this.showVacio2 = false;
      this.showVacio3 = false;
      this.showDelivery = false;
      this.showMontoDescuento = false;
      this.showExento = true;
    } else if (this.selectionTypeCupon == '2' && tipo == 1) {
      this.showCuponesGenerar = true;
      this.showCantidadMaximaUso = false;
      this.showCodigo = false;
      this.showMontoPagar = false;
      this.showNecesitaMontoMinimo = false;
      this.showMontoMinimo = false;
      this.showCanales = true;
      this.showTableProducts = true;
      this.showMaximoDescuento = true;
      this.shoPorcentajeDescuento = true;
      this.showVacio = true;
      this.showVacio2 = true;
      this.showVacio3 = true;
      this.showDelivery = false;
      this.showMontoDescuento = false;
      this.showExento = false;
    } else if (this.selectionTypeCupon == '2' && tipo == 2) {
      this.showCuponesGenerar = true;
      this.showCantidadMaximaUso = true;
      this.showCodigo = true;
      this.cuponOmni.nroCuponAGenerar = 1;
      this.showMontoPagar = false;
      this.showNecesitaMontoMinimo = false;
      this.showCanales = true;
      this.showMontoMinimo = false;
      this.showTableProducts = true;
      this.showMaximoDescuento = true;
      this.shoPorcentajeDescuento = true;
      this.showVacio = false;
      this.showDelivery = false;
      this.showMontoDescuento = false;
      this.showExento = false;
    } else if (this.selectionTypeCupon == '3' && tipo == 1) {
      this.showCuponesGenerar = true;
      this.showCantidadMaximaUso = false;
      this.showCodigo = false;
      this.showMontoPagar = false;
      this.showNecesitaMontoMinimo = false;
      this.showMontoMinimo = false;
      this.showCanales = true;
      this.showTableProducts = true;
      this.showMaximoDescuento = true;
      this.shoPorcentajeDescuento = true;
      this.showVacio = true;
      this.showVacio2 = true;
      this.showVacio3 = true;
      this.showDelivery = false;
      this.showMontoDescuento = false;
      this.showExento = true;
    } else if (this.selectionTypeCupon == '3' && tipo == 2) {
      this.showCuponesGenerar = true;
      this.cuponOmni.nroCuponAGenerar = 1;
      this.showCantidadMaximaUso = true;
      this.showCodigo = true;
      this.showMontoPagar = false;
      this.showNecesitaMontoMinimo = false;
      this.showMontoMinimo = true;
      this.showCanales = true;
      this.showTableProducts = true;
      this.showMaximoDescuento = true;
      this.shoPorcentajeDescuento = true;
      this.showVacio = true;
      this.showDelivery = false;
      this.showMontoDescuento = false;
      this.showExento = true;
    } else if (this.selectionTypeCupon == '4' && tipo == 1) {
      this.showCuponesGenerar = true;
      this.showCantidadMaximaUso = false;
      this.showCodigo = false;
      this.showMontoPagar = false;
      this.showNecesitaMontoMinimo = false;
      this.showMontoMinimo = true;
      this.showCanales = true;
      this.showTableProducts = true;
      this.showMaximoDescuento = false;
      this.shoPorcentajeDescuento = false;
      this.showVacio = true;
      this.showVacio2 = true;
      this.showVacio3 = false;
      this.showDelivery = true;
      this.cuponOmni.percentdsct = 100;
      this.showMontoDescuento = false;
      this.showExento = true;
    } else if (this.selectionTypeCupon == '4' && tipo == 2) {
      this.showCuponesGenerar = true;
      this.cuponOmni.nroCuponAGenerar = 1;
      this.showCantidadMaximaUso = true;
      this.showCodigo = true;
      this.showMontoPagar = false;
      this.showNecesitaMontoMinimo = false;
      this.showMontoMinimo = true;
      this.showCanales = true;
      this.showTableProducts = true;
      this.showMaximoDescuento = false;
      this.shoPorcentajeDescuento = false;
      this.showVacio = true;
      this.showDelivery = true;
      this.cuponOmni.percentdsct = 100;
      this.showMontoDescuento = false;
      this.showExento = true;
    } else if (this.selectionTypeCupon == '5' && tipo == 1) {
      this.showCuponesGenerar = true;
      this.showCantidadMaximaUso = false;
      this.showCodigo = false;
      this.showMontoPagar = false;
      this.showNecesitaMontoMinimo = false;
      this.showMontoMinimo = true;
      this.showCanales = false;
      this.showTableProducts = false;
      this.showMaximoDescuento = false;
      this.shoPorcentajeDescuento = false;
      this.showVacio = true;
      this.showDelivery = false;
      this.showMontoDescuento = true;
      this.showExento = true;
    } else if (this.selectionTypeCupon == '5' && tipo == 2) {
      this.showCuponesGenerar = true;
      this.showCantidadMaximaUso = true;
      this.cuponOmni.nroCuponAGenerar = 1;
      this.showCodigo = true;
      this.showMontoPagar = false;
      this.showNecesitaMontoMinimo = false;
      this.showMontoMinimo = true;
      this.showCanales = false;
      this.showTableProducts = false;
      this.showMaximoDescuento = false;
      this.shoPorcentajeDescuento = false;
      this.showVacio = true;
      this.showDelivery = false;
      this.showMontoDescuento = true;
      this.showExento = true;
    } else if (this.selectionTypeCupon == '6' && tipo == 1) {
      this.showCuponesGenerar = true;
      this.showCantidadMaximaUso = false;
      this.showCodigo = false;
      this.showMontoPagar = false;
      this.showNecesitaMontoMinimo = false;
      this.showMontoMinimo = true;
      this.showCanales = false;
      this.showTableProducts = false;
      this.showMaximoDescuento = true;
      this.shoPorcentajeDescuento = true;
      this.showVacio = false;
      this.showVacio2 = false;
      this.showVacio3 = false;
      this.showDelivery = false;
      this.showMontoDescuento = false;
      this.showExento = false;
    } else if (this.selectionTypeCupon == '6' && tipo == 2) {
      this.showCuponesGenerar = true;
      this.showCantidadMaximaUso = true;
      this.showCodigo = true;
      this.cuponOmni.nroCuponAGenerar = 1;
      this.showMontoPagar = false;
      this.showNecesitaMontoMinimo = false;
      this.showMontoMinimo = true;
      this.showCanales = false;
      this.showTableProducts = false;
      this.showMaximoDescuento = true;
      this.shoPorcentajeDescuento = true;
      this.showVacio = false;
      this.showDelivery = false;
      this.showMontoDescuento = false;
      this.showExento = false;
    } else if (this.selectionTypeCupon == '7' && tipo == 1) {
      this.showCuponesGenerar = true;
      this.showCantidadMaximaUso = false;
      this.showCodigo = false;
      this.showMontoPagar = false;
      this.showNecesitaMontoMinimo = false;
      this.showMontoMinimo = false;
      this.showCanales = true;
      this.showTableProducts = true;
      this.showMaximoDescuento = false;
      this.shoPorcentajeDescuento = false;
      this.showVacio = true;
      this.showVacio2 = true;
      this.showVacio3 = true;
      this.showDelivery = false;
      this.showMontoDescuento = false;
      this.showExento = true;
    } else if (this.selectionTypeCupon == '7' && tipo == 2) {
      this.showCuponesGenerar = true;
      this.cuponOmni.nroCuponAGenerar = 1;
      this.showCantidadMaximaUso = true;
      this.showCodigo = true;
      this.showMontoPagar = false;
      this.showNecesitaMontoMinimo = false;
      this.showMontoMinimo = false;
      this.showCanales = true;
      this.showTableProducts = true;
      this.showMaximoDescuento = false;
      this.shoPorcentajeDescuento = false;
      this.showVacio = true;
      this.showDelivery = false;
      this.showMontoDescuento = false;
      this.showExento = true;
    } else if (this.selectionTypeCupon == '8' && tipo == 1) {
      this.showCuponesGenerar = true;
      this.showCantidadMaximaUso = false;
      this.showCodigo = false;
      this.showMontoPagar = true;
      this.showNecesitaMontoMinimo = false;
      this.showMontoMinimo = false;
      this.showCanales = true;
      this.showTableProducts = true;
      this.showMaximoDescuento = false;
      this.shoPorcentajeDescuento = false;
      this.showVacio = false;
      this.showVacio2 = false;
      this.showVacio3 = false;
      this.showDelivery = false;
      this.showMontoDescuento = false;
      this.showExento = true;
    } else if (this.selectionTypeCupon == '8' && tipo == 2) {
      this.showCuponesGenerar = true;
      this.showCantidadMaximaUso = true;
      this.showCodigo = true;
      this.cuponOmni.nroCuponAGenerar = 1;
      this.showMontoPagar = true;
      this.showNecesitaMontoMinimo = false;
      this.showMontoMinimo = false;
      this.showCanales = true;
      this.showTableProducts = true;
      this.showMaximoDescuento = false;
      this.shoPorcentajeDescuento = false;
      this.showVacio = false;
      this.showVacio2 = false;
      this.showVacio3 = false;
      this.showDelivery = false;
      this.showMontoDescuento = false;
      this.showExento = true;
    }
  }

  // Agregar Codigo Carta Web
  public obtenerCartaWeb(): string {
    //Modificar según especificación de POS
    let idEmpresa = this.empresaService.getEmpresaSeleccionada().idEmpresa;
    let codMarca = '';
    let codCodigo = '';
    switch (idEmpresa) {
      case 2:
        codMarca = '22096';
        codCodigo = 'Bembos';
        break;
      case 3:
        codMarca = '22095';
        codCodigo = 'Chinawok';
        break;
      case 4:
        codMarca = '22098';
        codCodigo = 'Don Belisario';
        break;
      case 5:
        codMarca = '22099';
        codCodigo = 'Popeyes';
        break;
      case 7:
        codMarca = '22059';
        codCodigo = 'Papa Johns';
        break;
      case 8:
        codMarca = '22026';
        codCodigo = 'Dunkin Donuts';
        break;
    }
    return codMarca;
  }

  // Agregar Codigo Carta Call
  public obtenerCartaCall(): string {
    //Modificar según especificación de POS
    let idEmpresa = this.empresaService.getEmpresaSeleccionada().idEmpresa;
    let codMarca = '';
    let codCodigo = '';
    switch (idEmpresa) {
      case 2:
        codMarca = '22101'; //Antiguo 22089
        codCodigo = 'Bembos';
        break;
      case 3:
        codMarca = '22098';
        codCodigo = 'Chinawok';
        break;
      case 4:
        codMarca = '22103';
        codCodigo = 'Don Belisario';
        break;
      case 5:
        codMarca = '22107';
        codCodigo = 'Popeyes';
        break;
      case 7:
        codMarca = '22058';
        codCodigo = 'Papa Johns';
        break;
      case 8:
        codMarca = '22033';
        codCodigo = 'Dunkin Donuts';
        break;
    }
    return codMarca;
  }

  // Agregar Codigo Carta Salon
  public obtenerCartaSalon(): string {
    //Modificar según especificación de POS
    let idEmpresa = this.empresaService.getEmpresaSeleccionada().idEmpresa;
    let codMarca = '';
    let codCodigo = '';
    switch (idEmpresa) {
      case 2:
        codMarca = '22139'; //antiguo 22102
        codCodigo = 'Bembos';
        break;
      case 3:
        codMarca = '22091';
        codCodigo = 'Chinawok';
        break;
      case 4:
        codMarca = '22095';
        codCodigo = 'Don Belisario';
        break;
      case 5:
        codMarca = '22097';
        codCodigo = 'Popeyes';
        break;
      case 7:
        codMarca = '22061';
        codCodigo = 'Papa Johns';
        break;
      case 8:
        codMarca = '22030';
        codCodigo = 'Dunkin Donuts';
        break;
    }
    return codMarca;
  }

  public nombreMarca(): string {
    let idEmpresa = this.empresaService.getEmpresaSeleccionada().idEmpresa;
    let codMarca = '';
    let codCodigo = '';
    if (this.selectionTypeCupon == '4' && idEmpresa == 2) {
      codCodigo = 'Bembos-Delivery';
    } else if (this.selectionTypeCupon != '4' && idEmpresa == 2) {
      codCodigo = 'Bembos';
    } else if (this.selectionTypeCupon == '4' && idEmpresa == 5) {
      codCodigo = 'Chinawok-Delivery';
    } else if (this.selectionTypeCupon != '4' && idEmpresa == 5) {
      codCodigo = 'Chinawok';
    } else if (this.selectionTypeCupon == '4' && idEmpresa == 3) {
      codCodigo = 'Belisario Delivery';
    } else if (this.selectionTypeCupon != '4' && idEmpresa == 3) {
      codCodigo = 'Don Belisario';
    } else if (this.selectionTypeCupon == '4' && idEmpresa == 4) {
      codCodigo = 'Popeyes-Delivery';
    } else if (this.selectionTypeCupon != '4' && idEmpresa == 4) {
      codCodigo = 'Popeyes';
    } else if (this.selectionTypeCupon == '4' && idEmpresa == 7) {
      codCodigo = 'Papa Johns-Delivery';
    } else if (this.selectionTypeCupon != '4' && idEmpresa == 7) {
      codCodigo = 'Papa Johns';
    } else if (this.selectionTypeCupon == '4' && idEmpresa == 8) {
      codCodigo = 'Dunkin Delivery';
    } else if (this.selectionTypeCupon != '4' && idEmpresa == 8) {
      codCodigo = 'Dunkin Donuts';
    }
    return codCodigo;
  }

  showTableWeb(event) {
    this.showProductsWeb = event.checked;
    this.getCartaxTipo(this.obtenerCartaWeb(), this.nombreMarca()); //Modificar según especificación de POS
  }
  showTableCall(event) {
    this.showProductsCall = event.checked;
    this.getCartaxTipoCall(this.obtenerCartaCall(), this.nombreMarca()); //Modificar según especificación de POS
  }
  showTableSalon(event) {
    this.showProductsSalon = event.checked;
    this.getCartaxTipoSalon(this.obtenerCartaSalon(), this.nombreMarca()); //Modificar según especificación de POS
  }

  showTableRColas(event) {
    this.showProductsRColas = event.checked;
    this.getCartaxTipoRcolas('22106', 'Bembos-RompeColaLima'); //Modificar según especificación de POS
  }

  valueRadio(event) {
    this.cuponOmni.nroUso = parseInt(this.selectCountTimes);
    if (this.selectCountTimes == '2') {
      this.activeOptions = true;
      this.cantidadActivo = false;
    } else {
      this.activeOptions = true;
      this.cantidadActivo = true;
    }
  }

  public cancelar(): void {
    this.router.navigateByUrl('/home/cupon/lista-cupon-omnicanal');
  }

  public VisCodCupon!: number;
  public VisCodProceso!: number;
  public CantidadAntigua!: number;
  public CantidadAntigu2!: number;
  public CantidadInter!: number;
  public CantidadInte2!: number;

  public getDetailsSelectCupon() {
    const id = Number(sessionStorage.getItem('cupon-omnicanal')!);

    this.cartaService.getCampana(id).subscribe(
      (cuponOmni) => {
        //console.log(cuponOmni);
        this.cuponOmniD = cuponOmni;

        this.CantidadInter = this.cuponOmniD[0].nroCuponAGenerar;
        this.CantidadInte2 = this.cuponOmniD[0].maximouso;

        this.cuponOmni.fecInicio = new Date(
          this.cuponOmniD[0].fecInicio.toString()
        );
        this.cuponOmni.fecFin = new Date(this.cuponOmniD[0].fecFin.toString());
        this.cuponOmni.nombreCampanha = this.cuponOmniD[0].nombreCampanha;
        this.cuponOmni.alianza = this.cuponOmniD[0].alianza;
        this.selectCountTimes = this.cuponOmniD[0].tipo.toString();
        this.VisCodCupon = this.cuponOmniD[0].cuponCabecera;
        this.VisCodProceso = this.cuponOmniD[0].codProceso + 1;
        this.selectionTypeCupon = this.cuponOmniD[0].tipoCupon.toString();
        this.cuponOmni.tipoCupon = this.cuponOmniD[0].tipoCupon;
        this.CantidadAntigua = this.cuponOmniD[0].nroCuponAGenerar;
        this.CantidadAntigu2 = this.cuponOmniD[0].maximouso;
        this.SeleccionOrigen = this.cuponOmniD[0].origen.toString();
        this.SeleccionAliados = this.cuponOmniD[0].aliados.toString();

        this.tipos = this.tipos.filter((r) => {
          return r.codigo == this.cuponOmniD[0].tipoCupon;
        });

        this.origenes = this.origenes.filter((r) => {
          return r.codigo == this.cuponOmniD[0].origen;
        });

        this.Aliados = this.Aliados.filter((r) => {
          return r.codigo == this.cuponOmniD[0].aliados;
        });

        if (this.cuponOmniD[0].tipoCupon) {
          this.tipos.forEach((r) => {
            if (
              r.codigo.toString() === this.cuponOmniD[0].tipoCupon.toString()
            ) {
              this.selectionTypeCupon = r.codigo.toString();
              $('#TiposC').val(r.nombre);
            }
          });
        }

        if (this.cuponOmniD[0].origen) {
          this.origenes.forEach((r) => {
            if (r.codigo.toString() === this.cuponOmniD[0].origen.toString()) {
              this.SeleccionOrigen = r.codigo.toString();
              $('#Origen').val(r.nombre);
            }
          });
        }

        if (this.cuponOmniD[0].aliados) {
          this.Aliados.forEach((r) => {
            if (r.codigo.toString() === this.cuponOmniD[0].aliados.toString()) {
              this.SeleccionAliados = r.codigo.toString();
              $('#Aliados').val(r.nombre);
            }
          });
        }

        if (this.cuponOmniD[0].tipoCupon == 1 && this.cuponOmniD[0].tipo == 1) {
          this.showtipo1 = true;
          this.showtipo2 = false;
          this.showCuponesGenerar = true;
          this.showCantidadMaximaUso = false;
          this.showCodigo = false;
          this.showMontoPagar = true;
          this.showNecesitaMontoMinimo = true;
          this.showMontoMinimo = false;
          this.showCanales = true;
          this.showTableProducts = true;
          this.showMaximoDescuento = false;
          this.shoPorcentajeDescuento = false;
          this.showVacio = false;
          this.showVacio2 = false;
          this.showVacio3 = false;
          this.showDelivery = false;
          this.showMontoDescuento = false;
          this.showExento = true;
        } else if (
          this.cuponOmniD[0].tipoCupon == 1 &&
          this.cuponOmniD[0].tipo == 2
        ) {
          this.showtipo1 = false;
          this.showtipo2 = true;
          this.showCuponesGenerar = true;
          this.showCantidadMaximaUso = true;
          this.showCodigo = true;
          this.cuponOmni.nroCuponAGenerar = 1;
          this.showMontoPagar = true;
          this.showNecesitaMontoMinimo = true;
          this.showMontoMinimo = false;
          this.showCanales = true;
          this.showTableProducts = true;
          this.showMaximoDescuento = false;
          this.shoPorcentajeDescuento = false;
          this.showVacio = false;
          this.showVacio2 = false;
          this.showVacio3 = false;
          this.showDelivery = false;
          this.showMontoDescuento = false;
          this.showExento = true;
        } else if (
          this.cuponOmniD[0].tipoCupon == 2 &&
          this.cuponOmniD[0].tipo == 1
        ) {
          this.showtipo1 = true;
          this.showtipo2 = false;
          this.showCuponesGenerar = true;
          this.showCantidadMaximaUso = false;
          this.showCodigo = false;
          this.showMontoPagar = false;
          this.showNecesitaMontoMinimo = true;
          this.showMontoMinimo = false;
          this.showCanales = true;
          this.showTableProducts = true;
          this.showMaximoDescuento = true;
          this.shoPorcentajeDescuento = true;
          this.showVacio = true;
          this.showVacio2 = true;
          this.showVacio3 = true;
          this.showDelivery = false;
          this.showMontoDescuento = false;
          this.showExento = false;
        } else if (
          this.cuponOmniD[0].tipoCupon == 2 &&
          this.cuponOmniD[0].tipo == 2
        ) {
          this.showtipo1 = false;
          this.showtipo2 = true;
          this.showCuponesGenerar = true;
          this.showCantidadMaximaUso = true;
          this.showCodigo = true;
          this.cuponOmni.nroCuponAGenerar = 1;
          this.showMontoPagar = false;
          this.showNecesitaMontoMinimo = true;
          this.showCanales = true;
          this.showMontoMinimo = false;
          this.showTableProducts = true;
          this.showMaximoDescuento = true;
          this.shoPorcentajeDescuento = true;
          this.showVacio = false;
          this.showDelivery = false;
          this.showMontoDescuento = false;
          this.showExento = false;
        } else if (
          this.cuponOmniD[0].tipoCupon == 3 &&
          this.cuponOmniD[0].tipo == 1
        ) {
          this.showtipo1 = true;
          this.showtipo2 = false;
          this.showCuponesGenerar = true;
          this.showCantidadMaximaUso = false;
          this.showCodigo = false;
          this.showMontoPagar = false;
          this.showNecesitaMontoMinimo = true;
          this.showMontoMinimo = false;
          this.showCanales = true;
          this.showTableProducts = true;
          this.showMaximoDescuento = true;
          this.shoPorcentajeDescuento = true;
          this.showVacio = true;
          this.showVacio2 = true;
          this.showVacio3 = true;
          this.showDelivery = false;
          this.showMontoDescuento = false;
          this.showExento = true;
        } else if (
          this.cuponOmniD[0].tipoCupon == 3 &&
          this.cuponOmniD[0].tipo == 2
        ) {
          this.showtipo1 = false;
          this.showtipo2 = true;
          this.showCuponesGenerar = true;
          this.cuponOmni.nroCuponAGenerar = 1;
          this.showCantidadMaximaUso = true;
          this.showCodigo = true;
          this.showMontoPagar = false;
          this.showNecesitaMontoMinimo = true;
          this.showMontoMinimo = false;
          this.showCanales = true;
          this.showTableProducts = true;
          this.showMaximoDescuento = true;
          this.shoPorcentajeDescuento = true;
          this.showVacio = true;
          this.showDelivery = false;
          this.showMontoDescuento = false;
          this.showExento = true;
        } else if (
          this.cuponOmniD[0].tipoCupon == 4 &&
          this.cuponOmniD[0].tipo == 1
        ) {
          this.showtipo1 = true;
          this.showtipo2 = false;
          this.showCuponesGenerar = true;
          this.showCantidadMaximaUso = false;
          this.showCodigo = false;
          this.showMontoPagar = false;
          this.showNecesitaMontoMinimo = false;
          this.showMontoMinimo = true;
          this.showCanales = true;
          this.showTableProducts = true;
          this.showMaximoDescuento = false;
          this.shoPorcentajeDescuento = false;
          this.showVacio = true;
          this.showVacio2 = true;
          this.showVacio3 = false;
          this.showDelivery = true;
          this.cuponOmni.percentdsct = 100;
          this.showMontoDescuento = false;
          this.showExento = true;
        } else if (
          this.cuponOmniD[0].tipoCupon == 4 &&
          this.cuponOmniD[0].tipo == 2
        ) {
          this.showtipo1 = false;
          this.showtipo2 = true;
          this.showCuponesGenerar = true;
          this.cuponOmni.nroCuponAGenerar = 1;
          this.showCantidadMaximaUso = true;
          this.showCodigo = true;
          this.showMontoPagar = false;
          this.showNecesitaMontoMinimo = false;
          this.showMontoMinimo = true;
          this.showCanales = true;
          this.showTableProducts = true;
          this.showMaximoDescuento = false;
          this.shoPorcentajeDescuento = false;
          this.showVacio = true;
          this.showDelivery = true;
          this.cuponOmni.percentdsct = 100;
          this.showMontoDescuento = false;
          this.showExento = true;
        } else if (
          this.cuponOmniD[0].tipoCupon == 5 &&
          this.cuponOmniD[0].tipo == 1
        ) {
          this.showtipo1 = true;
          this.showtipo2 = false;
          this.showCuponesGenerar = true;
          this.showCantidadMaximaUso = false;
          this.showCodigo = false;
          this.showMontoPagar = false;
          this.showNecesitaMontoMinimo = false;
          this.showMontoMinimo = true;
          this.showCanales = false;
          this.showTableProducts = false;
          this.showMaximoDescuento = false;
          this.shoPorcentajeDescuento = false;
          this.showVacio = true;
          this.showVacio2 = true;
          this.showVacio3 = false;
          this.showDelivery = false;
          this.showMontoDescuento = true;
          this.showExento = true;
        } else if (
          this.cuponOmniD[0].tipoCupon == 5 &&
          this.cuponOmniD[0].tipo == 2
        ) {
          this.showtipo1 = false;
          this.showtipo2 = true;
          this.showCuponesGenerar = true;
          this.showCantidadMaximaUso = true;
          this.cuponOmni.nroCuponAGenerar = 1;
          this.showCodigo = true;
          this.showMontoPagar = false;
          this.showNecesitaMontoMinimo = false;
          this.showMontoMinimo = true;
          this.showCanales = false;
          this.showTableProducts = false;
          this.showMaximoDescuento = false;
          this.shoPorcentajeDescuento = false;
          this.showVacio = true;
          this.showDelivery = false;
          this.showMontoDescuento = true;
          this.showExento = true;
        } else if (
          this.cuponOmniD[0].tipoCupon == 6 &&
          this.cuponOmniD[0].tipo == 1
        ) {
          this.showtipo1 = true;
          this.showtipo2 = false;
          this.showCuponesGenerar = true;
          this.showCantidadMaximaUso = false;
          this.showCodigo = false;
          this.showMontoPagar = false;
          this.showNecesitaMontoMinimo = false;
          this.showMontoMinimo = true;
          this.showCanales = false;
          this.showTableProducts = false;
          this.showMaximoDescuento = true;
          this.shoPorcentajeDescuento = true;
          this.showVacio = false;
          this.showVacio2 = false;
          this.showVacio3 = false;
          this.showDelivery = false;
          this.showMontoDescuento = false;
          this.showExento = false;
        } else if (
          this.cuponOmniD[0].tipoCupon == 6 &&
          this.cuponOmniD[0].tipo == 2
        ) {
          this.showtipo1 = false;
          this.showtipo2 = true;
          this.showCuponesGenerar = true;
          this.showCantidadMaximaUso = true;
          this.showCodigo = true;
          this.cuponOmni.nroCuponAGenerar = 1;
          this.showMontoPagar = false;
          this.showNecesitaMontoMinimo = false;
          this.showMontoMinimo = true;
          this.showCanales = false;
          this.showTableProducts = false;
          this.showMaximoDescuento = true;
          this.shoPorcentajeDescuento = true;
          this.showVacio = false;
          this.showDelivery = false;
          this.showMontoDescuento = false;
          this.showExento = false;
        } else if (
          this.cuponOmniD[0].tipoCupon == 7 &&
          this.cuponOmniD[0].tipo == 1
        ) {
          this.showtipo1 = true;
          this.showtipo2 = false;
          this.showCuponesGenerar = true;
          this.showCantidadMaximaUso = false;
          this.showCodigo = false;
          this.showMontoPagar = false;
          this.showNecesitaMontoMinimo = false;
          this.showMontoMinimo = false;
          this.showCanales = true;
          this.showTableProducts = true;
          this.showMaximoDescuento = false;
          this.shoPorcentajeDescuento = false;
          this.showVacio = true;
          this.showVacio2 = true;
          this.showVacio3 = true;
          this.showDelivery = false;
          this.showMontoDescuento = false;
          this.showExento = true;

        } else if (
          this.cuponOmniD[0].tipoCupon == 7 &&
          this.cuponOmniD[0].tipo == 2
        ) {
          this.showtipo1 = false;
          this.showtipo2 = true;
          this.showCuponesGenerar = true;
          this.cuponOmni.nroCuponAGenerar = 1;
          this.showCantidadMaximaUso = true;
          this.showCodigo = true;
          this.showMontoPagar = false;
          this.showNecesitaMontoMinimo = false;
          this.showMontoMinimo = false;
          this.showCanales = true;
          this.showTableProducts = true;
          this.showMaximoDescuento = false;
          this.shoPorcentajeDescuento = false;
          this.showVacio = true;
          this.showDelivery = false;
          this.showMontoDescuento = false;
          this.showExento = true;

        } else if (
          this.cuponOmniD[0].tipoCupon == 8 && 
          this.cuponOmniD[0].tipo == 1
        ) {
          this.showtipo1 = true;
          this.showtipo2 = false;
          this.showCuponesGenerar = true;
          this.showCantidadMaximaUso = false;
          this.showCodigo = false;
          this.showMontoPagar = true;
          this.showNecesitaMontoMinimo = true;
          this.showMontoMinimo = false;
          this.showCanales = true;
          this.showTableProducts = true;
          this.showMaximoDescuento = false;
          this.shoPorcentajeDescuento = false;
          this.showVacio = false;
          this.showVacio2 = false;
          this.showVacio3 = false;
          this.showDelivery = false;
          this.showMontoDescuento = false;
          this.showExento = true;
        } else if (
          this.cuponOmniD[0].tipoCupon == 8 && 
          this.cuponOmniD[0].tipo == 2
        ) {
          this.showtipo1 = false;
          this.showtipo2 = true;
          this.showCuponesGenerar = true;
          this.showCantidadMaximaUso = true;
          this.showCodigo = true;
          this.cuponOmni.nroCuponAGenerar = 1;
          this.showMontoPagar = true;
          this.showNecesitaMontoMinimo = true;
          this.showMontoMinimo = false;
          this.showCanales = true;
          this.showTableProducts = true;
          this.showMaximoDescuento = false;
          this.shoPorcentajeDescuento = false;
          this.showVacio = false;
          this.showVacio2 = false;
          this.showVacio3 = false;
          this.showDelivery = false;
          this.showMontoDescuento = false;
          this.showExento = true;
        }

        // if (this.cuponOmniD[0].tipoCupon == 1 && this.cuponOmniD[0].tipo == 1) {

        //     this.cuponOmni.monto = this.cuponOmniD[0].monto;
        //     this.cuponOmni.montoMax = this.cuponOmniD[0].montoMax;
        //     this.cuponOmni.compraMin = this.cuponOmniD[0].compraMin;
        //     this.cuponOmni.nroCuponAGenerar = this.cuponOmniD[0].nroCuponAGenerar;
        // }

        // else if (this.cuponOmniD[0].tipoCupon == 1 && this.cuponOmniD[0].tipo == 2) {
        //   this.cuponOmni.codigo = this.cuponOmniD[0].codigo;
        //   this.cuponOmni.monto = this.cuponOmniD[0].monto;
        //   this.cuponOmni.nroUso = this.cuponOmniD[0].nroUso;
        //   this.cuponOmni.montoMax = this.cuponOmniD[0].montoMax;
        //   this.cuponOmni.compraMin = this.cuponOmniD[0].compraMin;
        // }

        if (this.cuponOmniD[0].tipoCupon == 1 && this.cuponOmniD[0].tipo == 1) {
          this.cuponOmni.nroCuponAGenerar = 0;
          this.cuponOmni.monto = this.cuponOmniD[0].monto;
          this.cuponOmni.activoCompraMin = this.cuponOmniD[0].activoCompraMin;
          this.cuponOmni.compraMin = this.cuponOmniD[0].compraMin;
          this.activarBlur(this.cuponOmni.monto, 'monto');
        } else if (
          this.cuponOmniD[0].tipoCupon == 1 &&
          this.cuponOmniD[0].tipo == 2
        ) {
          // this.cuponOmni.nroCuponAGenerar = this.cuponOmniD[0].nroCuponAGenerar;
          this.cuponOmni.monto = this.cuponOmniD[0].monto;
          this.cuponOmni.activoCompraMin = this.cuponOmniD[0].activoCompraMin;
          this.cuponOmni.compraMin = this.cuponOmniD[0].compraMin;
          this.cuponOmni.nroUso = this.cuponOmniD[0].maximouso;
          this.cuponOmni.codigo = this.cuponOmniD[0].codigo;
          this.activarBlur(this.cuponOmni.monto, 'monto');
        } else if (
          this.cuponOmniD[0].tipoCupon == 2 &&
          this.cuponOmniD[0].tipo == 1
        ) {
          this.cuponOmni.nroCuponAGenerar = 0;
          this.cuponOmni.activoCompraMin = this.cuponOmniD[0].activoCompraMin;
          this.cuponOmni.compraMin = this.cuponOmniD[0].compraMin;
          this.cuponOmni.montoMax = this.cuponOmniD[0].montoMax;
          this.cuponOmni.percentdsct = this.cuponOmniD[0].percentdsct;
          this.activarBlur(this.cuponOmni.montoMax, 'montoMax');
          this.activarBlur(this.cuponOmni.percentdsct, 'percentdsct');
        } else if (
          this.cuponOmniD[0].tipoCupon == 2 &&
          this.cuponOmniD[0].tipo == 2
        ) {
          // this.cuponOmni.nroCuponAGenerar = this.cuponOmniD[0].nroCuponAGenerar;
          this.cuponOmni.activoCompraMin = this.cuponOmniD[0].activoCompraMin;
          this.cuponOmni.compraMin = this.cuponOmniD[0].compraMin;
          this.cuponOmni.nroUso = this.cuponOmniD[0].maximouso;
          this.cuponOmni.codigo = this.cuponOmniD[0].codigo;
          this.cuponOmni.montoMax = this.cuponOmniD[0].montoMax;
          this.cuponOmni.percentdsct = this.cuponOmniD[0].percentdsct;
          this.activarBlur(this.cuponOmni.montoMax, 'montoMax');
          this.activarBlur(this.cuponOmni.percentdsct, 'percentdsct');
        } else if (
          this.cuponOmniD[0].tipoCupon == 3 &&
          this.cuponOmniD[0].tipo == 1
        ) {
          this.cuponOmni.nroCuponAGenerar = 0;
          this.cuponOmni.activoCompraMin = this.cuponOmniD[0].activoCompraMin;
          this.cuponOmni.compraMin = this.cuponOmniD[0].compraMin;
          this.cuponOmni.montoMax = this.cuponOmniD[0].montoMax;
          this.cuponOmni.percentdsct = this.cuponOmniD[0].percentdsct;
          this.activarBlur(this.cuponOmni.montoMax, 'montoMax');
          this.activarBlur(this.cuponOmni.percentdsct, 'percentdsct');
        } else if (
          this.cuponOmniD[0].tipoCupon == 3 &&
          this.cuponOmniD[0].tipo == 2
        ) {
          // this.cuponOmni.nroCuponAGenerar = this.cuponOmniD[0].nroCuponAGenerar;
          this.cuponOmni.activoCompraMin = this.cuponOmniD[0].activoCompraMin;
          this.cuponOmni.compraMin = this.cuponOmniD[0].compraMin;
          this.cuponOmni.nroUso = this.cuponOmniD[0].maximouso;
          this.cuponOmni.codigo = this.cuponOmniD[0].codigo;
          this.cuponOmni.montoMax = this.cuponOmniD[0].montoMax;
          this.cuponOmni.percentdsct = this.cuponOmniD[0].percentdsct;
          this.activarBlur(this.cuponOmni.montoMax, 'montoMax');
          this.activarBlur(this.cuponOmni.percentdsct, 'percentdsct');
        } else if (
          this.cuponOmniD[0].tipoCupon == 4 &&
          this.cuponOmniD[0].tipo == 1
        ) {
          this.cuponOmni.nroCuponAGenerar = 0;
          this.cuponOmni.activoCompraMin = this.cuponOmniD[0].activoCompraMin;
          this.cuponOmni.compraMin = this.cuponOmniD[0].compraMin;
          this.cuponOmni.percentdsct = this.cuponOmniD[0].delivery;
          this.activarBlur(this.cuponOmni.percentdsct, 'percentdsct');
        } else if (
          this.cuponOmniD[0].tipoCupon == 4 &&
          this.cuponOmniD[0].tipo == 2
        ) {
          // this.cuponOmni.nroCuponAGenerar = this.cuponOmniD[0].nroCuponAGenerar;
          this.cuponOmni.activoCompraMin = this.cuponOmniD[0].activoCompraMin;
          this.cuponOmni.compraMin = this.cuponOmniD[0].compraMin;
          this.cuponOmni.percentdsct = this.cuponOmniD[0].delivery;
          this.cuponOmni.nroUso = this.cuponOmniD[0].maximouso;
          this.cuponOmni.codigo = this.cuponOmniD[0].codigo;
        } else if (
          this.cuponOmniD[0].tipoCupon == 5 &&
          this.cuponOmniD[0].tipo == 1
        ) {
          this.cuponOmni.nroCuponAGenerar = 0;
          
          if (this.cuponOmniD[0].activoCompraMin == 1) {
            this.isChecked = true;
          }
          this.cuponOmni.compraMin = this.cuponOmniD[0].compraMin;
          this.cuponOmni.percentdsct = this.cuponOmniD[0].montodescuento;
          this.activarBlur(this.cuponOmni.percentdsct, 'percentdsct');
        } else if (
          this.cuponOmniD[0].tipoCupon == 5 &&
          this.cuponOmniD[0].tipo == 2
        ) {
          // this.cuponOmni.nroCuponAGenerar = this.cuponOmniD[0].nroCuponAGenerar;
          if (this.cuponOmniD[0].activoCompraMin == 1) {
            this.isChecked = true;
          }
          this.cuponOmni.compraMin = this.cuponOmniD[0].compraMin;
          this.cuponOmni.percentdsct = this.cuponOmniD[0].montodescuento;
          this.cuponOmni.nroUso = this.cuponOmniD[0].maximouso;
          this.cuponOmni.codigo = this.cuponOmniD[0].codigo;

          this.activarBlur(this.cuponOmni.percentdsct, 'percentdsct');
        } else if (
          this.cuponOmniD[0].tipoCupon == 6 &&
          this.cuponOmniD[0].tipo == 1
        ) {
          this.cuponOmni.nroCuponAGenerar = 0;
          this.cuponOmni.compraMin = this.cuponOmniD[0].compraMin;
          this.cuponOmni.montoMax = this.cuponOmniD[0].montoMax;
          this.cuponOmni.percentdsct = this.cuponOmniD[0].percentdsct;
          this.activarBlur(this.cuponOmni.montoMax, 'montoMax');
          this.activarBlur(this.cuponOmni.percentdsct, 'percentdsct');
        } else if (
          this.cuponOmniD[0].tipoCupon == 6 &&
          this.cuponOmniD[0].tipo == 2
        ) {
          // this.cuponOmni.nroCuponAGenerar = this.cuponOmniD[0].nroCuponAGenerar;
          this.cuponOmni.compraMin = this.cuponOmniD[0].compraMin;
          this.cuponOmni.montoMax = this.cuponOmniD[0].montoMax;
          this.cuponOmni.percentdsct = this.cuponOmniD[0].percentdsct;
          this.cuponOmni.nroUso = this.cuponOmniD[0].maximouso;
          this.cuponOmni.codigo = this.cuponOmniD[0].codigo;
          this.activarBlur(this.cuponOmni.montoMax, 'montoMax');
          this.activarBlur(this.cuponOmni.percentdsct, 'percentdsct');
        } else if (
          this.cuponOmniD[0].tipoCupon == 7 &&
          this.cuponOmniD[0].tipo == 1
        ) {
          //this.cuponOmni.nroCuponAGenerar = this.cuponOmniD[0].nroCuponAGenerar;
          this.cuponOmni.nroCuponAGenerar = 0;
        } else if (
          this.cuponOmniD[0].tipoCupon == 7 &&
          this.cuponOmniD[0].tipo == 2
        ) {
          //this.cuponOmni.nroCuponAGenerar = this.cuponOmniD[0].nroCuponAGenerar;
          this.cuponOmni.nroCuponAGenerar = 1;
          this.cuponOmni.nroUso = this.cuponOmniD[0].maximouso;
          this.cuponOmni.codigo = this.cuponOmniD[0].codigo;
        } else if (
          this.cuponOmniD[0].tipoCupon == 8 && 
          this.cuponOmniD[0].tipo == 1
        ) {
          this.cuponOmni.nroCuponAGenerar = 0;
          this.cuponOmni.monto = this.cuponOmniD[0].monto;
          this.cuponOmni.activoCompraMin = this.cuponOmniD[0].activoCompraMin;
          this.cuponOmni.compraMin = this.cuponOmniD[0].compraMin;
          this.activarBlur(this.cuponOmni.monto,'monto');         
        } else if (
          this.cuponOmniD[0].tipoCupon == 8 && 
          this.cuponOmniD[0].tipo == 2
        ) {
          // this.cuponOmni.nroCuponAGenerar = this.cuponOmniD[0].nroCuponAGenerar;
          this.cuponOmni.monto = this.cuponOmniD[0].monto;
          this.cuponOmni.activoCompraMin = this.cuponOmniD[0].activoCompraMin;
          this.cuponOmni.compraMin = this.cuponOmniD[0].compraMin;
          this.cuponOmni.nroUso = this.cuponOmniD[0].maximouso;
          this.cuponOmni.codigo = this.cuponOmniD[0].codigo;
          this.activarBlur(this.cuponOmni.monto,'monto');
        }

        this.cartaService.getDetalleVales(id).subscribe(
          (detalles) => {
            this.spinner.hide();
            this.detalles = detalles;
          },
          (err) => {
            this.spinner.hide();
            swal.fire(
              'Error',
              err.error.mensaje === undefined
                ? err.error.message
                : err.error.mensaje,
              'error'
            );
            this.type = 'V';
          }
        );
        
      },
      (err) => {
        this.spinner.hide();
        swal.fire(
          'Error',
          err.error.mensaje === undefined
            ? err.error.message
            : err.error.mensaje,
          'error'
        );
        this.type = 'V';
      }
    );
  }

  public getCartaxTipo(menuIndex: string, marca: string) {
    this.spinner.show();

    let dto = new OmnicanalDto();
    dto.carta = menuIndex;
    dto.marca = marca;

    this.cartaService.getDataCartaxTipo(dto).subscribe(
      (carta) => {
        this.productosCartaWebTemp = carta;
        this.productosCartaWeb = this.productosCartaWebTemp;
        this.spinner.hide();
      },
      (err) => {
        this.spinner.hide();
        swal.fire('Error', 'Error al cargar la carta.', 'error');
      }
    );
  }

  public getCartaxTipoCall(menuIndex: string, marca: string) {
    this.spinner.show();

    let dto = new OmnicanalDto();
    dto.carta = menuIndex;
    dto.marca = marca;

    this.cartaService.getDataCartaxTipo(dto).subscribe(
      (carta) => {
        this.productosCartaCallCenterTemp = carta;
        this.productosCartaCallCenter = this.productosCartaCallCenterTemp;
        this.spinner.hide();
      },
      (err) => {
        this.spinner.hide();
        swal.fire('Error', 'Error al cargar la carta.', 'error');
      }
    );
  }

  public getCartaxTipoRcolas(menuIndex: string, marca: string) {
    this.spinner.show();

    let dto = new OmnicanalDto();
    dto.carta = menuIndex;
    dto.marca = marca;

    this.cartaService.getDataCartaxTipo(dto).subscribe(
      (carta) => {
        this.productosRcolasTemp = carta;
        this.productosCartaRcolas = this.productosRcolasTemp;
        this.spinner.hide();
      },
      (err) => {
        this.spinner.hide();
        swal.fire('Error', 'Error al cargar la carta.', 'error');
      }
    );
  }

  public getCartaxTipoSalon(menuIndex: string, marca: string) {
    this.spinner.show();

    let dto = new OmnicanalDto();
    dto.carta = menuIndex;
    dto.marca = marca;

    this.cartaService.getDataCartaxTipo(dto).subscribe(
      (carta) => {
        this.productosCartaSalonTemp = carta;
        this.productosCartaSalon = this.productosCartaSalonTemp;
        this.spinner.hide();
      },
      (err) => {
        this.spinner.hide();
        swal.fire('Error', 'Error al cargar la carta.', 'error');
      }
    );
  }

  public onRowSelectProduct(event) {
    this.selectionProduct = event.data;
    //console.log("this.selectionProduct", this.selectionProduct);
  }

  public onRowSelectUnselectProduct() {
    this.selectionProduct = {
      carta: '',
      nombre: '',
      codigo: '',
      detalle: '',
      menu: '',
      producto: '',
    };
  }

  public addProductwithAcount(cantidad: HTMLInputElement) {
    // console.log("this.selectionProduct", this.selectionProduct);

    let cant = parseInt(cantidad.value);
    if (cant > 0) {
      if (this.selectionTypeCupon == '1') {
        if (cant == 1) {
          this.addProduct(cantidad);
        } else {
          Swal.fire('Producto.', 'Cupón solo adminte cantidad 1.', 'error');
        }
      } else {
        this.addProduct(cantidad);
      }
    } else {
      Swal.fire('Producto.', 'La Cantidad debe ser mayor a 0.', 'error');
    }
  }

  private addProduct(cantidad: any): void {
    let canalDetalle_temp: CanalDetalle = new CanalDetalle();

    switch (this.selectionProduct.carta) {
      case 'Web':
        canalDetalle_temp.canal = 1;
        break;
      case 'Call Center':
        canalDetalle_temp.canal = 2;
        break;
      case 'Carta Salon':
        canalDetalle_temp.canal = 3;
        break;
      default:
        canalDetalle_temp.canal = 0;
    }

    canalDetalle_temp.producto = this.selectionProduct.codigo;
    canalDetalle_temp.cantidad = parseInt(cantidad.value);

    let push: boolean = false;
    this.cuponOmni.canaldetalle.forEach((cup) => {
      if (
        cup.canal == canalDetalle_temp.canal &&
        cup.producto === this.selectionProduct.codigo
      ) {
        cup.cantidad = canalDetalle_temp.cantidad;
        this.cartaService.updateProductTableSelect({
          carta: this.selectionProduct.carta,
          nombre: this.selectionProduct.nombre,
          codigo: this.selectionProduct.codigo,
          cantidad: cantidad.value,
        });
        push = true;
      }
    });

    if (!push) {
      this.cuponOmni.canaldetalle.push(canalDetalle_temp);
      this.cartaService.addProductTableSelect({
        carta: this.selectionProduct.carta,
        nombre: this.selectionProduct.nombre,
        codigo: this.selectionProduct.codigo,
        cantidad: cantidad.value,
      });
    }

    //console.log("cuponOmni", this.cuponOmni);

    this.displayModal = false;
    cantidad.value = '0';
    this.selectionProduct = {
      carta: '',
      nombre: '',
      codigo: '',
      detalle: '',
      menu: '',
      producto: '',
    };
  }

  public obtenerMarcaSeleccionada(): string {
    //Modificar según especificación de POS
    let idEmpresa = this.empresaService.getEmpresaSeleccionada().idEmpresa;
    let sMarca = '';
    switch (idEmpresa) {
      case 2:
        sMarca = 'BEMBOS';
        break;
      case 3:
        sMarca = 'BELISARIO';
        break;
      case 4:
        sMarca = 'POPEYES';
        break;
      case 5:
        sMarca = 'CHINAWOK';
        break;
      case 7:
        sMarca = 'PAPA JOHNS';
        break;
      case 8:
        sMarca = 'DUNKIN';
        break;
    }
    return sMarca;
  }

  public valueMinimo(event: Event) {

    if (
      this.selectionTypeCupon == '2' || 
      this.selectionTypeCupon == '3' ||
      this.selectionTypeCupon == '7'
      ) {
        
        if (event["checked"]) {
          this.showVacio = false;
          this.showVacio2 = true;
          this.showVacio3 = true;
        } else {
          this.showVacio = true;
          this.showVacio2 = true;
          this.showVacio3 = true;
        }
    } else if (
      this.selectionTypeCupon == '4' ||
      this.selectionTypeCupon == '5' ||
      this.selectionTypeCupon == '6'
    ) {
      if (event["checked"]) {
        this.showVacio = true;
        this.showVacio2 = false;
        this.showVacio3 = false;
      } else {
        this.showVacio = false;
        this.showVacio2 = true;
        this.showVacio3 = false;
      }
    }

    if (event["checked"]) {
      this.cuponOmni.activoCompraMin = 1;
      this.showMontoMinimo = true;
      //this.isChecked = true;
    } else {
      this.cuponOmni.activoCompraMin = 2;
      this.showMontoMinimo = false;

      //this.isChecked = false;
    }
    //console.log(this.isChecked);
    //console.log(this.cuponOmni.activoCompraMin);
  }

  public isClicked: boolean = false;

  public bloquear(): void {
    this.isClicked = true;
  }

  public guardarCupon() {
    this.spinner.show();
    this.GeneraTokenYCreaCampanha();
  }

  private Validacion!: number;

  public MasCupones() {
    var ruta = `${this.urlLista}/ValidarCreacion`;

    this.ajaxQueryPostValida(ruta);

    if (this.Validacion == 1) {
      sessionStorage.removeItem('token_genesys');
      this.GeneraTokenYCreaCupones();
    } else {
      swal.fire(
        'Alto',
        'Se debe crear una nueva campaña cada 30 minutos',
        'error'
      );
    }
  }

  private GeneraTokenYCreaCupones(): void {
    sessionStorage.removeItem('token_genesys');
    this.spinner.show();
    this.dataCupones.TokenClient().subscribe(
      (resp) => {
        this.GeneraMasCupones();
      },
      (e) => {
        console.error(e);
        Swal.fire('Error', e.message, 'error');
      }
    );
  }

  private GeneraTokenYCreaCampanha(): void {
    sessionStorage.removeItem('token_genesys');
    this.spinner.show();
    this.dataCupones.TokenClient().subscribe(
      (resp) => {
        this.dataCupones.registrarLog(
          'Omnicanal',
          'Crear Campanha',
          `${this.cuponOmni.codigo} Token creado`
        );
        var sumaCant = this.cuponOmni.nroCuponAGenerar * this.CartaFinal.length;
        if (sumaCant < 1000001) {
          this.validaYCreaCampanha();
        } else {
          Swal.fire(
            'Advertencia',
            'Excediste el número máximo de registros a generar (1,000,000)',
            'warning'
          );
          this.spinner.hide();
          this.dataCupones.registrarLog(
            'Omnicanal',
            'Crear Campanha',
            `${this.cuponOmni.codigo} - Numero de cupones mayor a 1,000,000`
          );
        }
      },
      (e) => {
        console.error(e);
        this.spinner.hide();
        Swal.fire('Error', e.message, 'error');
      }
    );
  }

  private FormatoFecha(date = new Date()): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd HH:mm:ss').toString();
  }

  private GeneraMasCupones(): void {
    var tipo = parseInt(this.selectCountTimes);
    var EXternoV: number;
    if (this.Exento == 'Exento') {
      EXternoV = 1;
    } else {
      EXternoV = 0;
    }
    this.spinner.hide();
    var fecinicio, fecfin, fecRegistro;
    var fecactual = new Date();
    fecinicio =
      this.cuponOmni.fecInicio.getFullYear() +
      '-' +
      (this.cuponOmni.fecInicio.getMonth() + 1).toString().padStart(2, '0') +
      '-' +
      this.cuponOmni.fecInicio.getDate().toString().padStart(2, '0') +
      ' ' +
      this.cuponOmni.fecInicio.getHours().toString().padStart(2, '0') +
      ':' +
      this.cuponOmni.fecInicio.getMinutes().toString().padStart(2, '0') +
      ':' +
      this.cuponOmni.fecInicio.getSeconds().toString().padStart(2, '0');
    fecfin =
      this.cuponOmni.fecFin.getFullYear() +
      '-' +
      (this.cuponOmni.fecFin.getMonth() + 1).toString().padStart(2, '0') +
      '-' +
      this.cuponOmni.fecFin.getDate().toString().padStart(2, '0') +
      ' ' +
      this.cuponOmni.fecFin.getHours().toString().padStart(2, '0') +
      ':' +
      this.cuponOmni.fecFin.getMinutes().toString().padStart(2, '0') +
      ':' +
      this.cuponOmni.fecFin.getSeconds().toString().padStart(2, '0');
    fecRegistro =
      fecactual.getFullYear() +
      '-' +
      (fecactual.getMonth() + 1).toString().padStart(2, '0') +
      '-' +
      fecactual.getDate().toString().padStart(2, '0') +
      ' ' +
      fecactual.getHours().toString().padStart(2, '0') +
      ':' +
      fecactual.getMinutes().toString().padStart(2, '0') +
      ':' +
      fecactual.getSeconds().toString().padStart(2, '0');

    if (this.callVal == 'carta-call') {
      this.CartaFinaltipos.push({
        canal: 1,
        producto: '',
        cantidad: 1,
        nombreProducto: 'SN',
      });
    }
    if (this.webVal == 'carta-web') {
      this.CartaFinaltipos.push({
        canal: 2,
        producto: '',
        cantidad: 1,
        nombreProducto: 'SN',
      });
    }
    if (this.salonVal == 'carta-salon') {
      this.CartaFinaltipos.push({
        canal: 0,
        producto: '',
        cantidad: 1,
        nombreProducto: 'SN',
      });
    }
    if (this.salonVal == 'carta-rcolas') {
      this.CartaFinaltipos.push({
        canal: 100,
        producto: '',
        cantidad: 1,
        nombreProducto: 'SN',
      });
    }

    if (this.detalles.length > 0) {
      for (let index = 0; index < this.detalles.length; index++) {
        var element = this.detalles[index].canal;
        var canal = 0;
        if (element == 'Web') {
          canal = 2;
        } else if (element == 'Call Center') {
          canal = 1;
        } else if (element == 'Salon') {
          canal = 0;
        } else {
          canal = 2;
        }

        this.CartaFinal.push({
          canal: canal,
          producto: this.detalles[index].nomProducto,
          cantidad: this.cuponOmni.nroCuponAGenerar,
          nombreProducto: this.detalles[index].codProducto,
        });
      }
    } else {
      this.CartaFinaltipos.push({
        canal: 1,
        producto: '',
        cantidad: 1,
        nombreProducto: 'SN',
      });
      this.CartaFinaltipos.push({
        canal: 2,
        producto: '',
        cantidad: 1,
        nombreProducto: 'SN',
      });
      this.CartaFinaltipos.push({
        canal: 0,
        producto: '',
        cantidad: 1,
        nombreProducto: 'SN',
      });
    }

    if (this.selectionTypeCupon == '1' && tipo == 1) {
      this.cuponOmni2 = {
        nombreCampanha: this.cuponOmni.nombreCampanha.toUpperCase(),
        activoCompraMin: 1,
        codMarca: this.empresaService
          .getEmpresaSeleccionada()
          .idEmpresa.toString(),
        monto: this.cuponOmni.monto,
        idTipoCupon: this.cuponOmni.tipoCupon,
        usuarioReg: this.getUsuario(),
        fecInicio: fecinicio,
        fecFin: fecfin,
        nroUso: 1,
        anulado: 0,
        montoMax: this.cuponOmni.montoMax,
        compraMin: this.cuponOmni.compraMin,
        estado: 0,
        cantidadProductUso: 1,
        validaDelivery: 0,
        fecReg: fecRegistro,
        fecActualizacion: '',
        usuarioActualizacion: '',
        cantidadRedimido: 0,
        alianza: this.cuponOmni.alianza.toUpperCase(),
        nroCuponAGenerar: this.cuponOmni.nroCuponAGenerar,
        canalDetalle: this.CartaFinal,
        procesoId: this.VisCodProceso,
        cabeceraId: this.VisCodCupon,
      };
    } else if (this.selectionTypeCupon == '1' && tipo == 2) {
      this.cuponOmni2 = {
        nombreCampanha: this.cuponOmni.nombreCampanha.toUpperCase(),
        nombreCupon: this.cuponOmni.codigo.toUpperCase(),
        activoCompraMin: 1,
        codMarca: this.empresaService
          .getEmpresaSeleccionada()
          .idEmpresa.toString(),
        monto: this.cuponOmni.monto,
        idTipoCupon: this.cuponOmni.tipoCupon,
        usuarioReg: this.getUsuario(),
        fecInicio: fecinicio,
        fecFin: fecfin,
        nroUso: this.cuponOmni.nroUso,
        anulado: 0,
        montoMax: this.cuponOmni.montoMax,
        compraMin: this.cuponOmni.compraMin,
        estado: 0,
        cantidadProductUso: 1,
        validaDelivery: 0,
        fecReg: fecRegistro,
        fecActualizacion: '',
        usuarioActualizacion: '',
        cantidadRedimido: 0,
        alianza: this.cuponOmni.alianza.toUpperCase(),
        canalDetalle: this.CartaFinal,
        procesoId: this.VisCodProceso,
        cabeceraId: this.VisCodCupon,
      };
    } else if (this.selectionTypeCupon == '2' && tipo == 1) {
      this.cuponOmni2 = {
        nombreCampanha: this.cuponOmni.nombreCampanha.toUpperCase(),
        activoCompraMin: 1,
        codMarca: this.empresaService
          .getEmpresaSeleccionada()
          .idEmpresa.toString(),
        monto: this.cuponOmni.percentdsct,
        idTipoCupon: this.cuponOmni.tipoCupon,
        usuarioReg: this.getUsuario(),
        fecInicio: fecinicio,
        fecFin: fecfin,
        nroUso: 1,
        nroCuponAGenerar: this.cuponOmni.nroCuponAGenerar,
        montoMax: this.cuponOmni.montoMax,
        anulado: 0,
        compraMin: this.cuponOmni.compraMin,
        estado: 0,
        cantidadProductUso: 1,
        validaDelivery: EXternoV,
        fecReg: fecRegistro,
        fecActualizacion: '',
        usuarioActualizacion: '',
        cantidadRedimido: 0,
        alianza: this.cuponOmni.alianza.toUpperCase(),
        canalDetalle: this.CartaFinal,
        procesoId: this.VisCodProceso,
        cabeceraId: this.VisCodCupon,
      };
    } else if (this.selectionTypeCupon == '2' && tipo == 2) {
      this.cuponOmni2 = {
        nombreCampanha: this.cuponOmni.nombreCampanha.toUpperCase(),
        nombreCupon: this.cuponOmni.codigo.toUpperCase(),
        activoCompraMin: 1,
        codMarca: this.empresaService
          .getEmpresaSeleccionada()
          .idEmpresa.toString(),
        monto: this.cuponOmni.percentdsct,
        idTipoCupon: this.cuponOmni.tipoCupon,
        usuarioReg: this.getUsuario(),
        fecInicio: fecinicio,
        fecFin: fecfin,
        nroUso: this.cuponOmni.nroUso,
        montoMax: this.cuponOmni.montoMax,
        anulado: 0,
        compraMin: this.cuponOmni.compraMin,
        estado: 0,
        cantidadProductUso: 1,
        validaDelivery: EXternoV,
        fecReg: fecRegistro,
        fecActualizacion: '',
        usuarioActualizacion: '',
        cantidadRedimido: 0,
        alianza: this.cuponOmni.alianza.toUpperCase(),
        canalDetalle: this.CartaFinal,
        procesoId: this.VisCodProceso,
        cabeceraId: this.VisCodCupon,
      };
    } else if (this.selectionTypeCupon == '3' && tipo == 1) {
      this.cuponOmni2 = {
        nombreCampanha: this.cuponOmni.nombreCampanha.toUpperCase(),
        activoCompraMin: 1,
        codMarca: this.empresaService
          .getEmpresaSeleccionada()
          .idEmpresa.toString(),
        monto: this.cuponOmni.percentdsct,
        idTipoCupon: this.cuponOmni.tipoCupon,
        usuarioReg: this.getUsuario(),
        fecInicio: fecinicio,
        fecFin: fecfin,
        nroUso: 1,
        nroCuponAGenerar: this.cuponOmni.nroCuponAGenerar,
        montoMax: this.cuponOmni.montoMax,
        anulado: 0,
        compraMin: this.cuponOmni.compraMin,
        estado: 0,
        cantidadProductUso: 1,
        validaDelivery: 0,
        fecReg: fecRegistro,
        fecActualizacion: '',
        usuarioActualizacion: '',
        cantidadRedimido: 0,
        alianza: this.cuponOmni.alianza.toUpperCase(),
        canalDetalle: this.CartaFinal,
        procesoId: this.VisCodProceso,
        cabeceraId: this.VisCodCupon,
      };
    } else if (this.selectionTypeCupon == '3' && tipo == 2) {
      this.cuponOmni2 = {
        nombreCampanha: this.cuponOmni.nombreCampanha.toUpperCase(),
        nombreCupon: this.cuponOmni.codigo.toUpperCase(),
        activoCompraMin: 1,
        codMarca: this.empresaService
          .getEmpresaSeleccionada()
          .idEmpresa.toString(),
        monto: this.cuponOmni.percentdsct,
        idTipoCupon: this.cuponOmni.tipoCupon,
        usuarioReg: this.getUsuario(),
        fecInicio: fecinicio,
        fecFin: fecfin,
        nroUso: this.cuponOmni.nroUso,
        montoMax: this.cuponOmni.montoMax,
        anulado: 0,
        compraMin: this.cuponOmni.compraMin,
        estado: 0,
        cantidadProductUso: 1,
        validaDelivery: 0,
        fecReg: fecRegistro,
        fecActualizacion: '',
        usuarioActualizacion: '',
        cantidadRedimido: 0,
        alianza: this.cuponOmni.alianza.toUpperCase(),
        canalDetalle: this.CartaFinal,
        procesoId: this.VisCodProceso,
        cabeceraId: this.VisCodCupon,
      };
    } else if (this.selectionTypeCupon == '4' && tipo == 1) {
      this.cuponOmni2 = {
        nombreCampanha: this.cuponOmni.nombreCampanha.toUpperCase(),
        activoCompraMin: 1,
        codMarca: this.empresaService
          .getEmpresaSeleccionada()
          .idEmpresa.toString(),
        monto: this.cuponOmni.percentdsct,
        idTipoCupon: this.cuponOmni.tipoCupon,
        usuarioReg: this.getUsuario(),
        fecInicio: fecinicio,
        fecFin: fecfin,
        nroUso: 1,
        nroCuponAGenerar: this.cuponOmni.nroCuponAGenerar,
        montoMax: this.cuponOmni.montoMax,
        anulado: 0,
        compraMin: this.cuponOmni.compraMin,
        estado: 0,
        cantidadProductUso: 1,
        validaDelivery: 0,
        fecReg: fecRegistro,
        fecActualizacion: '',
        usuarioActualizacion: '',
        cantidadRedimido: 0,
        alianza: this.cuponOmni.alianza.toUpperCase(),
        canalDetalle: this.CartaFinal,
        procesoId: this.VisCodProceso,
        cabeceraId: this.VisCodCupon,
      };
    } else if (this.selectionTypeCupon == '4' && tipo == 2) {
      this.cuponOmni2 = {
        nombreCampanha: this.cuponOmni.nombreCampanha.toUpperCase(),
        nombreCupon: this.cuponOmni.codigo.toUpperCase(),
        activoCompraMin: 1,
        codMarca: this.empresaService
          .getEmpresaSeleccionada()
          .idEmpresa.toString(),
        monto: this.cuponOmni.percentdsct,
        idTipoCupon: this.cuponOmni.tipoCupon,
        usuarioReg: this.getUsuario(),
        fecInicio: fecinicio,
        fecFin: fecfin,
        nroUso: this.cuponOmni.nroUso,
        montoMax: this.cuponOmni.montoMax,
        anulado: 0,
        compraMin: this.cuponOmni.compraMin,
        estado: 0,
        cantidadProductUso: 1,
        validaDelivery: 0,
        fecReg: fecRegistro,
        fecActualizacion: '',
        usuarioActualizacion: '',
        cantidadRedimido: 0,
        alianza: this.cuponOmni.alianza.toUpperCase(),
        canalDetalle: this.CartaFinal,
        procesoId: this.VisCodProceso,
        cabeceraId: this.VisCodCupon,
      };
    } else if (this.selectionTypeCupon == '5' && tipo == 1) {
      this.cuponOmni2 = {
        nombreCampanha: this.cuponOmni.nombreCampanha.toUpperCase(),
        activoCompraMin: 1,
        codMarca: this.empresaService
          .getEmpresaSeleccionada()
          .idEmpresa.toString(),
        monto: this.cuponOmni.percentdsct,
        idTipoCupon: this.cuponOmni.tipoCupon,
        usuarioReg: this.getUsuario(),
        fecInicio: fecinicio,
        fecFin: fecfin,
        nroUso: 1,
        nroCuponAGenerar: this.cuponOmni.nroCuponAGenerar,
        anulado: 0,
        montoMax: this.cuponOmni.montoMax,
        compraMin: this.cuponOmni.compraMin,
        estado: 0,
        cantidadProductUso: 1,
        validaDelivery: 0,
        fecReg: fecRegistro,
        fecActualizacion: '',
        usuarioActualizacion: '',
        cantidadRedimido: 0,
        alianza: this.cuponOmni.alianza.toUpperCase(),
        canalDetalle: this.CartaFinaltipos,
        procesoId: this.VisCodProceso,
        cabeceraId: this.VisCodCupon,
      };
    } else if (this.selectionTypeCupon == '5' && tipo == 2) {
      this.cuponOmni2 = {
        nombreCampanha: this.cuponOmni.nombreCampanha.toUpperCase(),
        nombreCupon: this.cuponOmni.codigo.toUpperCase(),
        activoCompraMin: 1,
        codMarca: this.empresaService
          .getEmpresaSeleccionada()
          .idEmpresa.toString(),
        monto: this.cuponOmni.percentdsct,
        idTipoCupon: this.cuponOmni.tipoCupon,
        usuarioReg: this.getUsuario(),
        fecInicio: fecinicio,
        fecFin: fecfin,
        nroUso: this.cuponOmni.nroUso,
        anulado: 0,
        montoMax: this.cuponOmni.montoMax,
        compraMin: this.cuponOmni.compraMin,
        estado: 0,
        cantidadProductUso: 1,
        validaDelivery: 0,
        fecReg: fecRegistro,
        fecActualizacion: '',
        usuarioActualizacion: '',
        cantidadRedimido: 0,
        alianza: this.cuponOmni.alianza.toUpperCase(),
        canalDetalle: this.CartaFinaltipos,
        procesoId: this.VisCodProceso,
        cabeceraId: this.VisCodCupon,
      };
    } else if (this.selectionTypeCupon == '6' && tipo == 1) {
      this.cuponOmni2 = {
        nombreCampanha: this.cuponOmni.nombreCampanha.toUpperCase(),
        activoCompraMin: 1,
        codMarca: this.empresaService
          .getEmpresaSeleccionada()
          .idEmpresa.toString(),
        monto: this.cuponOmni.percentdsct,
        idTipoCupon: this.cuponOmni.tipoCupon,
        usuarioReg: this.getUsuario(),
        fecInicio: fecinicio,
        fecFin: fecfin,
        nroUso: 1,
        nroCuponAGenerar: this.cuponOmni.nroCuponAGenerar,
        montoMax: this.cuponOmni.montoMax,
        anulado: 0,
        compraMin: this.cuponOmni.compraMin,
        estado: 0,
        cantidadProductUso: 1,
        validaDelivery: EXternoV,
        fecReg: fecRegistro,
        fecActualizacion: '',
        usuarioActualizacion: '',
        cantidadRedimido: 0,
        alianza: this.cuponOmni.alianza.toUpperCase(),
        canalDetalle: this.CartaFinaltipos,
        procesoId: this.VisCodProceso,
        cabeceraId: this.VisCodCupon,
      };
    } else if (this.selectionTypeCupon == '6' && tipo == 2) {
      this.cuponOmni2 = {
        nombreCampanha: this.cuponOmni.nombreCampanha.toUpperCase(),
        nombreCupon: this.cuponOmni.codigo.toUpperCase(),
        activoCompraMin: 1,
        codMarca: this.empresaService
          .getEmpresaSeleccionada()
          .idEmpresa.toString(),
        monto: this.cuponOmni.percentdsct,
        idTipoCupon: this.cuponOmni.tipoCupon,
        usuarioReg: this.getUsuario(),
        fecInicio: fecinicio,
        fecFin: fecfin,
        nroUso: this.cuponOmni.nroUso,
        montoMax: this.cuponOmni.montoMax,
        anulado: 0,
        compraMin: this.cuponOmni.compraMin,
        estado: 0,
        cantidadProductUso: 1,
        validaDelivery: EXternoV,
        fecReg: fecRegistro,
        fecActualizacion: '',
        usuarioActualizacion: '',
        cantidadRedimido: 0,
        alianza: this.cuponOmni.alianza.toUpperCase(),
        canalDetalle: this.CartaFinaltipos,
        procesoId: this.VisCodProceso,
        cabeceraId: this.VisCodCupon,
      };
    } else if (this.selectionTypeCupon == '7' && tipo == 1) {
      this.cuponOmni2 = {
        nombreCampanha: this.cuponOmni.nombreCampanha.toUpperCase(),
        activoCompraMin: 0,
        codMarca: this.empresaService
          .getEmpresaSeleccionada()
          .idEmpresa.toString(),
        monto: 0.00,
        idTipoCupon: +this.cuponOmni.tipoCupon,
        usuarioReg: this.getUsuario(),
        fecInicio: fecinicio,
        fecFin: fecfin,
        nroUso: 1,
        nroCuponAGenerar: this.cuponOmni.nroCuponAGenerar,
        montoMax: 0.00,
        anulado: 0,
        compraMin: 0.0,
        estado: 0,
        cantidadProductUso: 1,
        validaDelivery: EXternoV,
        fecReg: fecRegistro,
        fecActualizacion: '',
        usuarioActualizacion: '',
        cantidadRedimido: 0,
        alianza: this.cuponOmni.alianza.toUpperCase(),
        canalDetalle: this.CartaFinal,
        procesoId: this.VisCodProceso,
        cabeceraId: this.VisCodCupon,
      };
    } else if (this.selectionTypeCupon == '7' && tipo == 2) {
      this.cuponOmni2 = {
        nombreCampanha: this.cuponOmni.nombreCampanha.toUpperCase(),
        activoCompraMin: 0,
        codMarca: this.empresaService
          .getEmpresaSeleccionada()
          .idEmpresa.toString(),
        monto: 0.00,
        idTipoCupon: +this.cuponOmni.tipoCupon,
        usuarioReg: this.getUsuario(),
        fecInicio: fecinicio,
        fecFin: fecfin,
        nroUso: 1,
        nroCuponAGenerar: this.cuponOmni.nroCuponAGenerar,
        montoMax: 0.00,
        anulado: 0,
        compraMin: 0.0,
        estado: 0,
        cantidadProductUso: 1,
        validaDelivery: EXternoV,
        fecReg: fecRegistro,
        fecActualizacion: '',
        usuarioActualizacion: '',
        cantidadRedimido: 0,
        alianza: this.cuponOmni.alianza.toUpperCase(),
        canalDetalle: this.CartaFinal,
        procesoId: this.VisCodProceso,
        cabeceraId: this.VisCodCupon,
      };
    } else if (this.selectionTypeCupon == '8' && tipo == 1) {
      this.cuponOmni2 = {
        nombreCampanha: this.cuponOmni.nombreCampanha.toUpperCase(),
        activoCompraMin: 1,
        codMarca:  this.empresaService.getEmpresaSeleccionada().idEmpresa.toString(),
        monto: this.cuponOmni.monto,
        idTipoCupon:this.cuponOmni.tipoCupon,
        usuarioReg:this.getUsuario(),
        fecInicio:fecinicio,
        fecFin: fecfin,
        nroUso: 1,
        anulado:0,
        montoMax:this.cuponOmni.montoMax,
        compraMin:this.cuponOmni.compraMin,
        estado:0,
        cantidadProductUso:1,
        validaDelivery:0,
        fecReg:fecRegistro,
        fecActualizacion:'',
        usuarioActualizacion:'',
        cantidadRedimido:0,
        alianza: this.cuponOmni.alianza.toUpperCase(),
        nroCuponAGenerar: this.cuponOmni.nroCuponAGenerar,
        canalDetalle:this.CartaFinal,
        procesoId: this.VisCodProceso,
        cabeceraId:this.VisCodCupon
      }
    } else if (this.selectionTypeCupon == '8' && tipo == 2) {
      this.cuponOmni2 = {
        nombreCampanha: this.cuponOmni.nombreCampanha.toUpperCase(),
        nombreCupon:this.cuponOmni.codigo.toUpperCase(),
        activoCompraMin: 1,
        codMarca:  this.empresaService.getEmpresaSeleccionada().idEmpresa.toString(),
        monto: this.cuponOmni.monto,
        idTipoCupon:this.cuponOmni.tipoCupon,
        usuarioReg:this.getUsuario(),
        fecInicio:fecinicio,
        fecFin: fecfin,
        nroUso: this.cuponOmni.nroUso,
        anulado:0,
        montoMax:this.cuponOmni.montoMax,
        compraMin:this.cuponOmni.compraMin,
        estado:0,
        cantidadProductUso:1,
        validaDelivery:0,
        fecReg:fecRegistro,
        fecActualizacion:'',
        usuarioActualizacion:'',
        cantidadRedimido:0,
        alianza: this.cuponOmni.alianza.toUpperCase(),          
        canalDetalle:this.CartaFinal,
        procesoId: this.VisCodProceso,
        cabeceraId:this.VisCodCupon
      }
    }

    this.bloquear();

    if (this.cuponOmni.nroCuponAGenerar > 0) {
      var sumaCant = this.cuponOmni.nroCuponAGenerar * this.CartaFinal.length;

      if (sumaCant < 1000001) {
        console.log("this.selectCountTimes", this.selectCountTimes);
        console.log("this.cuponOmni2", this.cuponOmni2);
        if (parseInt(this.selectCountTimes) == 1) {
          this.ajaxQueryPost(
            `${this.urlEndPointOmnicanal}/generarcupon`,
            this.dataCupones.token,
            this.cuponOmni2
          );
          var ruta =
            `${this.urlLista}/GeneraMasCupones?Codigo=` +
            this.VisCodCupon +
            `&proceso=` +
            this.VisCodProceso +
            `&usuario=` +
            this.getUsuario() +
            `&Cantidad=` +
            this.cuponOmni.nroCuponAGenerar +
            `&CantidadTotal=` +
            sumaCant +
            `&CantidadAntigua=` +
            this.CantidadAntigua +
            `&tipo=1`;
        } else if (parseInt(this.selectCountTimes) == 2) {
          this.cuponOmni3 = {
            adicional: this.cuponOmni.nroUso,
            nombreCupon: this.cuponOmni.codigo.toUpperCase(),
            codMarca: this.empresaService
              .getEmpresaSeleccionada()
              .idEmpresa.toString(),
            usuario: this.getUsuario(),
          };

          this.ajaxQueryPost(
            `${this.urlEndPointOmnicanal}/adicionarcantidad`,
            this.dataCupones.token,
            this.cuponOmni3
          );
          var ruta =
            `${this.urlLista}/GeneraMasCupones?Codigo=` +
            this.VisCodCupon +
            `&proceso=` +
            this.VisCodProceso +
            `&usuario=` +
            this.getUsuario() +
            `&Cantidad=` +
            this.cuponOmni.nroUso +
            `&CantidadTotal=` +
            this.cuponOmni.nroUso +
            `&CantidadAntigua=` +
            this.CantidadAntigu2 +
            `&tipo=2`;
        }
        this.ajaxQueryPostsqlMasCupones(ruta);
        //console.log("ruta", ruta);
      } else {
        Swal.fire(
          'Advertencia',
          'Excediste el número máximo de registros a generar (1,000,000)',
          'warning'
        );
        this.spinner.hide();
      }
    } else {
      Swal.fire(
        'Advertencia',
        'El numero de cupones a generar debe ser mayor a 0',
        'warning'
      );
      this.spinner.hide();
    }
  }

  private validaYCreaCampanha(): void {
    this.spinner.show();
    let validation: boolean = true;
    if (this.cuponOmni.alianza == '') {
      console.log('Agregar nombre de la alianza');
      validation = false;
    }
    if (this.cuponOmni.nombreCampanha == '') {
      console.log('Agregar nombre de la campaña');
      validation = false;
    }
    if (this.cuponOmni.tipoCupon == 0) {
      console.log('Seleccionar el tipo de Cupón');
      validation = false;
    }
    if (!this.cuponOmni.fecInicio) {
      console.log('Seleccionar la fecha de Inicio');
      validation = false;
    }
    if (!this.cuponOmni.fecFin) {
      console.log('Seleccionar la fecha de Fin');
      validation = false;
    }
    if (this.cuponOmni.nroCuponAGenerar == 0) {
      console.log('Ingresar el numero de Cupon a Generar');
      validation = false;
    }

    if (this.cuponOmni.tipoCupon == 1 && this.selectCountTimes == '1') {
      if (this.cuponOmni.monto == 0) {
        console.log('Ingresar el Monto a Pagar');
        validation = false;
      }
      if (
        this.cuponOmni.compraMin == 0 &&
        this.cuponOmni.activoCompraMin == 1
      ) {
        console.log('Ingresar el monto minimo');
        validation = false;
      }
      if (this.CartaFinal.length == 0) {
        console.log('Debe ingresar productos a la carta');
        validation = false;
      }
      let minimo: number = Number(this.cuponOmni.compraMin);
      let monto: number = Number(this.cuponOmni.monto);
      if (minimo > monto && this.cuponOmni.activoCompraMin == 1) {
        console.log('Compra Minima debe ser menor a Monto');
        validation = false;
      } else {
        console.log('valores: ', minimo + '>' + monto);
      }
    } else if (this.cuponOmni.tipoCupon == 1 && this.selectCountTimes == '2') {
      if (this.cuponOmni.nroCuponAGenerar == 0) {
        console.log('Ingresar el numero de Cupon a Generar Mayor a 1');
        validation = false;
      }
      if (this.cuponOmni.nroUso <= 1) {
        console.log('Ingresar el numero de Cupon a Generar Mayor a 1');
        validation = false;
      }
      if (this.cuponOmni.codigo == '') {
        console.log('Ingresar el numero de Cupon a Generar Mayor a 1');
        validation = false;
      }
      if (this.cuponOmni.codigo.length > 30 || this.cuponOmni.codigo.length < 4) {
        console.log('El código del cupon debe tener entre 4 y 30 caracteres');
        validation = false;
        //Swal.fire('Validar Información.', 'El código del cupon debe tener entre 4 y 30 caracteres' , 'error');
        //this.spinner.hide();
      }
      if (this.cuponOmni.monto == 0) {
        console.log('Ingresar el numero de Cupon a Generar Mayor a 1');
        validation = false;
      }
      if (
        this.cuponOmni.compraMin == 0 &&
        this.cuponOmni.activoCompraMin == 1
      ) {
        console.log('Ingresar el numero de Cupon a Generar Mayor a 1');
        validation = false;
      }
      if (this.CartaFinal.length == 0) {
        console.log('Debe ingresar productos a la carta');
        validation = false;
      }
      let minimo: number = Number(this.cuponOmni.compraMin);
      let monto: number = Number(this.cuponOmni.monto);
      if (minimo > monto && this.cuponOmni.activoCompraMin == 1) {
        console.log('Compra Minima debe ser menor a Monto');
        validation = false;
      }
    } else if (this.cuponOmni.tipoCupon == 2 && this.selectCountTimes == '1') {
      if (
        !this.cuponOmni.nroCuponAGenerar &&
        this.cuponOmni.nroCuponAGenerar > 1
      ) {
        console.error('Ingresar el numero de Cupon a Generar Mayor a 1');
        validation = false;
      }
      if (
        !this.cuponOmni.compraMin &&
        this.cuponOmni.compraMin == 0 &&
        this.cuponOmni.activoCompraMin == 1
      ) {
        console.error('Ingresar el numero de Cupon a Generar Mayor a 1');
        validation = false;
      }
      if (this.CartaFinal.length == 0) {
        console.error('Debe ingresar productos a la carta');
        validation = false;
      }
      if (!this.cuponOmni.montoMax && this.cuponOmni.montoMax == 0) {
        console.error('Ingresar el numero de Cupon a Generar Mayor a 1');
        validation = false;
      }
      if (!this.cuponOmni.percentdsct && this.cuponOmni.percentdsct == 0) {
        console.error('Ingresar el numero de Cupon a Generar Mayor a 1');
        validation = false;
      }
      if (this.cuponOmni.percentdsct > 100) {
        console.error('Monto debe ser menor a 100');
        validation = false;
      }
    } else if (this.cuponOmni.tipoCupon == 2 && this.selectCountTimes == '2') {
      if (
        !this.cuponOmni.nroCuponAGenerar &&
        this.cuponOmni.nroCuponAGenerar == 0
      ) {
        console.error('Ingresar el numero de Cupon a Generar Mayor a 1');
        validation = false;
      }
      if (!this.cuponOmni.nroUso && this.cuponOmni.nroUso <= 0) {
        console.error('Ingresar el numero de Cupon a Generar Mayor a 1');
        validation = false;
      }
      if (!this.cuponOmni.codigo && this.cuponOmni.codigo == '') {
        console.error('Ingresar el numero de Cupon a Generar Mayor a 1');
        validation = false;
      }
      if (
        !this.cuponOmni.compraMin &&
        this.cuponOmni.compraMin == 0 &&
        this.cuponOmni.activoCompraMin == 1
      ) {
        console.error('Ingresar el numero de Cupon a Generar Mayor a 1');
        validation = false;
      }
      if (this.CartaFinal.length == 0) {
        console.error('Debe ingresar productos a la carta');
        validation = false;
      }
      if (!this.cuponOmni.montoMax && this.cuponOmni.montoMax == 0) {
        console.error('Ingresar el numero de Cupon a Generar Mayor a 1');
        validation = false;
      }
      if (!this.cuponOmni.percentdsct && this.cuponOmni.percentdsct == 0) {
        console.error('Ingresar el numero de Cupon a Generar Mayor a 1');
        validation = false;
      }
      if (this.cuponOmni.percentdsct > 100) {
        console.error('Monto debe ser menor a 100');
        validation = false;
      }
    } else if (this.cuponOmni.tipoCupon == 3 && this.selectCountTimes == '1') {
      if (
        !this.cuponOmni.nroCuponAGenerar &&
        this.cuponOmni.nroCuponAGenerar > 1
      ) {
        console.error('Ingresar el numero de Cupon a Generar Mayor a 1');
        validation = false;
      }
      if (
        !this.cuponOmni.compraMin &&
        this.cuponOmni.compraMin == 0 &&
        this.cuponOmni.activoCompraMin == 1
      ) {
        console.error('Ingresar el numero de Cupon a Generar Mayor a 1');
        validation = false;
      }
      if (this.CartaFinal.length == 0) {
        console.error('Debe ingresar productos a la carta');
        validation = false;
      }
      if (!this.cuponOmni.montoMax && this.cuponOmni.montoMax == 0) {
        console.error('Ingresar el numero de Cupon a Generar Mayor a 1');
        validation = false;
      }
      if (!this.cuponOmni.percentdsct && this.cuponOmni.percentdsct == 0) {
        console.error('Ingresar el numero de Cupon a Generar Mayor a 1');
        validation = false;
      }
      if (this.cuponOmni.percentdsct > 100) {
        console.error('Monto debe ser menor a 100');
        validation = false;
      }
    } else if (this.cuponOmni.tipoCupon == 3 && this.selectCountTimes == '2') {
      if (
        !this.cuponOmni.nroCuponAGenerar &&
        this.cuponOmni.nroCuponAGenerar == 0
      ) {
        console.error('Ingresar el numero de Cupon a Generar Mayor a 1');
        validation = false;
      }
      if (!this.cuponOmni.nroUso && this.cuponOmni.nroUso <= 0) {
        console.error('Ingresar el numero de Cupon a Generar Mayor a 1');
        validation = false;
      }
      if (!this.cuponOmni.codigo && this.cuponOmni.codigo == '') {
        console.error('Ingresar el numero de Cupon a Generar Mayor a 1');
        validation = false;
      }
      if (
        !this.cuponOmni.compraMin &&
        this.cuponOmni.compraMin == 0 &&
        this.cuponOmni.activoCompraMin == 1
      ) {
        console.error('Ingresar el numero de Cupon a Generar Mayor a 1');
        validation = false;
      }
      if (this.CartaFinal.length == 0) {
        console.error('Debe ingresar productos a la carta');
        validation = false;
      }
      if (!this.cuponOmni.montoMax && this.cuponOmni.montoMax == 0) {
        console.error('Ingresar el numero de Cupon a Generar Mayor a 1');
        validation = false;
      }
      if (!this.cuponOmni.percentdsct && this.cuponOmni.percentdsct == 0) {
        console.error('Ingresar el numero de Cupon a Generar Mayor a 1');
        validation = false;
      }
      if (this.cuponOmni.percentdsct > 100) {
        console.error('Monto debe ser menor a 100');
        validation = false;
      }
    } else if (this.cuponOmni.tipoCupon == 4 && this.selectCountTimes == '1') {
      if (
        !this.cuponOmni.nroCuponAGenerar &&
        this.cuponOmni.nroCuponAGenerar > 1
      ) {
        console.error('Ingresar el numero de Cupon a Generar Mayor a 1');
        validation = false;
      }
      if (
        !this.cuponOmni.compraMin &&
        this.cuponOmni.compraMin == 0 &&
        this.cuponOmni.activoCompraMin == 1
      ) {
        console.error('Ingresar el numero de Cupon a Generar Mayor a 1');
        validation = false;
      }
      if (this.CartaFinal.length == 0) {
        console.error('Debe ingresar productos a la carta');
        validation = false;
      }
      if (!this.cuponOmni.percentdsct && this.cuponOmni.percentdsct == 0) {
        console.error('Ingresar el numero de Cupon a Generar Mayor a 1');
        validation = false;
      }
    } else if (this.cuponOmni.tipoCupon == 4 && this.selectCountTimes == '2') {
      if (
        !this.cuponOmni.nroCuponAGenerar &&
        this.cuponOmni.nroCuponAGenerar == 0
      ) {
        console.error('Ingresar el numero de Cupon a Generar Mayor a 1');
        validation = false;
      }
      if (!this.cuponOmni.nroUso && this.cuponOmni.nroUso <= 0) {
        console.error('Ingresar el numero de Cupon a Generar Mayor a 1');
        validation = false;
      }
      if (!this.cuponOmni.codigo && this.cuponOmni.codigo == '') {
        console.error('Ingresar el numero de Cupon a Generar Mayor a 1');
        validation = false;
      }
      if (
        !this.cuponOmni.compraMin &&
        this.cuponOmni.compraMin == 0 &&
        this.cuponOmni.activoCompraMin == 1
      ) {
        console.error('Ingresar el numero de Cupon a Generar Mayor a 1');
        validation = false;
      }
      if (this.CartaFinal.length == 0) {
        console.error('Debe ingresar productos a la carta');
        validation = false;
      }
      if (!this.cuponOmni.percentdsct && this.cuponOmni.percentdsct == 0) {
        console.error('Ingresar el numero de Cupon a Generar Mayor a 1');
        validation = false;
      }
    } else if (this.cuponOmni.tipoCupon == 5 && this.selectCountTimes == '1') {
      if (
        !this.cuponOmni.nroCuponAGenerar &&
        this.cuponOmni.nroCuponAGenerar > 1
      ) {
        console.error('Ingresar el numero de Cupon a Generar Mayor a 1');
        validation = false;
      }
      if (
        !this.cuponOmni.compraMin &&
        this.cuponOmni.compraMin == 0 &&
        this.cuponOmni.activoCompraMin == 1
      ) {
        console.error('Ingresar el numero de Cupon a Generar Mayor a 1');
        validation = false;
      }
      if (!this.cuponOmni.percentdsct && this.cuponOmni.percentdsct == 0) {
        console.error('Ingresar el numero de Cupon a Generar Mayor a 1');
        validation = false;
      }
      let minimo: number = Number(this.cuponOmni.compraMin);
      let monto: number = Number(this.cuponOmni.percentdsct);
      if (minimo < monto && this.cuponOmni.activoCompraMin == 1) {
        console.error('Compra Minima debe ser mayor a Monto de descuento');
        validation = false;
      }
    } else if (this.cuponOmni.tipoCupon == 5 && this.selectCountTimes == '2') {
      if (
        !this.cuponOmni.nroCuponAGenerar &&
        this.cuponOmni.nroCuponAGenerar == 0
      ) {
        console.error('Ingresar el numero de Cupon a Generar Mayor a 1');
        validation = false;
      }
      if (!this.cuponOmni.nroUso && this.cuponOmni.nroUso <= 0) {
        console.error('Ingresar el numero de Cupon a Generar Mayor a 1');
        validation = false;
      }
      if (!this.cuponOmni.codigo && this.cuponOmni.codigo == '') {
        console.error('Ingresar el numero de Cupon a Generar Mayor a 1');
        validation = false;
      }
      if (
        !this.cuponOmni.compraMin &&
        this.cuponOmni.compraMin == 0 &&
        this.cuponOmni.activoCompraMin == 1
      ) {
        console.error('Ingresar el numero de Cupon a Generar Mayor a 1');
        validation = false;
      }
      if (!this.cuponOmni.percentdsct && this.cuponOmni.percentdsct == 0) {
        console.error('Ingresar el numero de Cupon a Generar Mayor a 1');
        validation = false;
      }
      let minimo: number = Number(this.cuponOmni.compraMin);
      let monto: number = Number(this.cuponOmni.percentdsct);
      if (minimo < monto && this.cuponOmni.activoCompraMin == 1) {
        console.error('Compra Minima debe ser mayor a Monto de descuento');
        validation = false;
      }
    } else if (this.cuponOmni.tipoCupon == 6 && this.selectCountTimes == '1') {
      if (
        !this.cuponOmni.nroCuponAGenerar &&
        this.cuponOmni.nroCuponAGenerar > 1
      ) {
        console.error('Ingresar el numero de Cupon a Generar Mayor a 1');
        validation = false;
      }
      if (
        !this.cuponOmni.compraMin &&
        this.cuponOmni.compraMin == 0 &&
        this.cuponOmni.activoCompraMin == 1
      ) {
        console.error('Ingresar el numero de Cupon a Generar Mayor a 1');
        validation = false;
      }
      if (!this.cuponOmni.montoMax && this.cuponOmni.montoMax == 0) {
        console.error('Ingresar el numero de Cupon a Generar Mayor a 1');
        validation = false;
      }
      if (!this.cuponOmni.percentdsct && this.cuponOmni.percentdsct == 0) {
        console.error('Ingresar el numero de Cupon a Generar Mayor a 1');
        validation = false;
      }
      if (this.cuponOmni.percentdsct > 100) {
        console.error('Monto debe ser menor a 100');
        validation = false;
      }
    } else if (this.cuponOmni.tipoCupon == 6 && this.selectCountTimes == '2') {
      if (
        !this.cuponOmni.nroCuponAGenerar &&
        this.cuponOmni.nroCuponAGenerar == 0
      ) {
        console.error('Ingresar el numero de Cupon a Generar Mayor a 1');
        validation = false;
      }
      if (!this.cuponOmni.nroUso && this.cuponOmni.nroUso <= 0) {
        console.error('Ingresar el numero de Cupon a Generar Mayor a 1');
        validation = false;
      }
      if (!this.cuponOmni.codigo && this.cuponOmni.codigo == '') {
        console.error('Ingresar el numero de Cupon a Generar Mayor a 1');
        validation = false;
      }
      if (
        !this.cuponOmni.compraMin &&
        this.cuponOmni.compraMin == 0 &&
        this.cuponOmni.activoCompraMin == 1
      ) {
        console.error('Ingresar el numero de Cupon a Generar Mayor a 1');
        validation = false;
      }
      if (!this.cuponOmni.montoMax && this.cuponOmni.montoMax == 0) {
        console.error('Ingresar el numero de Cupon a Generar Mayor a 1');
        validation = false;
      }
      if (!this.cuponOmni.percentdsct && this.cuponOmni.percentdsct == 0) {
        console.error('Ingresar el numero de Cupon a Generar Mayor a 1');
        validation = false;
      }
      if (this.cuponOmni.percentdsct > 100) {
        console.error('Monto debe ser menor a 100');
        validation = false;
      }
    } else if (this.cuponOmni.tipoCupon == 7 && this.selectCountTimes == '1') {
      if (!this.cuponOmni.nroCuponAGenerar && this.cuponOmni.nroCuponAGenerar > 1 ) { 
        console.error('Ingresar el numero de Cupon a Generar Mayor a 1'); 
        validation = false;
      }
      if (this.CartaFinal.length == 0 ) { 
        console.error('Debe ingresar productos a la carta'); 
        validation = false;}
    } else if (this.cuponOmni.tipoCupon == 7 && this.selectCountTimes == '2') {
      if (!this.cuponOmni.nroCuponAGenerar && this.cuponOmni.nroCuponAGenerar == 0) { 
        console.error('Ingresar el numero de Cupon a Generar Mayor a 1'); 
        validation = false;
      }
      if (!this.cuponOmni.nroUso && this.cuponOmni.nroUso <= 0 ) { 
        console.error('Ingresar el numero de Cupon a Generar Mayor a 1'); 
        validation = false;
      }
      if (!this.cuponOmni.codigo && this.cuponOmni.codigo == "" ) { 
        console.error('Ingresar el numero de Cupon a Generar Mayor a 1');
        validation = false;
      }
      if (this.CartaFinal.length == 0 ) { 
        console.error('Debe ingresar productos a la carta'); 
        validation = false;
      }
    } else if (this.cuponOmni.tipoCupon == 8 && this.selectCountTimes == '1') {
      if(this.cuponOmni.monto == 0 ){ 
        console.log('Ingresar el Monto a Pagar'); 
        validation = false;
      }
      if(this.cuponOmni.compraMin == 0 && this.cuponOmni.activoCompraMin == 1){ 
        console.log('Ingresar el monto minimo'); 
        validation = false;
      }
      if(this.CartaFinal.length == 0 ){ 
        console.log('Debe ingresar productos a la carta');  
        validation = false;
      }
      let minimo:number =  Number(this.cuponOmni.compraMin);
      let monto:number= Number(this.cuponOmni.monto);      
      if(minimo > monto && this.cuponOmni.activoCompraMin == 1){ 
        console.log('Compra Minima debe ser menor a Monto'); 
        validation = false;
      } else {
        console.log("valores: ", minimo + ">" + monto);
      }
    } else if (this.cuponOmni.tipoCupon == 8 && this.selectCountTimes == '2') {
      if(this.cuponOmni.nroCuponAGenerar == 0){ 
        console.log('Ingresar el numero de Cupon a Generar Mayor a 1'); 
        validation = false;
      }
      if(this.cuponOmni.nroUso <= 1 ){ 
        console.log('Ingresar el numero de Cupon a Generar Mayor a 1'); 
        validation = false;}
      if(this.cuponOmni.codigo == "" ){ 
        console.log('Ingresar el numero de Cupon a Generar Mayor a 1'); 
        validation = false;}
      if(this.cuponOmni.monto == 0 ){ 
        console.log('Ingresar el numero de Cupon a Generar Mayor a 1'); 
        validation = false;
      }
      if(this.cuponOmni.compraMin == 0 && this.cuponOmni.activoCompraMin == 1 ){ 
        console.log('Ingresar el numero de Cupon a Generar Mayor a 1'); 
        validation = false;
      }
      if(this.CartaFinal.length == 0 ){ 
        console.log('Debe ingresar productos a la carta'); 
        validation = false;
      }
      let minimo:number =  Number(this.cuponOmni.compraMin);
      let monto:number= Number(this.cuponOmni.monto);      
      if(minimo > monto && this.cuponOmni.activoCompraMin == 1){ 
        console.log('Compra Minima debe ser menor a Monto'); 
        validation = false;
      }
    }

    const ruta =
      `${this.urlLista}/ValidaCupones?Nombre=` + this.cuponOmni.nombreCampanha;
    this.ajaxQueryPostSQL1(ruta);

    if (this.Cantidad > 0) {
      console.log('Ya existe una campaña con este nombre');
      validation = false;
      
      this.dataCupones.registrarLog(
        'Omnicanal',
        'Crear Campanha',
        `${this.cuponOmni.codigo} NOMBRE REPETIDO`
      );
    }

    this.cuponOmni3 = {
      codMarca: this.empresaService
        .getEmpresaSeleccionada()
        .idEmpresa.toString(),
      nombreCupon: this.cuponOmni.codigo,
    };

    if (this.selectCountTimes == '2') {
      this.ajaxQueryPostValidarCodigo(
        `${this.urlEndPointOmnicanal}/validarcupon`,
        this.dataCupones.token,
        this.cuponOmni3
      );

      if (this.Bucket != 'ok') {
        validation = false; this.spinner.hide();
        console.log("El codigo ya ha sido registrado.", this.Bucket);
      }
    }

    console.log("validation", validation);
    if (validation) {
      var cantidad: number;
      var cantidadn: number;
      var cantidadcanal: number = 0;
      var fecinicio, fecfin;
      var web, call, salon;

      if (this.showProductsSalon == true) {
        salon = 1;
        cantidadcanal += 1;
      } else {
        salon = 0;
      }

      if (this.showProductsCall == true) {
        call = 1;
        cantidadcanal += 1;
      } else {
        call = 0;
      }

      if (this.showProductsWeb == true) {
        web = 1;
        cantidadcanal += 1;
      } else {
        web = 0;
      }

      if (this.showProductsRColas == true) {
        cantidadcanal += 1;
      }

      if (this.CartaFinal.length == 0) {
        cantidadn = 1;
      } else {
        cantidadn = this.CartaFinal.length;
      }

      cantidad = cantidadn * this.cuponOmni.nroCuponAGenerar;

      fecinicio = this.FormatoFecha(this.cuponOmni.fecInicio); //.getFullYear() + "-" + (this.cuponOmni.fecInicio.getMonth()+1).toString().padStart(2, '0') + "-" + (this.cuponOmni.fecInicio.getDate()).toString().padStart(2, '0') + " " + this.cuponOmni.fecInicio.getHours() + ":" + this.cuponOmni.fecInicio.getMinutes() + ":" + this.cuponOmni.fecInicio.getSeconds();
      fecfin = this.FormatoFecha(this.cuponOmni.fecFin); //.getFullYear() + "-" + (this.cuponOmni.fecFin.getMonth()+1).toString().padStart(2, '0') + "-" + (this.cuponOmni.fecFin.getDate()).toString().padStart(2, '0') + " " + this.cuponOmni.fecFin.getHours() + ":" + this.cuponOmni.fecFin.getMinutes() + ":" + this.cuponOmni.fecFin.getSeconds();
      var tipo = parseInt(this.selectCountTimes);
      // cdtipo, cdcuponesgenerar, cdmaximouso, cdcodigo, cdnuevoprecio, fgMinimoCompra, cdmontoMinimo, cdmontoMaximoDescuento, cdPorcentajeDescuento, cdDescuentoDelivery, cdMontoDescuento
      var cuponesagenerar,
        maximouso,
        codigo,
        nuevoprecio,
        fgminimocompra,
        montominimo,
        montomaximodescuento,
        porcentajedescuento,
        descuentodelivery,
        montodescuento;
      if (this.cuponOmni.tipoCupon == 1 && tipo == 1) {
        cuponesagenerar = '=' + this.cuponOmni.nroCuponAGenerar;
        nuevoprecio = '=' + this.cuponOmni.monto;
        fgminimocompra = '=' + this.cuponOmni.activoCompraMin;
        montominimo = '=' + this.cuponOmni.compraMin;
        maximouso = '';
        codigo = '';
        montomaximodescuento = '';
        porcentajedescuento = '';
        descuentodelivery = '';
        montodescuento = '';
      } else if (this.cuponOmni.tipoCupon == 1 && tipo == 2) {
        cuponesagenerar = '=' + this.cuponOmni.nroCuponAGenerar;
        nuevoprecio = '=' + this.cuponOmni.monto;
        fgminimocompra = '=' + this.cuponOmni.activoCompraMin;
        montominimo = '=' + this.cuponOmni.compraMin;
        maximouso = '=' + this.cuponOmni.nroUso;
        codigo = '=' + this.cuponOmni.codigo.toUpperCase();
        montomaximodescuento = '';
        porcentajedescuento = '';
        descuentodelivery = '';
        montodescuento = '';
      } else if (this.cuponOmni.tipoCupon == 2 && tipo == 1) {
        cuponesagenerar = '=' + this.cuponOmni.nroCuponAGenerar;
        nuevoprecio = '';
        fgminimocompra = '=' + this.cuponOmni.activoCompraMin;
        montominimo = '=' + this.cuponOmni.compraMin;
        maximouso = '';
        codigo = '';
        montomaximodescuento = '=' + this.cuponOmni.montoMax;
        porcentajedescuento = '=' + this.cuponOmni.percentdsct;
        descuentodelivery = '';
        montodescuento = '';
      } else if (this.cuponOmni.tipoCupon == 2 && tipo == 2) {
        cuponesagenerar = '=' + this.cuponOmni.nroCuponAGenerar;
        nuevoprecio = '';
        fgminimocompra = '=' + this.cuponOmni.activoCompraMin;
        montominimo = '=' + this.cuponOmni.compraMin;
        maximouso = '=' + this.cuponOmni.nroUso;
        codigo = '=' + this.cuponOmni.codigo.toUpperCase();
        montomaximodescuento = '=' + this.cuponOmni.montoMax;
        porcentajedescuento = '=' + this.cuponOmni.percentdsct;
        descuentodelivery = '';
        montodescuento = '';
      } else if (this.cuponOmni.tipoCupon == 3 && tipo == 1) {
        cuponesagenerar = '=' + this.cuponOmni.nroCuponAGenerar;
        nuevoprecio = '';
        fgminimocompra = '=' + this.cuponOmni.activoCompraMin;
        montominimo = '=' + this.cuponOmni.compraMin;
        maximouso = '';
        codigo = '';
        montomaximodescuento = '=' + this.cuponOmni.montoMax;
        porcentajedescuento = '=' + this.cuponOmni.percentdsct;
        descuentodelivery = '';
        montodescuento = '';
      } else if (this.cuponOmni.tipoCupon == 3 && tipo == 2) {
        cuponesagenerar = '=' + this.cuponOmni.nroCuponAGenerar;
        nuevoprecio = '';
        fgminimocompra = '=' + this.cuponOmni.activoCompraMin;
        montominimo = '=' + this.cuponOmni.compraMin;
        maximouso = '=' + this.cuponOmni.nroUso;
        codigo = '=' + this.cuponOmni.codigo.toUpperCase();
        montomaximodescuento = '=' + this.cuponOmni.montoMax;
        porcentajedescuento = '=' + this.cuponOmni.percentdsct;
        descuentodelivery = '';
        montodescuento = '';
      } else if (this.cuponOmni.tipoCupon == 4 && tipo == 1) {
        cuponesagenerar = '=' + this.cuponOmni.nroCuponAGenerar;
        nuevoprecio = '';
        fgminimocompra = '=' + this.cuponOmni.activoCompraMin;
        montominimo = '=' + this.cuponOmni.compraMin;
        maximouso = '';
        codigo = '';
        montomaximodescuento = '';
        porcentajedescuento = '';
        descuentodelivery = '=' + this.cuponOmni.percentdsct;
        montodescuento = '';
      } else if (this.cuponOmni.tipoCupon == 4 && tipo == 2) {
        cuponesagenerar = '=' + this.cuponOmni.nroCuponAGenerar;
        nuevoprecio = '';
        fgminimocompra = '=' + this.cuponOmni.activoCompraMin;
        montominimo = '=' + this.cuponOmni.compraMin;
        maximouso = '=' + this.cuponOmni.nroUso;
        codigo = '=' + this.cuponOmni.codigo.toUpperCase();
        montomaximodescuento = '';
        porcentajedescuento = '';
        descuentodelivery = '=' + this.cuponOmni.percentdsct;
        montodescuento = '';
      } else if (this.cuponOmni.tipoCupon == 5 && tipo == 1) {
        cuponesagenerar = '=' + this.cuponOmni.nroCuponAGenerar;
        nuevoprecio = '';
        fgminimocompra = '=' + this.cuponOmni.activoCompraMin;
        montominimo = '=' + this.cuponOmni.compraMin;
        maximouso = '';
        codigo = '';
        montomaximodescuento = '';
        porcentajedescuento = '';
        descuentodelivery = '';
        montodescuento = '=' + this.cuponOmni.percentdsct;
      } else if (this.cuponOmni.tipoCupon == 5 && tipo == 2) {
        cuponesagenerar = '=' + this.cuponOmni.nroCuponAGenerar;
        nuevoprecio = '';
        fgminimocompra = '=' + this.cuponOmni.activoCompraMin;
        montominimo = '=' + this.cuponOmni.compraMin;
        maximouso = '=' + this.cuponOmni.nroUso;
        codigo = '=' + this.cuponOmni.codigo.toUpperCase();
        montomaximodescuento = '';
        porcentajedescuento = '';
        descuentodelivery = '';
        montodescuento = '=' + this.cuponOmni.percentdsct;
      } else if (this.cuponOmni.tipoCupon == 6 && tipo == 1) {
        cuponesagenerar = '=' + this.cuponOmni.nroCuponAGenerar;
        nuevoprecio = '';
        fgminimocompra = '=0';
        montominimo = '=' + this.cuponOmni.compraMin;
        maximouso = '=1';
        codigo = '';
        montomaximodescuento = '=' + this.cuponOmni.montoMax;
        porcentajedescuento = '=' + this.cuponOmni.percentdsct;
        descuentodelivery = '';
        montodescuento = '';
      } else if (this.cuponOmni.tipoCupon == 6 && tipo == 2) {
        cuponesagenerar = '=' + this.cuponOmni.nroCuponAGenerar;
        nuevoprecio = '';
        fgminimocompra = '=0';
        montominimo = '=' + this.cuponOmni.compraMin;
        maximouso = '=' + this.cuponOmni.nroUso;
        codigo = '=' + this.cuponOmni.codigo.toUpperCase();
        montomaximodescuento = '=' + this.cuponOmni.montoMax;
        porcentajedescuento = '=' + this.cuponOmni.percentdsct;
        descuentodelivery = '';
        montodescuento = '';
      } else if (this.cuponOmni.tipoCupon == 7 && tipo == 1) {
        cuponesagenerar = '=' + this.cuponOmni.nroCuponAGenerar;
        nuevoprecio = '';
        fgminimocompra = '=' + this.cuponOmni.activoCompraMin;
        montominimo = '=' + this.cuponOmni.compraMin;
        maximouso = '';
        codigo = '';
        montomaximodescuento = '=' + this.cuponOmni.montoMax;
        porcentajedescuento = '';
        descuentodelivery = '';
        montodescuento = '';
      } else if (this.cuponOmni.tipoCupon == 7 && tipo == 2) {
        cuponesagenerar = '=' + this.cuponOmni.nroCuponAGenerar;
        nuevoprecio = '';
        fgminimocompra = '=' + this.cuponOmni.activoCompraMin;
        montominimo = '=' + this.cuponOmni.compraMin;
        maximouso = '=' + this.cuponOmni.nroUso;
        codigo = '=' + this.cuponOmni.codigo.toUpperCase();
        montomaximodescuento = '=' + this.cuponOmni.montoMax;
        porcentajedescuento = '';
        descuentodelivery = '';
        montodescuento = '';
      } else if (this.cuponOmni.tipoCupon == 8 && tipo == 1) {
        cuponesagenerar = '=' + this.cuponOmni.nroCuponAGenerar;
        nuevoprecio = '=' + this.cuponOmni.monto;
        fgminimocompra = '=' + this.cuponOmni.activoCompraMin;
        montominimo = '=' + this.cuponOmni.compraMin;
        maximouso = '';
        codigo = '';
        montomaximodescuento = '';
        porcentajedescuento = '';
        descuentodelivery = '';
        montodescuento = '';
      } else if (this.cuponOmni.tipoCupon == 8 && tipo == 2) {
        cuponesagenerar = '=' + this.cuponOmni.nroCuponAGenerar;
        nuevoprecio = '=' + this.cuponOmni.monto;
        fgminimocompra = '=' + this.cuponOmni.activoCompraMin;
        montominimo = '=' + this.cuponOmni.compraMin;
        maximouso = '=' + this.cuponOmni.nroUso;
        codigo = '=' + this.cuponOmni.codigo.toUpperCase();
        montomaximodescuento = '';
        porcentajedescuento = '';
        descuentodelivery = '';
        montodescuento = '';
      }

      const ruta2 =
        `${this.urlLista}/CrearCampanha2?cdNombreCampanha=` +
        this.cuponOmni.nombreCampanha.toUpperCase() +
        `&idTipoCupon=` +
        this.cuponOmni.tipoCupon +
        `&dtFecInicio=` +
        fecinicio +
        `&dtFecFin=` +
        fecfin +
        `&cdAlianza=` +
        this.cuponOmni.alianza.toUpperCase() +
        `&cdCantidad=` +
        cantidad +
        `&idMarca=` +
        this.empresaService.getEmpresaSeleccionada().idEmpresa.toString() +
        `&Bucket` +
        `&Web=` +
        web +
        `&Salon=` +
        salon +
        `&Call=` +
        call +
        `&cdtipo=` +
        tipo +
        `&cdcuponesgenerar` +
        cuponesagenerar +
        `&cdmaximouso` +
        maximouso +
        `&cdcodigo` +
        codigo +
        `&cdnuevoprecio` +
        nuevoprecio +
        `&fgMinimoCompra` +
        fgminimocompra +
        `&cdmontoMinimo` +
        montominimo +
        `&cdmontoMaximoDescuento` +
        montomaximodescuento +
        `&cdPorcentajeDescuento` +
        porcentajedescuento +
        `&cdDescuentoDelivery` +
        descuentodelivery +
        `&cdMontoDescuento` +
        montodescuento +
        `&nrodoc=` +
        this.authService.usuario.user.nrodoc +
        `&origen=` +
        this.SeleccionOrigen +
        `&aliados=` +
        this.SeleccionAliados;

      this.ajaxQueryPostsql(ruta2, this.dataCupones.token);

      var tipo = parseInt(this.selectCountTimes);
      var EXternoV: number;
      if (this.Exento == 'Exento') {
        EXternoV = 1;
      } else {
        EXternoV = 0;
      }
      this.spinner.hide();
      var fecinicio, fecfin, fecRegistro;
      var fecactual = new Date();
      fecinicio =
        this.cuponOmni.fecInicio.getFullYear() +
        '-' +
        (this.cuponOmni.fecInicio.getMonth() + 1).toString().padStart(2, '0') +
        '-' +
        this.cuponOmni.fecInicio.getDate().toString().padStart(2, '0') +
        ' ' +
        this.cuponOmni.fecInicio.getHours().toString().padStart(2, '0') +
        ':' +
        this.cuponOmni.fecInicio.getMinutes().toString().padStart(2, '0') +
        ':' +
        this.cuponOmni.fecInicio.getSeconds().toString().padStart(2, '0');
      fecfin =
        this.cuponOmni.fecFin.getFullYear() +
        '-' +
        (this.cuponOmni.fecFin.getMonth() + 1).toString().padStart(2, '0') +
        '-' +
        this.cuponOmni.fecFin.getDate().toString().padStart(2, '0') +
        ' ' +
        this.cuponOmni.fecFin.getHours().toString().padStart(2, '0') +
        ':' +
        this.cuponOmni.fecFin.getMinutes().toString().padStart(2, '0') +
        ':' +
        this.cuponOmni.fecFin.getSeconds().toString().padStart(2, '0');
      fecRegistro =
        fecactual.getFullYear() +
        '-' +
        (fecactual.getMonth() + 1).toString().padStart(2, '0') +
        '-' +
        fecactual.getDate().toString().padStart(2, '0') +
        ' ' +
        fecactual.getHours().toString().padStart(2, '0') +
        ':' +
        fecactual.getMinutes().toString().padStart(2, '0') +
        ':' +
        fecactual.getSeconds().toString().padStart(2, '0');

      if (this.callVal == 'carta-call') {
        this.CartaFinaltipos.push({
          canal: 1,
          producto: '',
          cantidad: 1,
          nombreProducto: 'SN',
        });
      }
      if (this.webVal == 'carta-web') {
        this.CartaFinaltipos.push({
          canal: 2,
          producto: '',
          cantidad: 1,
          nombreProducto: 'SN',
        });
      }
      if (this.salonVal == 'carta-salon') {
        this.CartaFinaltipos.push({
          canal: 0,
          producto: '',
          cantidad: 1,
          nombreProducto: 'SN',
        });
      }
      if (this.salonVal == 'carta-rcolas') {
        this.CartaFinaltipos.push({
          canal: 1,
          producto: '',
          cantidad: 1,
          nombreProducto: 'SN',
        });
      }

      if (this.selectionTypeCupon == '1' && tipo == 1) {
        this.cuponOmni2 = {
          nombreCampanha: this.cuponOmni.nombreCampanha.toUpperCase(),
          activoCompraMin: 1,
          codMarca: this.empresaService
            .getEmpresaSeleccionada()
            .idEmpresa.toString(),
          monto: this.cuponOmni.monto,
          idTipoCupon: this.cuponOmni.tipoCupon,
          usuarioReg: this.getUsuario(),
          fecInicio: fecinicio,
          fecFin: fecfin,
          nroUso: 1,
          anulado: 0,
          montoMax: this.cuponOmni.montoMax,
          compraMin: this.cuponOmni.compraMin,
          estado: 0,
          cantidadProductUso: 1,
          validaDelivery: 0,
          fecReg: fecRegistro,
          fecActualizacion: '',
          usuarioActualizacion: '',
          cantidadRedimido: 0,
          alianza: this.cuponOmni.alianza.toUpperCase(),
          nroCuponAGenerar: this.cuponOmni.nroCuponAGenerar,
          canalDetalle: this.CartaFinal,
          procesoId: 1,
          cabeceraId: this.CodigoCabecera,
        };
      } else if (this.selectionTypeCupon == '1' && tipo == 2) {
        this.cuponOmni2 = {
          nombreCampanha: this.cuponOmni.nombreCampanha.toUpperCase(),
          nombreCupon: this.cuponOmni.codigo.toUpperCase(),
          activoCompraMin: 1,
          codMarca: this.empresaService
            .getEmpresaSeleccionada()
            .idEmpresa.toString(),
          monto: this.cuponOmni.monto,
          idTipoCupon: this.cuponOmni.tipoCupon,
          usuarioReg: this.getUsuario(),
          fecInicio: fecinicio,
          fecFin: fecfin,
          nroUso: this.cuponOmni.nroUso,
          anulado: 0,
          montoMax: this.cuponOmni.montoMax,
          compraMin: this.cuponOmni.compraMin,
          estado: 0,
          cantidadProductUso: 1,
          validaDelivery: 0,
          fecReg: fecRegistro,
          fecActualizacion: '',
          usuarioActualizacion: '',
          cantidadRedimido: 0,
          alianza: this.cuponOmni.alianza.toUpperCase(),
          canalDetalle: this.CartaFinal,
          procesoId: 1,
          cabeceraId: this.CodigoCabecera,
        };
      } else if (this.selectionTypeCupon == '2' && tipo == 1) {
        console.log(this.productosCartaConsolidado);
        this.cuponOmni2 = {
          nombreCampanha: this.cuponOmni.nombreCampanha.toUpperCase(),
          activoCompraMin: 1,
          codMarca: this.empresaService
            .getEmpresaSeleccionada()
            .idEmpresa.toString(),
          monto: this.cuponOmni.percentdsct,
          idTipoCupon: this.cuponOmni.tipoCupon,
          usuarioReg: this.getUsuario(),
          fecInicio: fecinicio,
          fecFin: fecfin,
          nroUso: 1,
          nroCuponAGenerar: this.cuponOmni.nroCuponAGenerar,
          montoMax: this.cuponOmni.montoMax,
          anulado: 0,
          compraMin: this.cuponOmni.compraMin,
          estado: 0,
          cantidadProductUso: 1,
          validaDelivery: EXternoV,
          fecReg: fecRegistro,
          fecActualizacion: '',
          usuarioActualizacion: '',
          cantidadRedimido: 0,
          alianza: this.cuponOmni.alianza.toUpperCase(),
          canalDetalle: this.CartaFinal,
          procesoId: 1,
          cabeceraId: this.CodigoCabecera,
        };
      } else if (this.selectionTypeCupon == '2' && tipo == 2) {
        this.cuponOmni2 = {
          nombreCampanha: this.cuponOmni.nombreCampanha.toUpperCase(),
          nombreCupon: this.cuponOmni.codigo.toUpperCase(),
          activoCompraMin: 1,
          codMarca: this.empresaService
            .getEmpresaSeleccionada()
            .idEmpresa.toString(),
          monto: this.cuponOmni.percentdsct,
          idTipoCupon: this.cuponOmni.tipoCupon,
          usuarioReg: this.getUsuario(),
          fecInicio: fecinicio,
          fecFin: fecfin,
          nroUso: this.cuponOmni.nroUso,
          montoMax: this.cuponOmni.montoMax,
          anulado: 0,
          compraMin: this.cuponOmni.compraMin,
          estado: 0,
          cantidadProductUso: 1,
          validaDelivery: EXternoV,
          fecReg: fecRegistro,
          fecActualizacion: '',
          usuarioActualizacion: '',
          cantidadRedimido: 0,
          alianza: this.cuponOmni.alianza.toUpperCase(),
          canalDetalle: this.CartaFinal,
          procesoId: 1,
          cabeceraId: this.CodigoCabecera,
        };
      } else if (this.selectionTypeCupon == '3' && tipo == 1) {
        this.cuponOmni2 = {
          nombreCampanha: this.cuponOmni.nombreCampanha.toUpperCase(),
          activoCompraMin: 1,
          codMarca: this.empresaService
            .getEmpresaSeleccionada()
            .idEmpresa.toString(),
          monto: this.cuponOmni.percentdsct,
          idTipoCupon: this.cuponOmni.tipoCupon,
          usuarioReg: this.getUsuario(),
          fecInicio: fecinicio,
          fecFin: fecfin,
          nroUso: 1,
          nroCuponAGenerar: this.cuponOmni.nroCuponAGenerar,
          montoMax: this.cuponOmni.montoMax,
          anulado: 0,
          compraMin: this.cuponOmni.compraMin,
          estado: 0,
          cantidadProductUso: 1,
          validaDelivery: 0,
          fecReg: fecRegistro,
          fecActualizacion: '',
          usuarioActualizacion: '',
          cantidadRedimido: 0,
          alianza: this.cuponOmni.alianza.toUpperCase(),
          canalDetalle: this.CartaFinal,
          procesoId: 1,
          cabeceraId: this.CodigoCabecera,
        };
      } else if (this.selectionTypeCupon == '3' && tipo == 2) {
        this.cuponOmni2 = {
          nombreCampanha: this.cuponOmni.nombreCampanha.toUpperCase(),
          nombreCupon: this.cuponOmni.codigo.toUpperCase(),
          activoCompraMin: 1,
          codMarca: this.empresaService
            .getEmpresaSeleccionada()
            .idEmpresa.toString(),
          monto: this.cuponOmni.percentdsct,
          idTipoCupon: this.cuponOmni.tipoCupon,
          usuarioReg: this.getUsuario(),
          fecInicio: fecinicio,
          fecFin: fecfin,
          nroUso: this.cuponOmni.nroUso,
          montoMax: this.cuponOmni.montoMax,
          anulado: 0,
          compraMin: this.cuponOmni.compraMin,
          estado: 0,
          cantidadProductUso: 1,
          validaDelivery: 0,
          fecReg: fecRegistro,
          fecActualizacion: '',
          usuarioActualizacion: '',
          cantidadRedimido: 0,
          alianza: this.cuponOmni.alianza.toUpperCase(),
          canalDetalle: this.CartaFinal,
          procesoId: 1,
          cabeceraId: this.CodigoCabecera,
        };
      } else if (this.selectionTypeCupon == '4' && tipo == 1) {
        this.cuponOmni2 = {
          nombreCampanha: this.cuponOmni.nombreCampanha.toUpperCase(),
          activoCompraMin: 1,
          codMarca: this.empresaService
            .getEmpresaSeleccionada()
            .idEmpresa.toString(),
          monto: this.cuponOmni.percentdsct,
          idTipoCupon: this.cuponOmni.tipoCupon,
          usuarioReg: this.getUsuario(),
          fecInicio: fecinicio,
          fecFin: fecfin,
          nroUso: 1,
          nroCuponAGenerar: this.cuponOmni.nroCuponAGenerar,
          montoMax: this.cuponOmni.montoMax,
          anulado: 0,
          compraMin: this.cuponOmni.compraMin,
          estado: 0,
          cantidadProductUso: 1,
          validaDelivery: 0,
          fecReg: fecRegistro,
          fecActualizacion: '',
          usuarioActualizacion: '',
          cantidadRedimido: 0,
          alianza: this.cuponOmni.alianza.toUpperCase(),
          canalDetalle: this.CartaFinal,
          procesoId: 1,
          cabeceraId: this.CodigoCabecera,
        };
      } else if (this.selectionTypeCupon == '4' && tipo == 2) {
        this.cuponOmni2 = {
          nombreCampanha: this.cuponOmni.nombreCampanha.toUpperCase(),
          nombreCupon: this.cuponOmni.codigo.toUpperCase(),
          activoCompraMin: 1,
          codMarca: this.empresaService
            .getEmpresaSeleccionada()
            .idEmpresa.toString(),
          monto: this.cuponOmni.percentdsct,
          idTipoCupon: this.cuponOmni.tipoCupon,
          usuarioReg: this.getUsuario(),
          fecInicio: fecinicio,
          fecFin: fecfin,
          nroUso: this.cuponOmni.nroUso,
          montoMax: this.cuponOmni.montoMax,
          anulado: 0,
          compraMin: this.cuponOmni.compraMin,
          estado: 0,
          cantidadProductUso: 1,
          validaDelivery: 0,
          fecReg: fecRegistro,
          fecActualizacion: '',
          usuarioActualizacion: '',
          cantidadRedimido: 0,
          alianza: this.cuponOmni.alianza.toUpperCase(),
          canalDetalle: this.CartaFinal,
          procesoId: 1,
          cabeceraId: this.CodigoCabecera,
        };
      } else if (this.selectionTypeCupon == '5' && tipo == 1) {
        this.cuponOmni2 = {
          nombreCampanha: this.cuponOmni.nombreCampanha.toUpperCase(),
          activoCompraMin: 1,
          codMarca: this.empresaService
            .getEmpresaSeleccionada()
            .idEmpresa.toString(),
          monto: this.cuponOmni.percentdsct,
          idTipoCupon: this.cuponOmni.tipoCupon,
          usuarioReg: this.getUsuario(),
          fecInicio: fecinicio,
          fecFin: fecfin,
          nroUso: 1,
          nroCuponAGenerar: this.cuponOmni.nroCuponAGenerar,
          anulado: 0,
          montoMax: this.cuponOmni.montoMax,
          compraMin: this.cuponOmni.compraMin,
          estado: 0,
          cantidadProductUso: 1,
          validaDelivery: 0,
          fecReg: fecRegistro,
          fecActualizacion: '',
          usuarioActualizacion: '',
          cantidadRedimido: 0,
          alianza: this.cuponOmni.alianza.toUpperCase(),
          canalDetalle: this.CartaFinaltipos,
          procesoId: 1,
          cabeceraId: this.CodigoCabecera,
        };
      } else if (this.selectionTypeCupon == '5' && tipo == 2) {
        this.cuponOmni2 = {
          nombreCampanha: this.cuponOmni.nombreCampanha.toUpperCase(),
          nombreCupon: this.cuponOmni.codigo.toUpperCase(),
          activoCompraMin: 1,
          codMarca: this.empresaService
            .getEmpresaSeleccionada()
            .idEmpresa.toString(),
          monto: this.cuponOmni.percentdsct,
          idTipoCupon: this.cuponOmni.tipoCupon,
          usuarioReg: this.getUsuario(),
          fecInicio: fecinicio,
          fecFin: fecfin,
          nroUso: this.cuponOmni.nroUso,
          anulado: 0,
          montoMax: this.cuponOmni.montoMax,
          compraMin: this.cuponOmni.compraMin,
          estado: 0,
          cantidadProductUso: 1,
          validaDelivery: 0,
          fecReg: fecRegistro,
          fecActualizacion: '',
          usuarioActualizacion: '',
          cantidadRedimido: 0,
          alianza: this.cuponOmni.alianza.toUpperCase(),
          canalDetalle: this.CartaFinaltipos,
          procesoId: 1,
          cabeceraId: this.CodigoCabecera,
        };
      } else if (this.selectionTypeCupon == '6' && tipo == 1) {
        this.cuponOmni2 = {
          nombreCampanha: this.cuponOmni.nombreCampanha.toUpperCase(),
          activoCompraMin: 1,
          codMarca: this.empresaService
            .getEmpresaSeleccionada()
            .idEmpresa.toString(),
          monto: this.cuponOmni.percentdsct,
          idTipoCupon: this.cuponOmni.tipoCupon,
          usuarioReg: this.getUsuario(),
          fecInicio: fecinicio,
          fecFin: fecfin,
          nroUso: 1,
          nroCuponAGenerar: this.cuponOmni.nroCuponAGenerar,
          montoMax: this.cuponOmni.montoMax,
          anulado: 0,
          compraMin: this.cuponOmni.compraMin,
          estado: 0,
          cantidadProductUso: 1,
          validaDelivery: EXternoV,
          fecReg: fecRegistro,
          fecActualizacion: '',
          usuarioActualizacion: '',
          cantidadRedimido: 0,
          alianza: this.cuponOmni.alianza.toUpperCase(),
          canalDetalle: this.CartaFinaltipos,
          procesoId: 1,
          cabeceraId: this.CodigoCabecera,
        };
      } else if (this.selectionTypeCupon == '6' && tipo == 2) {
        this.cuponOmni2 = {
          nombreCampanha: this.cuponOmni.nombreCampanha.toUpperCase(),
          nombreCupon: this.cuponOmni.codigo.toUpperCase(),
          activoCompraMin: 1,
          codMarca: this.empresaService
            .getEmpresaSeleccionada()
            .idEmpresa.toString(),
          monto: this.cuponOmni.percentdsct,
          idTipoCupon: this.cuponOmni.tipoCupon,
          usuarioReg: this.getUsuario(),
          fecInicio: fecinicio,
          fecFin: fecfin,
          nroUso: this.cuponOmni.nroUso,
          montoMax: this.cuponOmni.montoMax,
          anulado: 0,
          compraMin: this.cuponOmni.compraMin,
          estado: 0,
          cantidadProductUso: 1,
          validaDelivery: EXternoV,
          fecReg: fecRegistro,
          fecActualizacion: '',
          usuarioActualizacion: '',
          cantidadRedimido: 0,
          alianza: this.cuponOmni.alianza.toUpperCase(),
          canalDetalle: this.CartaFinaltipos,
          procesoId: 1,
          cabeceraId: this.CodigoCabecera,
        };
      } else if (this.selectionTypeCupon == '7' && tipo == 1) {
        this.cuponOmni2 = {
          nombreCampanha: this.cuponOmni.nombreCampanha.toUpperCase(),
          activoCompraMin: 0,
          codMarca: this.empresaService
            .getEmpresaSeleccionada()
            .idEmpresa.toString(),
          monto: 0.00,
          idTipoCupon: this.cuponOmni.tipoCupon,
          usuarioReg: this.getUsuario(),
          fecInicio: fecinicio,
          fecFin: fecfin,
          nroUso: 1,
          nroCuponAGenerar: this.cuponOmni.nroCuponAGenerar,
          montoMax: 0.00,
          anulado: 0,
          compraMin: 0.0,
          estado: 0,
          cantidadProductUso: 1,
          validaDelivery: 0,
          fecReg: fecRegistro,
          fecActualizacion: '',
          usuarioActualizacion: '',
          cantidadRedimido: 0,
          alianza: this.cuponOmni.alianza.toUpperCase(),
          canalDetalle: this.CartaFinal,
          procesoId: 1,
          cabeceraId: this.CodigoCabecera,
        };
      } else if (this.selectionTypeCupon == '7' && tipo == 2) {
        this.cuponOmni2 = {
          nombreCampanha: this.cuponOmni.nombreCampanha.toUpperCase(),
          nombreCupon: this.cuponOmni.codigo.toUpperCase(),
          activoCompraMin: 0,
          codMarca: this.empresaService
            .getEmpresaSeleccionada()
            .idEmpresa.toString(),
          monto: 0.00,
          idTipoCupon: this.cuponOmni.tipoCupon,
          usuarioReg: this.getUsuario(),
          fecInicio: fecinicio,
          fecFin: fecfin,
          nroUso: 1,
          montoMax: 0.00,
          anulado: 0,
          compraMin: 0.0,
          estado: 0,
          cantidadProductUso: 1,
          validaDelivery: 0,
          fecReg: fecRegistro,
          fecActualizacion: '',
          usuarioActualizacion: '',
          cantidadRedimido: 0,
          alianza: this.cuponOmni.alianza.toUpperCase(),
          canalDetalle: this.CartaFinal,
          procesoId: 1,
          cabeceraId: this.CodigoCabecera,
        };
      } else if (this.selectionTypeCupon == '8' && tipo == 1) {
        this.cuponOmni2 = {
          nombreCampanha: this.cuponOmni.nombreCampanha.toUpperCase(),
          activoCompraMin: 1,
          codMarca:  this.empresaService.getEmpresaSeleccionada().idEmpresa.toString(),
          monto: this.cuponOmni.monto,
          idTipoCupon:this.cuponOmni.tipoCupon,
          usuarioReg:this.getUsuario(),
          fecInicio:fecinicio,
          fecFin: fecfin,
          nroUso: 1,
          anulado:0,
          montoMax:this.cuponOmni.montoMax,
          compraMin:this.cuponOmni.compraMin,
          estado:0,
          cantidadProductUso:1,
          validaDelivery:0,
          fecReg:fecRegistro,
          fecActualizacion:'',
          usuarioActualizacion:'',
          cantidadRedimido:0,
          alianza: this.cuponOmni.alianza.toUpperCase(),
          nroCuponAGenerar: this.cuponOmni.nroCuponAGenerar,
          canalDetalle:this.CartaFinal,
          procesoId:1,
          cabeceraId:this.CodigoCabecera
        }
      } else if (this.selectionTypeCupon == '8' && tipo == 2) {
        
        this.cuponOmni2 = {
          nombreCampanha: this.cuponOmni.nombreCampanha.toUpperCase(),
          nombreCupon:this.cuponOmni.codigo.toUpperCase(),
          activoCompraMin: 1,
          codMarca:  this.empresaService.getEmpresaSeleccionada().idEmpresa.toString(),
          monto: this.cuponOmni.monto,
          idTipoCupon:this.cuponOmni.tipoCupon,
          usuarioReg:this.getUsuario(),
          fecInicio:fecinicio,
          fecFin: fecfin,
          nroUso: this.cuponOmni.nroUso,
          anulado:0,
          montoMax:this.cuponOmni.montoMax,
          compraMin:this.cuponOmni.compraMin,
          estado:0,
          cantidadProductUso:1,
          validaDelivery:0,
          fecReg:fecRegistro,
          fecActualizacion:'',
          usuarioActualizacion:'',
          cantidadRedimido:0,
          alianza: this.cuponOmni.alianza.toUpperCase(),          
          canalDetalle:this.CartaFinal,
          procesoId:1,
          cabeceraId:this.CodigoCabecera
        }
      }
      this.cuponOmni3 = {
        codMarca: this.empresaService
          .getEmpresaSeleccionada()
          .idEmpresa.toString(),
        nombreCampanha: this.cuponOmni.nombreCampanha,
      };

      this.cuponOmni4 = this.cuponOmni2;
      
      this.ajaxQueryPost(
        `${this.urlEndPointOmnicanal}/generarcupon`,
        this.dataCupones.token,
        this.cuponOmni2
      );

      console.log('Cantidad detalle vista: ' + this.CartaDetalleVista.length);

      if (this.CartaDetalleVista.length > 0) {
        for (let index of this.CartaDetalleVista) {
          console.log(index);
          let carta = index.canal;
          let codigo = index.producto;
          let producto = index.nombre;

          console.log(carta, codigo, producto);

          var rutaDetalleVista =
            `${this.urlLista}/CrearDetalleVista?cdNombreCampanha=` +
            this.cuponOmni.nombreCampanha.toUpperCase() +
            `&idMarca=` +
            this.empresaService.getEmpresaSeleccionada().idEmpresa +
            `&Carta=` +
            carta +
            `&nombre=` +
            producto +
            `&Codigo=` +
            codigo;
          this.ajaxQueryPostSQLDetalleVista(rutaDetalleVista);
        }
      } else {
        let tipocupon: String = 'Cupón descuento % al monto total';
        var tipoN;
        const tipo = parseInt(this.selectCountTimes);
        const tipocuponn = this.selectionTypeCupon;

        if (tipo == 1) {
          tipoN = 'Autogenerado';
        } else {
          tipoN = 'Unico';
        }

        if (tipocuponn == '1') {
          tipocupon = 'Cupón Precio Fijo a un producto';
        } else if (tipocuponn == '2') {
          tipocupon = 'Cupón descuento % a un producto';
        } else if (tipocuponn == '3') {
          tipocupon = 'Cupón descuento % a varios producto';
        } else if (tipocuponn == '4') {
          tipocupon = 'Cupón descuento Recargo de Delivery';
        } else if (tipocuponn == '5') {
          tipocupon = 'Cupón descuento monto fijo al  total';
        } else if (tipocuponn == '6') {
          tipocupon = 'Cupón descuento % al monto total';
        } else if (tipocuponn == '7') {
          tipocupon = 'Cupón 2 X 1';
        } else if(tipocuponn == '8'){
          tipocupon = "Cupón Precio Fijo a varios producto";
        }

        var canales = '';
        var minimo = '';
        if (this.showProductsWeb || this.showProductsRColas) {
          canales += ' Web ';
        }

        if (this.showProductsCall) {
          canales += ' Call Center ';
        }

        if (this.showProductsSalon) {
          canales += ' Salon ';
        }

        if (
          this.cuponOmni.compraMin == 0 ||
          this.cuponOmni.compraMin == undefined
        ) {
          minimo = 'No Aplica';
        } else {
          console.log(this.cuponOmni.compraMin);
          console.log(this.cuponOmni.compraMin.toString());
          minimo = this.cuponOmni.compraMin.toString();
        }

        if (this.selectionTypeCupon == '5' && tipo == 1) {
          var sthtml =
            '<label style="color:cornflowerblue;">Nombre de Campaña: </label>' +
            this.cuponOmni.nombreCampanha +
            '</br>' +
            '<label style="color:cornflowerblue;">Tipo Cupon: </label>' +
            tipocupon +
            '</br>' +
            '<label style="color:cornflowerblue;">Fecha Inicio: </label>' +
            fecinicio +
            '</br>' +
            '<label style="color:cornflowerblue;">Fecha Fin: </label>' +
            fecfin +
            '</br>' +
            '<label style="color:cornflowerblue;">Tipo: </label>' +
            tipoN +
            '</br>' +
            '<label style="color:cornflowerblue;">Cantidad de Cupones a generar: </label>' +
            this.cuponOmni.nroCuponAGenerar +
            '</br>' +
            '<label style="color:cornflowerblue;">Nuevo precio del producto: </label>' +
            this.cuponOmni.monto +
            '</br>' +
            '<label style="color:cornflowerblue;">Mínimo de compra: </label>' +
            minimo +
            '</br>' +
            '<label style="color:cornflowerblue;">Canales: </label>' +
            canales +
            '</br>' +
            '<label style="color:cornflowerblue;">Productos: </label></br>';

          Swal.fire({
            title:
              '<strong style="color:lightgreen;">Registro Exitoso</strong>',
            icon: 'success',
            html: sthtml,
            showCloseButton: true,
            focusConfirm: false,
            confirmButtonText: 'Aceptar',
            confirmButtonAriaLabel: 'Aceptar',
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigateByUrl('/home/cupon/lista-cupon-omnicanal');
            }
          });
        } else if (this.selectionTypeCupon == '5' && tipo == 2) {
          var sthtml =
            '<label style="color:cornflowerblue;">Nombre de Campaña: </label>' +
            this.cuponOmni.nombreCampanha +
            '</br>' +
            '<label style="color:cornflowerblue;">Tipo Cupon: </label>' +
            tipocupon +
            '</br>' +
            '<label style="color:cornflowerblue;">Fecha Inicio: </label>' +
            fecinicio +
            '</br>' +
            '<label style="color:cornflowerblue;">Fecha Fin: </label>' +
            fecfin +
            '</br>' +
            '<label style="color:cornflowerblue;">Tipo: </label>' +
            tipoN +
            '</br>' +
            '<label style="color:cornflowerblue;">Cantidad de Cupones a generar: </label>' +
            this.cuponOmni.nroCuponAGenerar +
            '</br>' +
            '<label style="color:cornflowerblue;">Cantidad máxima de uso: </label>' +
            this.cuponOmni.nroUso +
            '</br>' +
            '<label style="color:cornflowerblue;">Código de cupón: </label>' +
            this.cuponOmni.codigo +
            '</br>' +
            '<label style="color:cornflowerblue;">Monto a pagar: </label>' +
            this.cuponOmni.monto +
            '</br>' +
            '<label style="color:cornflowerblue;">Mínimo de compra: </label>' +
            minimo +
            '</br>' +
            '<label style="color:cornflowerblue;">Canales: </label>' +
            canales +
            '</br>' +
            '<label style="color:cornflowerblue;">Productos: </label></br>';

          Swal.fire({
            title:
              '<strong style="color:lightgreen;">Registro Exitoso</strong>',
            icon: 'success',
            html: sthtml,
            showCloseButton: true,
            focusConfirm: false,
            confirmButtonText: 'Aceptar',
            confirmButtonAriaLabel: 'Aceptar',
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigateByUrl('/home/cupon/lista-cupon-omnicanal');
            }
          });
        } else if (this.selectionTypeCupon == '6' && tipo == 1) {
          var sthtml =
            '<label style="color:cornflowerblue;">Nombre de Campaña: </label>' +
            this.cuponOmni.nombreCampanha +
            '</br>' +
            '<label style="color:cornflowerblue;">Tipo Cupon: </label>' +
            tipocupon +
            '</br>' +
            '<label style="color:cornflowerblue;">Fecha Inicio: </label>' +
            fecinicio +
            '</br>' +
            '<label style="color:cornflowerblue;">Fecha Fin: </label>' +
            fecfin +
            '</br>' +
            '<label style="color:cornflowerblue;">Tipo: </label>' +
            tipoN +
            '</br>' +
            '<label style="color:cornflowerblue;">Cantidad de Cupones a generar: </label>' +
            this.cuponOmni.nroCuponAGenerar +
            '</br>' +
            '<label style="color:cornflowerblue;">Nuevo precio del producto: </label>' +
            this.cuponOmni.monto +
            '</br>' +
            '<label style="color:cornflowerblue;">Mínimo de compra: </label>' +
            minimo +
            '</br>' +
            '<label style="color:cornflowerblue;">Canales: </label>' +
            canales +
            '</br>' +
            '<label style="color:cornflowerblue;">Productos: </label></br>';

          Swal.fire({
            title:
              '<strong style="color:lightgreen;">Registro Exitoso</strong>',
            icon: 'success',
            html: sthtml,
            showCloseButton: true,
            focusConfirm: false,
            confirmButtonText: 'Aceptar',
            confirmButtonAriaLabel: 'Aceptar',
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigateByUrl('/home/cupon/lista-cupon-omnicanal');
            }
          });
        } else if (this.selectionTypeCupon == '6' && tipo == 2) {
          var sthtml =
            '<label style="color:cornflowerblue;">Nombre de Campaña: </label>' +
            this.cuponOmni.nombreCampanha +
            '</br>' +
            '<label style="color:cornflowerblue;">Tipo Cupon: </label>' +
            tipocupon +
            '</br>' +
            '<label style="color:cornflowerblue;">Fecha Inicio: </label>' +
            fecinicio +
            '</br>' +
            '<label style="color:cornflowerblue;">Fecha Fin: </label>' +
            fecfin +
            '</br>' +
            '<label style="color:cornflowerblue;">Tipo: </label>' +
            tipoN +
            '</br>' +
            '<label style="color:cornflowerblue;">Cantidad de Cupones a generar: </label>' +
            this.cuponOmni.nroCuponAGenerar +
            '</br>' +
            '<label style="color:cornflowerblue;">Cantidad máxima de uso: </label>' +
            this.cuponOmni.nroUso +
            '</br>' +
            '<label style="color:cornflowerblue;">Código de cupón: </label>' +
            this.cuponOmni.codigo +
            '</br>' +
            '<label style="color:cornflowerblue;">Monto a pagar: </label>' +
            this.cuponOmni.monto +
            '</br>' +
            '<label style="color:cornflowerblue;">Mínimo de compra: </label>' +
            minimo +
            '</br>' +
            '<label style="color:cornflowerblue;">Canales: </label>' +
            canales +
            '</br>' +
            '<label style="color:cornflowerblue;">Productos: </label></br>';

          Swal.fire({
            title:
              '<strong style="color:lightgreen;">Registro Exitoso</strong>',
            icon: 'success',
            html: sthtml,
            showCloseButton: true,
            focusConfirm: false,
            confirmButtonText: 'Aceptar',
            confirmButtonAriaLabel: 'Aceptar',
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigateByUrl('/home/cupon/lista-cupon-omnicanal');
            }
          });
        } else if (this.selectionTypeCupon == '7' && tipo == 1) {
          var sthtml =
            '<label style="color:cornflowerblue;">Nombre de Campaña: </label>' +
            this.cuponOmni.nombreCampanha +
            '</br>' +
            '<label style="color:cornflowerblue;">Tipo Cupon: </label>' +
            tipocupon +
            '</br>' +
            '<label style="color:cornflowerblue;">Fecha Inicio: </label>' +
            fecinicio +
            '</br>' +
            '<label style="color:cornflowerblue;">Fecha Fin: </label>' +
            fecfin +
            '</br>' +
            '<label style="color:cornflowerblue;">Tipo: </label>' +
            tipoN +
            '</br>' +
            '<label style="color:cornflowerblue;">Cantidad de Cupones a generar: </label>' +
            this.cuponOmni.nroCuponAGenerar +
            '</br>' +
            '<label style="color:cornflowerblue;">Canales: </label>' +
            canales +
            '</br>' +
            '<label style="color:cornflowerblue;">Productos: </label></br>';
            for (let index = 0; index < this.productosCartaConsolidado.length; index++) {
              sthtml += this.productosCartaConsolidado[index].producto  + ' - ' + this.productosCartaConsolidado[index].codigo + '</br>'
            }

            Swal.fire({
              title:
                '<strong style="color:lightgreen;">Registro Exitoso</strong>',
              icon: 'success',
              html: sthtml,
              showCloseButton: true,
              focusConfirm: false,
              confirmButtonText: 'Aceptar',
              confirmButtonAriaLabel: 'Aceptar',
            }).then((result) => {
              if (result.isConfirmed) {
                this.router.navigateByUrl('/home/cupon/lista-cupon-omnicanal');
              }
            });
        } else if (this.selectionTypeCupon == '7' && tipo == 2) {
          var sthtml =
            '<label style="color:cornflowerblue;">Nombre de Campaña: </label>' +
            this.cuponOmni.nombreCampanha +
            '</br>' +
            '<label style="color:cornflowerblue;">Tipo Cupon: </label>' +
            tipocupon +
            '</br>' +
            '<label style="color:cornflowerblue;">Fecha Inicio: </label>' +
            fecinicio +
            '</br>' +
            '<label style="color:cornflowerblue;">Fecha Fin: </label>' +
            fecfin +
            '</br>' +
            '<label style="color:cornflowerblue;">Tipo: </label>' +
            tipoN +
            '</br>' +
            '<label style="color:cornflowerblue;">Cantidad de Cupones a generar: </label>' +
            this.cuponOmni.nroCuponAGenerar +
            '</br>' +
            '<label style="color:cornflowerblue;">Cantidad máxima de uso: </label>' +
            this.cuponOmni.nroUso +
            '</br>' +
            '<label style="color:cornflowerblue;">Código de cupón: </label>' +
            this.cuponOmni.codigo +
            '</br>' +
            '<label style="color:cornflowerblue;">Canales: </label>' +
            canales +
            '</br>' +
            '<label style="color:cornflowerblue;">Productos: </label></br>';
            for (let index = 0; index < this.productosCartaConsolidado.length; index++) {
              sthtml += this.productosCartaConsolidado[index].producto  + ' - ' + this.productosCartaConsolidado[index].codigo + '</br>'
            }

            Swal.fire({
              title:
                '<strong style="color:lightgreen;">Registro Exitoso</strong>',
              icon: 'success',
              html: sthtml,
              showCloseButton: true,
              focusConfirm: false,
              confirmButtonText: 'Aceptar',
              confirmButtonAriaLabel: 'Aceptar',
            }).then((result) => {
              if (result.isConfirmed) {
                this.router.navigateByUrl('/home/cupon/lista-cupon-omnicanal');
              }
            });
        } else if (this.selectionTypeCupon == '8' && tipo == 1) {

          var sthtml =
            '<label style="color:cornflowerblue;">Nombre de Campaña: </label>'+ 
            this.cuponOmni.nombreCampanha + 
            '</br>' +
            '<label style="color:cornflowerblue;">Tipo Cupon: </label>'+ 
            tipocupon + 
            '</br>' +
            '<label style="color:cornflowerblue;">Fecha Inicio: </label>'+ 
            fecinicio + 
            '</br>' +
            '<label style="color:cornflowerblue;">Fecha Fin: </label>'+ 
            fecfin + 
            '</br>' +
            '<label style="color:cornflowerblue;">Tipo: </label>'+ 
            tipoN + 
            '</br>' +
            '<label style="color:cornflowerblue;">Cantidad de Cupones a generar: </label>'+ 
            this.cuponOmni.nroCuponAGenerar + 
            '</br>' +
            '<label style="color:cornflowerblue;">Nuevo precio del producto: </label>'+ 
            this.cuponOmni.monto + 
            '</br>' +
            '<label style="color:cornflowerblue;">Mínimo de compra: </label>'+ 
            minimo + 
            '</br>' +
            '<label style="color:cornflowerblue;">Canales: </label>'+
            canales +
            '</br>' +
            '<label style="color:cornflowerblue;">Productos: </label></br>';
            for (let index = 0; index < this.productosCartaConsolidado.length; index++) {
              sthtml += this.productosCartaConsolidado[index].producto  + ' - ' + this.productosCartaConsolidado[index].codigo + '</br>'
            }

            Swal.fire({
              title: '<strong style="color:lightgreen;">Registro Exitoso</strong>',
              icon: 'success',
              html:sthtml,
              showCloseButton: true,
              focusConfirm: false,
              confirmButtonText:'Aceptar',
              confirmButtonAriaLabel: 'Aceptar'          
            }).then((result) => {
              if (result.isConfirmed) {
                this.router.navigateByUrl('/home/cupon/lista-cupon-omnicanal');
              }
            })
        } else if (this.selectionTypeCupon == '8' && tipo == 2) {

          var sthtml =
            '<label style="color:cornflowerblue;">Nombre de Campaña: </label>' + 
            this.cuponOmni.nombreCampanha + 
            '</br>' +
            '<label style="color:cornflowerblue;">Tipo Cupon: </label>'+ 
            tipocupon + 
            '</br>' +
            '<label style="color:cornflowerblue;">Fecha Inicio: </label>'+ 
            fecinicio + 
            '</br>' +
            '<label style="color:cornflowerblue;">Fecha Fin: </label>'+ 
            fecfin + 
            '</br>' +
            '<label style="color:cornflowerblue;">Tipo: </label>'+ 
            tipoN + 
            '</br>' +
            '<label style="color:cornflowerblue;">Cantidad de Cupones a generar: </label>'+ 
            this.cuponOmni.nroCuponAGenerar + 
            '</br>' +
            '<label style="color:cornflowerblue;">Cantidad máxima de uso: </label>' + 
            this.cuponOmni.nroUso + 
            '</br>' +
            '<label style="color:cornflowerblue;">Código de cupón: </label>' + 
            this.cuponOmni.codigo + 
            '</br>' +
            '<label style="color:cornflowerblue;">Monto a pagar: </label>' + 
            this.cuponOmni.monto + 
            '</br>' +
            '<label style="color:cornflowerblue;">Mínimo de compra: </label>' + 
            minimo + 
            '</br>' +
            '<label style="color:cornflowerblue;">Canales: </label>' + 
            canales +
            '</br>' +
            '<label style="color:cornflowerblue;">Productos: </label></br>';
            for (let index = 0; index < this.productosCartaConsolidado.length; index++) {
              sthtml += this.productosCartaConsolidado[index].producto  + ' - ' + this.productosCartaConsolidado[index].codigo + '</br>'
            }

            Swal.fire({
              title: '<strong style="color:lightgreen;">Registro Exitoso</strong>',
              icon: 'success',
              html:sthtml,
              showCloseButton: true,
              focusConfirm: false,
              confirmButtonText:'Aceptar',
              confirmButtonAriaLabel: 'Aceptar'          
            }).then((result) => {
              if (result.isConfirmed) {
                this.router.navigateByUrl('/home/cupon/lista-cupon-omnicanal');
              }
            })
        }
      }
    } else {
      this.spinner.hide();
      if (this.Cantidad > 0) {
        Swal.fire(
          'Validar Información.',
          'El nombre de campaña ya ha sido registrado',
          'error'
        );
      } else if (this.Bucket != 'ok') {
        Swal.fire(
          'Validar Información.',
          'El codigo ya ha sido registrado',
          'error'
        );
      } else {
        Swal.fire(
          'Validar Información.',
          'Error al guardar la información, validar los datos del cupón.',
          'error'
        );
      }
    }
  }

  private formatDate(date: any): string {
    let date_temp = new Date(date);
    let date_final: string = '';

    if (date !== null) {
      if (date.length > 0) {
        let hora = date_temp.getHours();
        /* hours = hours % 12;
        hours = hours ? hours :12; */

        let minutos: any = date_temp.getMinutes();
        minutos = minutos < 10 ? '0' + minutos : minutos;

        let segundos: any = date_temp.getSeconds();
        segundos = segundos < 10 ? '0' + segundos : segundos;

        let strTime = hora + ':' + minutos + ':' + segundos;
        //(date_temp.getMonth()+1) + "/" + date_temp.getDate() + "/" + date_temp.getFullYear()

        let mes: any = date_temp.getMonth() + 1;
        mes = mes < 10 ? '0' + mes : mes;

        let dia: any = date_temp.getDate();
        dia = dia < 10 ? '0' + dia : dia;

        date_final =
          date_temp.getFullYear() + '-' + mes + '-' + dia + ' ' + strTime;
      }
    }

    return date_final;
  }

  private ajaxQueryPost(urlEndPoint: string, token: string, data: any): any {
    let t_result!: any;
    $.ajax({
      url: urlEndPoint,
      async: false,
      type: 'POST',
      crossDomain: true,
      //dataType: 'jsonp',
      /* data: JSON.stringify({
        'codmarca': '1002'
      }), */
      data: JSON.stringify(data),
      contentType: 'application/json',
      headers: {
        Authorization: 'Bearer ' + token,
      },
      success: (result) => {
        this.validacion = result;
      },
      error: (error) => {
        // TODO: ENDPOINT PARA ROLBACK DE CAMPAÑA
        if (error.status !== 200) {
          this.dataCupones
            .rollbackCampanha(this.CodigoCabecera, 'Generacion cupones fallida.')
            .subscribe({
              next: () => {
                this.dataCupones.registrarLog(
                  'CREACION CAMPANHA',
                  'ROLLBACK',
                  `${JSON.stringify({ url: urlEndPoint, body: JSON.stringify(data) })}`
                );
              },
              error: () => {
                this.dataCupones.registrarLog(
                  'CREACION CAMPANHA',
                  'ROLLBACK',
                  'Error al realizaar rollback'
                );
              },
            });
        }
        this.validacion = error.responseText;
        this.validacionC = error.status.toString();
        console.log(this.validacionC);
        this.spinner.hide();
      },
    });
  }

  private ajaxQueryPostValidarCodigo(
    urlEndPoint: string,
    token: string,
    data: any
  ): any {

    this.Bucket = "error";

    $.ajax({
      url: urlEndPoint,
      async: false,
      type: 'POST',
      crossDomain: true,
      //dataType: 'jsonp',
      /* data: JSON.stringify({
        'codmarca': '1002'
      }), */
      data: JSON.stringify(data),
      contentType: 'application/json',
      headers: {
        Authorization: 'Bearer ' + token,
      },
      success: (result) => {
        console.log("resul", result);
        //this.Bucket = result;
      },
      error: (error) => {
        //this.Bucket = "error";
        if(error){
          console.log(error.status);
          console.log(error.responseText);
          if(error.status == 200){
            this.Bucket = error.responseText;
          }else{
            this.Bucket = error.responseText;
          }
        }
      },
      complete: () => {
        this.spinner.hide();
      }
    });
  }

  private ajaxQueryPostSQL1(urlEndPoint: string): any {
    let t_result!: any;
    $.ajax({
      url: urlEndPoint,
      async: false,
      type: 'GET',
      crossDomain: true,
      contentType: 'application/json',
      success: (result) => {
        this.Cantidad = result;
      },
      error: (error) => {
        console.log(error);
        this.spinner.hide();
      },
    });
  }

  private ajaxQueryPostSQLDetalleVista(urlEndPoint: string): any {
    let t_result!: any;
    $.ajax({
      url: urlEndPoint,
      async: false,
      type: 'POST',
      crossDomain: true,
      contentType: 'application/json',
      success: (result) => {
        let tipocupon: String;
        let tipoN;
        String;
        const tipo = parseInt(this.selectCountTimes);
        const tipocuponn = this.selectionTypeCupon;

        if (tipo == 1) {
          tipoN = 'Autogenerado';
        } else {
          tipoN = 'Unico';
        }

        if(tipocuponn == '1'){
          tipocupon = "Cupón Precio Fijo a un producto";
        } else if(tipocuponn == '2'){
          tipocupon = "Cupón descuento % a un producto";
        } else if(tipocuponn == '3'){
          tipocupon = "Cupón descuento % a varios producto";
        } else if(tipocuponn == '4'){
          tipocupon = "Cupón descuento Recargo de Delivery";
        } else if(tipocuponn == '5'){
          tipocupon = "Cupón descuento monto fijo al  total";
        } else if(tipocuponn == '6'){
          tipocupon = 'Cupón descuento % al monto total';
        } else if (tipocuponn == '7') {
          tipocupon = 'Cupón 2 X 1';
        } else if(tipocuponn == '8'){
          tipocupon = "Cupón Precio Fijo a varios producto";
        }

        var fecinicio, fecfin;
        fecinicio =
          this.cuponOmni.fecInicio.getFullYear() +
          '-' +
          (this.cuponOmni.fecInicio.getMonth() + 1)
            .toString()
            .padStart(2, '0') +
          '-' +
          this.cuponOmni.fecInicio.getDate().toString().padStart(2, '0') +
          ' ' +
          this.cuponOmni.fecInicio.getHours() +
          ':' +
          this.cuponOmni.fecInicio.getMinutes() +
          ':' +
          this.cuponOmni.fecInicio.getSeconds();
        fecfin =
          this.cuponOmni.fecFin.getFullYear() +
          '-' +
          (this.cuponOmni.fecFin.getMonth() + 1).toString().padStart(2, '0') +
          '-' +
          this.cuponOmni.fecFin.getDate().toString().padStart(2, '0') +
          ' ' +
          this.cuponOmni.fecFin.getHours() +
          ':' +
          this.cuponOmni.fecFin.getMinutes() +
          ':' +
          this.cuponOmni.fecFin.getSeconds();

        this.spinner.hide();
        var canales = '';
        var minimo = '';
        if (this.showProductsWeb || this.showProductsRColas) {
          canales += ' Web ';
        }

        if (this.showProductsCall) {
          canales += ' Call Center ';
        }

        if (this.showProductsSalon) {
          canales += ' Salon ';
        }

        if (
          this.cuponOmni.compraMin == 0 ||
          this.cuponOmni.compraMin == undefined
        ) {
          minimo = 'No Aplica';
        } else {
          console.log(this.cuponOmni.compraMin);
          console.log(this.cuponOmni.compraMin.toString());
          minimo = this.cuponOmni.compraMin.toString();
        }

        if (this.selectionTypeCupon == '1' && tipo == 1) {
          var sthtml =
            '<label style="color:cornflowerblue;">Nombre de Campaña: </label>' +
            this.cuponOmni.nombreCampanha +
            '</br>' +
            '<label style="color:cornflowerblue;">Tipo Cupon: </label>' +
            tipocupon +
            '</br>' +
            '<label style="color:cornflowerblue;">Fecha Inicio: </label>' +
            fecinicio +
            '</br>' +
            '<label style="color:cornflowerblue;">Fecha Fin: </label>' +
            fecfin +
            '</br>' +
            '<label style="color:cornflowerblue;">Tipo: </label>' +
            tipoN +
            '</br>' +
            '<label style="color:cornflowerblue;">Cantidad de Cupones a generar: </label>' +
            this.cuponOmni.nroCuponAGenerar +
            '</br>' +
            '<label style="color:cornflowerblue;">Nuevo precio del producto: </label>' +
            this.cuponOmni.monto +
            '</br>' +
            '<label style="color:cornflowerblue;">Mínimo de compra: </label>' +
            minimo +
            '</br>' +
            '<label style="color:cornflowerblue;">Canales: </label>' +
            canales +
            '</br>' +
            '<label style="color:cornflowerblue;">Productos: </label></br>';
          for (
            let index = 0;
            index < this.productosCartaConsolidado.length;
            index++
          ) {
            sthtml +=
              this.productosCartaConsolidado[index].producto +
              ' - ' +
              this.productosCartaConsolidado[index].codigo +
              '</br>';
          }

          Swal.fire({
            title:
              '<strong style="color:lightgreen;">Registro Exitoso</strong>',
            icon: 'success',
            html: sthtml,
            showCloseButton: true,
            focusConfirm: false,
            confirmButtonText: 'Aceptar',
            confirmButtonAriaLabel: 'Aceptar',
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigateByUrl('/home/cupon/lista-cupon-omnicanal');
            }
          });
        } else if (this.selectionTypeCupon == '1' && tipo == 2) {
          var sthtml =
            '<label style="color:cornflowerblue;">Nombre de Campaña: </label>' +
            this.cuponOmni.nombreCampanha +
            '</br>' +
            '<label style="color:cornflowerblue;">Tipo Cupon: </label>' +
            tipocupon +
            '</br>' +
            '<label style="color:cornflowerblue;">Fecha Inicio: </label>' +
            fecinicio +
            '</br>' +
            '<label style="color:cornflowerblue;">Fecha Fin: </label>' +
            fecfin +
            '</br>' +
            '<label style="color:cornflowerblue;">Tipo: </label>' +
            tipoN +
            '</br>' +
            '<label style="color:cornflowerblue;">Cantidad de Cupones a generar: </label>' +
            this.cuponOmni.nroCuponAGenerar +
            '</br>' +
            '<label style="color:cornflowerblue;">Cantidad máxima de uso: </label>' +
            this.cuponOmni.nroUso +
            '</br>' +
            '<label style="color:cornflowerblue;">Código de cupón: </label>' +
            this.cuponOmni.codigo +
            '</br>' +
            '<label style="color:cornflowerblue;">Monto a pagar: </label>' +
            this.cuponOmni.monto +
            '</br>' +
            '<label style="color:cornflowerblue;">Mínimo de compra: </label>' +
            minimo +
            '</br>' +
            '<label style="color:cornflowerblue;">Canales: </label>' +
            canales +
            '</br>' +
            '<label style="color:cornflowerblue;">Productos: </label></br>';
          for (
            let index = 0;
            index < this.productosCartaConsolidado.length;
            index++
          ) {
            sthtml +=
              this.productosCartaConsolidado[index].producto +
              ' - ' +
              this.productosCartaConsolidado[index].codigo +
              '</br>';
          }

          Swal.fire({
            title:
              '<strong style="color:lightgreen;">Registro Exitoso</strong>',
            icon: 'success',
            html: sthtml,
            showCloseButton: true,
            focusConfirm: false,
            confirmButtonText: 'Aceptar',
            confirmButtonAriaLabel: 'Aceptar',
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigateByUrl('/home/cupon/lista-cupon-omnicanal');
            }
          });
        } else if (this.selectionTypeCupon == '2' && tipo == 1) {
          var sthtml =
            '<label style="color:cornflowerblue;">Nombre de Campaña: </label>' +
            this.cuponOmni.nombreCampanha +
            '</br>' +
            '<label style="color:cornflowerblue;">Tipo Cupon: </label>' +
            tipocupon +
            '</br>' +
            '<label style="color:cornflowerblue;">Fecha Inicio: </label>' +
            fecinicio +
            '</br>' +
            '<label style="color:cornflowerblue;">Fecha Fin: </label>' +
            fecfin +
            '</br>' +
            '<label style="color:cornflowerblue;">Tipo: </label>' +
            tipoN +
            '</br>' +
            '<label style="color:cornflowerblue;">Cantidad de Cupones a generar: </label>' +
            this.cuponOmni.nroCuponAGenerar +
            '</br>' +
            '<label style="color:cornflowerblue;">Nuevo precio del producto: </label>' +
            this.cuponOmni.monto +
            '</br>' +
            '<label style="color:cornflowerblue;">Mínimo de compra: </label>' +
            minimo +
            '</br>' +
            '<label style="color:cornflowerblue;">Canales: </label>' +
            canales +
            '</br>' +
            '<label style="color:cornflowerblue;">Productos: </label></br>';
          for (
            let index = 0;
            index < this.productosCartaConsolidado.length;
            index++
          ) {
            sthtml +=
              this.productosCartaConsolidado[index].producto +
              ' - ' +
              this.productosCartaConsolidado[index].codigo +
              '</br>';
          }

          Swal.fire({
            title:
              '<strong style="color:lightgreen;">Registro Exitoso</strong>',
            icon: 'success',
            html: sthtml,
            showCloseButton: true,
            focusConfirm: false,
            confirmButtonText: 'Aceptar',
            confirmButtonAriaLabel: 'Aceptar',
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigateByUrl('/home/cupon/lista-cupon-omnicanal');
            }
          });
        } else if (this.selectionTypeCupon == '2' && tipo == 2) {
          var sthtml =
            '<label style="color:cornflowerblue;">Nombre de Campaña: </label>' +
            this.cuponOmni.nombreCampanha +
            '</br>' +
            '<label style="color:cornflowerblue;">Tipo Cupon: </label>' +
            tipocupon +
            '</br>' +
            '<label style="color:cornflowerblue;">Fecha Inicio: </label>' +
            fecinicio +
            '</br>' +
            '<label style="color:cornflowerblue;">Fecha Fin: </label>' +
            fecfin +
            '</br>' +
            '<label style="color:cornflowerblue;">Tipo: </label>' +
            tipoN +
            '</br>' +
            '<label style="color:cornflowerblue;">Cantidad de Cupones a generar: </label>' +
            this.cuponOmni.nroCuponAGenerar +
            '</br>' +
            '<label style="color:cornflowerblue;">Cantidad máxima de uso: </label>' +
            this.cuponOmni.nroUso +
            '</br>' +
            '<label style="color:cornflowerblue;">Código de cupón: </label>' +
            this.cuponOmni.codigo +
            '</br>' +
            '<label style="color:cornflowerblue;">Monto a pagar: </label>' +
            this.cuponOmni.monto +
            '</br>' +
            '<label style="color:cornflowerblue;">Mínimo de compra: </label>' +
            minimo +
            '</br>' +
            '<label style="color:cornflowerblue;">Canales: </label>' +
            canales +
            '</br>' +
            '<label style="color:cornflowerblue;">Productos: </label></br>';
          for (
            let index = 0;
            index < this.productosCartaConsolidado.length;
            index++
          ) {
            sthtml +=
              this.productosCartaConsolidado[index].producto +
              ' - ' +
              this.productosCartaConsolidado[index].codigo +
              '</br>';
          }

          Swal.fire({
            title:
              '<strong style="color:lightgreen;">Registro Exitoso</strong>',
            icon: 'success',
            html: sthtml,
            showCloseButton: true,
            focusConfirm: false,
            confirmButtonText: 'Aceptar',
            confirmButtonAriaLabel: 'Aceptar',
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigateByUrl('/home/cupon/lista-cupon-omnicanal');
            }
          });
        } else if (this.selectionTypeCupon == '3' && tipo == 1) {
          var sthtml =
            '<label style="color:cornflowerblue;">Nombre de Campaña: </label>' +
            this.cuponOmni.nombreCampanha +
            '</br>' +
            '<label style="color:cornflowerblue;">Tipo Cupon: </label>' +
            tipocupon +
            '</br>' +
            '<label style="color:cornflowerblue;">Fecha Inicio: </label>' +
            fecinicio +
            '</br>' +
            '<label style="color:cornflowerblue;">Fecha Fin: </label>' +
            fecfin +
            '</br>' +
            '<label style="color:cornflowerblue;">Tipo: </label>' +
            tipoN +
            '</br>' +
            '<label style="color:cornflowerblue;">Cantidad de Cupones a generar: </label>' +
            this.cuponOmni.nroCuponAGenerar +
            '</br>' +
            '<label style="color:cornflowerblue;">Nuevo precio del producto: </label>' +
            this.cuponOmni.monto +
            '</br>' +
            '<label style="color:cornflowerblue;">Mínimo de compra: </label>' +
            minimo +
            '</br>' +
            '<label style="color:cornflowerblue;">Canales: </label>' +
            canales +
            '</br>' +
            '<label style="color:cornflowerblue;">Productos: </label></br>';
          for (
            let index = 0;
            index < this.productosCartaConsolidado.length;
            index++
          ) {
            sthtml +=
              this.productosCartaConsolidado[index].producto +
              ' - ' +
              this.productosCartaConsolidado[index].codigo +
              '</br>';
          }

          Swal.fire({
            title:
              '<strong style="color:lightgreen;">Registro Exitoso</strong>',
            icon: 'success',
            html: sthtml,
            showCloseButton: true,
            focusConfirm: false,
            confirmButtonText: 'Aceptar',
            confirmButtonAriaLabel: 'Aceptar',
          })
        }  
        else if (this.selectionTypeCupon == '3' && tipo == 2) {
          var sthtml =
            '<label style="color:cornflowerblue;">Nombre de Campaña: </label>' +
            this.cuponOmni.nombreCampanha +
            '</br>' +
            '<label style="color:cornflowerblue;">Tipo Cupon: </label>' +
            tipocupon +
            '</br>' +
            '<label style="color:cornflowerblue;">Fecha Inicio: </label>' +
            fecinicio +
            '</br>' +
            '<label style="color:cornflowerblue;">Fecha Fin: </label>' +
            fecfin +
            '</br>' +
            '<label style="color:cornflowerblue;">Tipo: </label>' +
            tipoN +
            '</br>' +
            '<label style="color:cornflowerblue;">Cantidad de Cupones a generar: </label>' +
            this.cuponOmni.nroCuponAGenerar +
            '</br>' +
            '<label style="color:cornflowerblue;">Cantidad máxima de uso: </label>' +
            this.cuponOmni.nroUso +
            '</br>' +
            '<label style="color:cornflowerblue;">Código de cupón: </label>' +
            this.cuponOmni.codigo +
            '</br>' +
            '<label style="color:cornflowerblue;">Monto a pagar: </label>' +
            this.cuponOmni.monto +
            '</br>' +
            '<label style="color:cornflowerblue;">Mínimo de compra: </label>' +
            minimo +
            '</br>' +
            '<label style="color:cornflowerblue;">Canales: </label>' +
            canales +
            '</br>' +
            '<label style="color:cornflowerblue;">Productos: </label></br>';
          for (
            let index = 0;
            index < this.productosCartaConsolidado.length;
            index++
          ) {
            sthtml +=
              this.productosCartaConsolidado[index].producto +
              ' - ' +
              this.productosCartaConsolidado[index].codigo +
              '</br>';
          }
          Swal.fire({
            title:
              '<strong style="color:lightgreen;">Registro Exitoso</strong>',
            icon: 'success',
            html: sthtml,
            showCloseButton: true,
            focusConfirm: false,
            confirmButtonText: 'Aceptar',
            confirmButtonAriaLabel: 'Aceptar',
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigateByUrl('/home/cupon/lista-cupon-omnicanal');
            }
          });
        } else if (this.selectionTypeCupon == '4' && tipo == 1) {
          var sthtml =
            '<label style="color:cornflowerblue;">Nombre de Campaña: </label>' +
            this.cuponOmni.nombreCampanha +
            '</br>' +
            '<label style="color:cornflowerblue;">Tipo Cupon: </label>' +
            tipocupon +
            '</br>' +
            '<label style="color:cornflowerblue;">Fecha Inicio: </label>' +
            fecinicio +
            '</br>' +
            '<label style="color:cornflowerblue;">Fecha Fin: </label>' +
            fecfin +
            '</br>' +
            '<label style="color:cornflowerblue;">Tipo: </label>' +
            tipoN +
            '</br>' +
            '<label style="color:cornflowerblue;">Cantidad de Cupones a generar: </label>' +
            this.cuponOmni.nroCuponAGenerar +
            '</br>' +
            '<label style="color:cornflowerblue;">Nuevo precio del producto: </label>' +
            this.cuponOmni.monto +
            '</br>' +
            '<label style="color:cornflowerblue;">Mínimo de compra: </label>' +
            minimo +
            '</br>' +
            '<label style="color:cornflowerblue;">Canales: </label>' +
            canales +
            '</br>' +
            '<label style="color:cornflowerblue;">Productos: </label></br>';
          for (
            let index = 0;
            index < this.productosCartaConsolidado.length;
            index++
          ) {
            sthtml +=
              this.productosCartaConsolidado[index].producto +
              ' - ' +
              this.productosCartaConsolidado[index].codigo +
              '</br>';
          }

          Swal.fire({
            title:
              '<strong style="color:lightgreen;">Registro Exitoso</strong>',
            icon: 'success',
            html: sthtml,
            showCloseButton: true,
            focusConfirm: false,
            confirmButtonText: 'Aceptar',
            confirmButtonAriaLabel: 'Aceptar',
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigateByUrl('/home/cupon/lista-cupon-omnicanal');
            }
          });
        } else if (this.selectionTypeCupon == '4' && tipo == 2) {
          var sthtml =
            '<label style="color:cornflowerblue;">Nombre de Campaña: </label>' +
            this.cuponOmni.nombreCampanha +
            '</br>' +
            '<label style="color:cornflowerblue;">Tipo Cupon: </label>' +
            tipocupon +
            '</br>' +
            '<label style="color:cornflowerblue;">Fecha Inicio: </label>' +
            fecinicio +
            '</br>' +
            '<label style="color:cornflowerblue;">Fecha Fin: </label>' +
            fecfin +
            '</br>' +
            '<label style="color:cornflowerblue;">Tipo: </label>' +
            tipoN +
            '</br>' +
            '<label style="color:cornflowerblue;">Cantidad de Cupones a generar: </label>' +
            this.cuponOmni.nroCuponAGenerar +
            '</br>' +
            '<label style="color:cornflowerblue;">Cantidad máxima de uso: </label>' +
            this.cuponOmni.nroUso +
            '</br>' +
            '<label style="color:cornflowerblue;">Código de cupón: </label>' +
            this.cuponOmni.codigo +
            '</br>' +
            '<label style="color:cornflowerblue;">Monto a pagar: </label>' +
            this.cuponOmni.monto +
            '</br>' +
            '<label style="color:cornflowerblue;">Mínimo de compra: </label>' +
            minimo +
            '</br>' +
            '<label style="color:cornflowerblue;">Canales: </label>' +
            canales +
            '</br>' +
            '<label style="color:cornflowerblue;">Productos: </label></br>';
          for (
            let index = 0;
            index < this.productosCartaConsolidado.length;
            index++
          ) {
            sthtml +=
              this.productosCartaConsolidado[index].producto +
              ' - ' +
              this.productosCartaConsolidado[index].codigo +
              '</br>';
          }

          Swal.fire({
            title:
              '<strong style="color:lightgreen;">Registro Exitoso</strong>',
            icon: 'success',
            html: sthtml,
            showCloseButton: true,
            focusConfirm: false,
            confirmButtonText: 'Aceptar',
            confirmButtonAriaLabel: 'Aceptar',
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigateByUrl('/home/cupon/lista-cupon-omnicanal');
            }
          });
        } else if (this.selectionTypeCupon == '5' && tipo == 1) {
          var sthtml =
            '<label style="color:cornflowerblue;">Nombre de Campaña: </label>' +
            this.cuponOmni.nombreCampanha +
            '</br>' +
            '<label style="color:cornflowerblue;">Tipo Cupon: </label>' +
            tipocupon +
            '</br>' +
            '<label style="color:cornflowerblue;">Fecha Inicio: </label>' +
            fecinicio +
            '</br>' +
            '<label style="color:cornflowerblue;">Fecha Fin: </label>' +
            fecfin +
            '</br>' +
            '<label style="color:cornflowerblue;">Tipo: </label>' +
            tipoN +
            '</br>' +
            '<label style="color:cornflowerblue;">Cantidad de Cupones a generar: </label>' +
            this.cuponOmni.nroCuponAGenerar +
            '</br>' +
            '<label style="color:cornflowerblue;">Nuevo precio del producto: </label>' +
            this.cuponOmni.monto +
            '</br>' +
            '<label style="color:cornflowerblue;">Mínimo de compra: </label>' +
            minimo +
            '</br>' +
            '<label style="color:cornflowerblue;">Canales: </label>' +
            canales +
            '</br>' +
            '<label style="color:cornflowerblue;">Productos: </label></br>';

          Swal.fire({
            title:
              '<strong style="color:lightgreen;">Registro Exitoso</strong>',
            icon: 'success',
            html: sthtml,
            showCloseButton: true,
            focusConfirm: false,
            confirmButtonText: 'Aceptar',
            confirmButtonAriaLabel: 'Aceptar',
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigateByUrl('/home/cupon/lista-cupon-omnicanal');
            }
          });
        } else if (this.selectionTypeCupon == '5' && tipo == 2) {
          var sthtml =
            '<label style="color:cornflowerblue;">Nombre de Campaña: </label>' +
            this.cuponOmni.nombreCampanha +
            '</br>' +
            '<label style="color:cornflowerblue;">Tipo Cupon: </label>' +
            tipocupon +
            '</br>' +
            '<label style="color:cornflowerblue;">Fecha Inicio: </label>' +
            fecinicio +
            '</br>' +
            '<label style="color:cornflowerblue;">Fecha Fin: </label>' +
            fecfin +
            '</br>' +
            '<label style="color:cornflowerblue;">Tipo: </label>' +
            tipoN +
            '</br>' +
            '<label style="color:cornflowerblue;">Cantidad de Cupones a generar: </label>' +
            this.cuponOmni.nroCuponAGenerar +
            '</br>' +
            '<label style="color:cornflowerblue;">Cantidad máxima de uso: </label>' +
            this.cuponOmni.nroUso +
            '</br>' +
            '<label style="color:cornflowerblue;">Código de cupón: </label>' +
            this.cuponOmni.codigo +
            '</br>' +
            '<label style="color:cornflowerblue;">Monto a pagar: </label>' +
            this.cuponOmni.monto +
            '</br>' +
            '<label style="color:cornflowerblue;">Mínimo de compra: </label>' +
            minimo +
            '</br>' +
            '<label style="color:cornflowerblue;">Canales: </label>' +
            canales +
            '</br>' +
            '<label style="color:cornflowerblue;">Productos: </label></br>';

          Swal.fire({
            title:
              '<strong style="color:lightgreen;">Registro Exitoso</strong>',
            icon: 'success',
            html: sthtml,
            showCloseButton: true,
            focusConfirm: false,
            confirmButtonText: 'Aceptar',
            confirmButtonAriaLabel: 'Aceptar',
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigateByUrl('/home/cupon/lista-cupon-omnicanal');
            }
          });
        } else if (this.selectionTypeCupon == '6' && tipo == 1) {
          var sthtml =
            '<label style="color:cornflowerblue;">Nombre de Campaña: </label>' +
            this.cuponOmni.nombreCampanha +
            '</br>' +
            '<label style="color:cornflowerblue;">Tipo Cupon: </label>' +
            tipocupon +
            '</br>' +
            '<label style="color:cornflowerblue;">Fecha Inicio: </label>' +
            fecinicio +
            '</br>' +
            '<label style="color:cornflowerblue;">Fecha Fin: </label>' +
            fecfin +
            '</br>' +
            '<label style="color:cornflowerblue;">Tipo: </label>' +
            tipoN +
            '</br>' +
            '<label style="color:cornflowerblue;">Cantidad de Cupones a generar: </label>' +
            this.cuponOmni.nroCuponAGenerar +
            '</br>' +
            '<label style="color:cornflowerblue;">Nuevo precio del producto: </label>' +
            this.cuponOmni.monto +
            '</br>' +
            '<label style="color:cornflowerblue;">Mínimo de compra: </label>' +
            minimo +
            '</br>' +
            '<label style="color:cornflowerblue;">Canales: </label>' +
            canales +
            '</br>' +
            '<label style="color:cornflowerblue;">Productos: </label></br>';

          Swal.fire({
            title:
              '<strong style="color:lightgreen;">Registro Exitoso</strong>',
            icon: 'success',
            html: sthtml,
            showCloseButton: true,
            focusConfirm: false,
            confirmButtonText: 'Aceptar',
            confirmButtonAriaLabel: 'Aceptar',
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigateByUrl('/home/cupon/lista-cupon-omnicanal');
            }
          });
        } else if (this.selectionTypeCupon == '6' && tipo == 2) {
          var sthtml =
            '<label style="color:cornflowerblue;">Nombre de Campaña: </label>' +
            this.cuponOmni.nombreCampanha +
            '</br>' +
            '<label style="color:cornflowerblue;">Tipo Cupon: </label>' +
            tipocupon +
            '</br>' +
            '<label style="color:cornflowerblue;">Fecha Inicio: </label>' +
            fecinicio +
            '</br>' +
            '<label style="color:cornflowerblue;">Fecha Fin: </label>' +
            fecfin +
            '</br>' +
            '<label style="color:cornflowerblue;">Tipo: </label>' +
            tipoN +
            '</br>' +
            '<label style="color:cornflowerblue;">Cantidad de Cupones a generar: </label>' +
            this.cuponOmni.nroCuponAGenerar +
            '</br>' +
            '<label style="color:cornflowerblue;">Cantidad máxima de uso: </label>' +
            this.cuponOmni.nroUso +
            '</br>' +
            '<label style="color:cornflowerblue;">Código de cupón: </label>' +
            this.cuponOmni.codigo +
            '</br>' +
            '<label style="color:cornflowerblue;">Monto a pagar: </label>' +
            this.cuponOmni.monto +
            '</br>' +
            '<label style="color:cornflowerblue;">Mínimo de compra: </label>' +
            minimo +
            '</br>' +
            '<label style="color:cornflowerblue;">Canales: </label>' +
            canales +
            '</br>' +
            '<label style="color:cornflowerblue;">Productos: </label></br>';

          Swal.fire({
            title:
              '<strong style="color:lightgreen;">Registro Exitoso</strong>',
            icon: 'success',
            html: sthtml,
            showCloseButton: true,
            focusConfirm: false,
            confirmButtonText: 'Aceptar',
            confirmButtonAriaLabel: 'Aceptar',
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigateByUrl('/home/cupon/lista-cupon-omnicanal');
            }
          });
        } else if (this.selectionTypeCupon == '7' && tipo == 1) {
          var sthtml =
            '<label style="color:cornflowerblue;">Nombre de Campaña: </label>' +
            this.cuponOmni.nombreCampanha +
            '</br>' +
            '<label style="color:cornflowerblue;">Tipo Cupon: </label>' +
            tipocupon +
            '</br>' +
            '<label style="color:cornflowerblue;">Fecha Inicio: </label>' +
            fecinicio +
            '</br>' +
            '<label style="color:cornflowerblue;">Fecha Fin: </label>' +
            fecfin +
            '</br>' +
            '<label style="color:cornflowerblue;">Tipo: </label>' +
            tipoN +
            '</br>' +
            '<label style="color:cornflowerblue;">Cantidad de Cupones a generar: </label>' +
            this.cuponOmni.nroCuponAGenerar +
            '</br>' +
            '<label style="color:cornflowerblue;">Canales: </label>' +
            canales +
            '</br>' +
            '<label style="color:cornflowerblue;">Productos: </label></br>';
            for (let index = 0; index < this.productosCartaConsolidado.length; index++) {
              sthtml += this.productosCartaConsolidado[index].producto  + ' - ' + this.productosCartaConsolidado[index].codigo + '</br>'
            }

            Swal.fire({
              title:
                '<strong style="color:lightgreen;">Registro Exitoso</strong>',
              icon: 'success',
              html: sthtml,
              showCloseButton: true,
              focusConfirm: false,
              confirmButtonText: 'Aceptar',
              confirmButtonAriaLabel: 'Aceptar',
            }).then((result) => {
              if (result.isConfirmed) {
                this.router.navigateByUrl('/home/cupon/lista-cupon-omnicanal');
              }
            });
        } else if (this.selectionTypeCupon == '7' && tipo == 2) {
          var sthtml =
            '<label style="color:cornflowerblue;">Nombre de Campaña: </label>' +
            this.cuponOmni.nombreCampanha +
            '</br>' +
            '<label style="color:cornflowerblue;">Tipo Cupon: </label>' +
            tipocupon +
            '</br>' +
            '<label style="color:cornflowerblue;">Fecha Inicio: </label>' +
            fecinicio +
            '</br>' +
            '<label style="color:cornflowerblue;">Fecha Fin: </label>' +
            fecfin +
            '</br>' +
            '<label style="color:cornflowerblue;">Tipo: </label>' +
            tipoN +
            '</br>' +
            '<label style="color:cornflowerblue;">Cantidad de Cupones a generar: </label>' +
            this.cuponOmni.nroCuponAGenerar +
            '</br>' +
            '<label style="color:cornflowerblue;">Cantidad máxima de uso: </label>' +
            this.cuponOmni.nroUso +
            '</br>' +
            '<label style="color:cornflowerblue;">Código de cupón: </label>' +
            this.cuponOmni.codigo +
            '</br>' +
            '<label style="color:cornflowerblue;">Canales: </label>' +
            canales +
            '</br>' +
            '<label style="color:cornflowerblue;">Productos: </label></br>';
            for (let index = 0; index < this.productosCartaConsolidado.length; index++) {
              sthtml += this.productosCartaConsolidado[index].producto  + ' - ' + this.productosCartaConsolidado[index].codigo + '</br>'
            }

            Swal.fire({
              title:
                '<strong style="color:lightgreen;">Registro Exitoso</strong>',
              icon: 'success',
              html: sthtml,
              showCloseButton: true,
              focusConfirm: false,
              confirmButtonText: 'Aceptar',
              confirmButtonAriaLabel: 'Aceptar',
            }).then((result) => {
              if (result.isConfirmed) {
                this.router.navigateByUrl('/home/cupon/lista-cupon-omnicanal');
              }
            });
        } else if (this.selectionTypeCupon == '8' && tipo == 1) {

          var sthtml =
            '<label style="color:cornflowerblue;">Nombre de Campaña: </label>'+ 
            this.cuponOmni.nombreCampanha + 
            '</br>' +
            '<label style="color:cornflowerblue;">Tipo Cupon: </label>'+ 
            tipocupon + 
            '</br>' +
            '<label style="color:cornflowerblue;">Fecha Inicio: </label>'+ 
            fecinicio + 
            '</br>' +
            '<label style="color:cornflowerblue;">Fecha Fin: </label>'+ 
            fecfin + 
            '</br>' +
            '<label style="color:cornflowerblue;">Tipo: </label>'+ 
            tipoN + 
            '</br>' +
            '<label style="color:cornflowerblue;">Cantidad de Cupones a generar: </label>'+ 
            this.cuponOmni.nroCuponAGenerar + 
            '</br>' +
            '<label style="color:cornflowerblue;">Nuevo precio del producto: </label>'+ 
            this.cuponOmni.monto + 
            '</br>' +
            '<label style="color:cornflowerblue;">Mínimo de compra: </label>'+ 
            minimo + 
            '</br>' +
            '<label style="color:cornflowerblue;">Canales: </label>'+
            canales +
            '</br>' +
            '<label style="color:cornflowerblue;">Productos: </label></br>';
            for (let index = 0; index < this.productosCartaConsolidado.length; index++) {
              sthtml += this.productosCartaConsolidado[index].producto  + ' - ' + this.productosCartaConsolidado[index].codigo + '</br>'
            }

            Swal.fire({
              title: '<strong style="color:lightgreen;">Registro Exitoso</strong>',
              icon: 'success',
              html:sthtml,
              showCloseButton: true,
              focusConfirm: false,
              confirmButtonText:'Aceptar',
              confirmButtonAriaLabel: 'Aceptar'          
            }).then((result) => {
              if (result.isConfirmed) {
                this.router.navigateByUrl('/home/cupon/lista-cupon-omnicanal');
              }
            })
        } else if (this.selectionTypeCupon == '8' && tipo == 2) {

          var sthtml =
            '<label style="color:cornflowerblue;">Nombre de Campaña: </label>' + 
            this.cuponOmni.nombreCampanha + 
            '</br>' +
            '<label style="color:cornflowerblue;">Tipo Cupon: </label>'+ 
            tipocupon + 
            '</br>' +
            '<label style="color:cornflowerblue;">Fecha Inicio: </label>'+ 
            fecinicio + 
            '</br>' +
            '<label style="color:cornflowerblue;">Fecha Fin: </label>'+ 
            fecfin + 
            '</br>' +
            '<label style="color:cornflowerblue;">Tipo: </label>'+ 
            tipoN + 
            '</br>' +
            '<label style="color:cornflowerblue;">Cantidad de Cupones a generar: </label>'+ 
            this.cuponOmni.nroCuponAGenerar + 
            '</br>' +
            '<label style="color:cornflowerblue;">Cantidad máxima de uso: </label>' + 
            this.cuponOmni.nroUso + 
            '</br>' +
            '<label style="color:cornflowerblue;">Código de cupón: </label>' + 
            this.cuponOmni.codigo + 
            '</br>' +
            '<label style="color:cornflowerblue;">Monto a pagar: </label>' + 
            this.cuponOmni.monto + 
            '</br>' +
            '<label style="color:cornflowerblue;">Mínimo de compra: </label>' + 
            minimo + 
            '</br>' +
            '<label style="color:cornflowerblue;">Canales: </label>' + 
            canales +
            '</br>' +
            '<label style="color:cornflowerblue;">Productos: </label></br>';
            for (let index = 0; index < this.productosCartaConsolidado.length; index++) {
              sthtml += this.productosCartaConsolidado[index].producto  + ' - ' + this.productosCartaConsolidado[index].codigo + '</br>'
            }

            Swal.fire({
              title: '<strong style="color:lightgreen;">Registro Exitoso</strong>',
              icon: 'success',
              html:sthtml,
              showCloseButton: true,
              focusConfirm: false,
              confirmButtonText:'Aceptar',
              confirmButtonAriaLabel: 'Aceptar'          
            }).then((result) => {
              if (result.isConfirmed) {
                this.router.navigateByUrl('/home/cupon/lista-cupon-omnicanal');
              }
            })
        }
      },
      error: (error) => {
        console.log(error);
        this.spinner.hide();
      },
    });
  }

  private ajaxQueryPostsqlMasCupones(ruta: string): any {
    $.ajax({
      url: ruta,
      async: false,
      type: 'POST',
      crossDomain: true,
      contentType: 'application/json',
      success: (result) => {
        Swal.fire({
          title: '<strong style="color:lightgreen;">Registro Exitoso</strong>',
          icon: 'success',
          html: '',
          showCloseButton: true,
          focusConfirm: false,
          confirmButtonText: 'Aceptar',
          confirmButtonAriaLabel: 'Aceptar',
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigateByUrl('/home/cupon/lista-cupon-omnicanal');
          }
        });
      },
      error: (error) => {
        Swal.fire(
          'Ocurrio un accidente',
          'Comunicate con sistemas: ' + error,
          'info'
        );
        console.log(error);
        this.spinner.hide();
      },
    });
  }

  private ajaxQueryPostsql(urlEndPoint: string, token: string): any {
    let t_result!: any;
    $.ajax({
      url: urlEndPoint,
      async: false,
      type: 'POST',
      crossDomain: true,
      contentType: 'application/json',
      success: (result) => {
        this.CodigoCabecera = result;
        this.dataCupones.registrarLog(
          'Omnicanal',
          'Crear Campanha',
          `SUCCESS -> ${urlEndPoint}`
        );
      },
      error: (error) => {
        Swal.fire(
          'Ocurrio un accidente',
          'Comunicate con sistemas: ' + error,
          'info'
        );
        console.log(error);
        this.dataCupones.registrarLog(
          'Omnicanal',
          'Crear Campanha',
          `ERROR -> ${urlEndPoint}`
        );
        this.spinner.hide();
      },
    });
  }

  private ajaxQueryPostListaAliados(urlEndPoint: string): any {
    let t_result!: any;
    $.ajax({
      url: urlEndPoint,
      async: false,
      type: 'GET',
      crossDomain: true,
      contentType: 'application/json',
      success: (result) => {
        for (let index = 0; index < result.length; index++) {
          var element = result[index].nombre;
          var element1 = result[index].codigo;

          this.Aliados.push({
            nombre: element,
            estado: false,
            codigo: element1,
          });
        }
      },
      error: (error) => {
        Swal.fire(
          'Ocurrio un accidente',
          'Comunicate con sistemas: ' + error,
          'info'
        );
        console.log(error);
        this.spinner.hide();
      },
    });
  }

  private ajaxQueryPostListaTipo(urlEndPoint: string): any {
    let t_result!: any;
    $.ajax({
      url: urlEndPoint,
      async: false,
      type: 'GET',
      crossDomain: true,
      contentType: 'application/json',
      success: (result) => {
        for (let index = 0; index < result.length; index++) {
          var element = result[index].nombre;
          var element1 = result[index].codigo;

          this.tipos.push({
            nombre: element,
            estado: false,
            codigo: element1,
          });
        }
      },
      error: (error) => {
        Swal.fire(
          'Ocurrio un accidente',
          'Comunicate con sistemas: ' + error,
          'info'
        );
        console.log(error);
        this.spinner.hide();
      },
    });
  }

  private ajaxQueryPostListaOrigen(urlEndPoint: string): any {
    let t_result!: any;
    $.ajax({
      url: urlEndPoint,
      async: false,
      type: 'GET',
      crossDomain: true,
      contentType: 'application/json',
      success: (result) => {
        for (let index = 0; index < result.length; index++) {
          var element = result[index].nombre;
          var element1 = result[index].codigo;

          this.origenes.push({
            nombre: element,
            estado: false,
            codigo: element1,
          });
        }
      },
      error: (error) => {
        Swal.fire(
          'Ocurrio un accidente',
          'Comunicate con sistemas: ' + error,
          'info'
        );
        console.log(error);
        this.spinner.hide();
      },
    });
  }

  private ajaxQueryPostValida(urlEndPoint: string): any {
    let t_result!: any;
    $.ajax({
      url: urlEndPoint,
      async: false,
      type: 'GET',
      crossDomain: true,
      contentType: 'application/json',
      success: (result) => {
        this.Validacion = result;
        this.spinner.hide();
      },
      error: (error) => {
        console.log(error);
        this.spinner.hide();
      },
    });
  }

  activarBlur(parametro1: any, parametro2: any) {
    const event = new FocusEvent('blur');
    this.parseTwoDecimal(parametro1, parametro2);
  }

  parseTwoDecimal(monto, nameAtribute) {
    let newMonto = Number.parseFloat(monto).toFixed(2); //monto.toFixed(2);
    this.cuponOmni[nameAtribute] = newMonto;
  }

  private parseProductToValidate(
    canal: number,
    productArray: { codigo: string; producto: string }[]
  ) {
    return productArray.map((prd) => ({
      canal,
      producto: prd.codigo.toString(),
      cantidad: this.cuponOmni.nroCuponAGenerar,
      nombreProducto: prd.producto,
      nombre: prd.producto.toString(),
    }));
  }

  private existsDuplicate(
    consolidado: ProductoCarta[],
    selectedArray: ProductoCarta[]
  ): boolean {
    return consolidado.some((con) =>
      selectedArray.some((sel) => sel.codigo === con.codigo)
    );
  }

  private checkSameChannel(
    channel: number,
    selectedArray: ProductoCarta[]
  ): boolean {
    return (
      selectedArray.length > 1 ||
      this.CartaFinal.some((con) => channel === con.canal)
    );
  }

  private addProductCondition(
    selectedArray: ProductoCarta[],
    type: number,
    channel: number,
    arrayToCompare?
  ): boolean {
    return (
      this.existsDuplicate(this.productosCartaConsolidado, selectedArray) ||
      ([1, 2].includes(type) &&
        this.checkSameChannel(channel, selectedArray) &&
        [...selectedArray, ...(arrayToCompare || this.CartaDetalleVista)]
          .length > 1)
    );
  }

  caracteres_especiales(event: Event) {
    const inputElement = event.target as HTMLInputElement; 
    const newValue = inputElement.value; 
    //console.log(newValue.substr(0, 1));
    this.inputValueCaracter = '';
    for (let i = 0; i < newValue.length; i++) {
      //if (/^[a-zA-Z0-9]*$/.test(newValue[i])) {
      if (/^[a-zA-Z0-9 ]*$/.test(newValue[i])) {
        this.inputValueCaracter += newValue[i].toUpperCase();
      }
    }
    this.cuponOmni.nombreCampanha = this.inputValueCaracter;
  }

  caracteres_especiales_alianza(event: Event) {
    const inputElement = event.target as HTMLInputElement; 
    const newValue = inputElement.value; 
    //console.log(newValue.substr(0, 1));
    this.inputValueCaracterAlianza = '';
    for (let i = 0; i < newValue.length; i++) {
      if (/^[a-zA-Z0-9 ]*$/.test(newValue[i])) {
        this.inputValueCaracterAlianza += newValue[i].toUpperCase();
      }
    }
    this.cuponOmni.alianza = this.inputValueCaracterAlianza;
  }

  caracteres_validacion_codigo(event: Event) {
    const inputElement = event.target as HTMLInputElement; 
    const newValue = inputElement.value;
    //console.log(newValue.substr(0, 1));
    this.inputValueValidacionCodigo = '';
    for (let i = 0; i < newValue.length; i++) {
      if (/^[a-np-zA-Z0-9]*$/.test(newValue[i]) && i<30) {
        this.inputValueValidacionCodigo += newValue[i].toUpperCase();
      }
    }
    this.cuponOmni.codigo = this.inputValueValidacionCodigo;
  }
  
}
