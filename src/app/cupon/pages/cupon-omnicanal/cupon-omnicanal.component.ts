import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TipoCuponOmnicanal } from '../../entity/tipo-cupon-omnicanal';
import { CartaConsolidada, CartaDetalleVista, ProductoCarta } from '../../entity/producto-carta';
import { ProductoCartaService } from '../../services/producto-carta.service'
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { OmnicanalDto } from '../../dto/omnicalanal-dto';
import { error } from 'console';
import swal from 'sweetalert2';
import { CartaOmnicanal } from '../../entity/cartaOmnicanal';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CuponOmnicanal, CuponOmnicanalC, detalle } from '../../entity/cuponOmnicanal';
import { EmpresaService } from 'src/app/shared/services/empresa.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { CanalDetalle } from '../../entity/canalDetalle';
import { BrowserStack } from 'protractor/built/driverProviders';
import Swal from 'sweetalert2';

import * as $ from 'jquery';
import { environment } from 'src/environments/environment';
import { CuponesOmnicanalService } from '../../services/cupones-omnicanal.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';


@Component({
  selector: 'app-cupon-omnicanal',
  templateUrl: './cupon-omnicanal.component.html',
  styleUrls: ['./cupon-omnicanal.component.css']
})

export class CuponOmnicanalComponent implements OnInit {

  public selectCountTimes: string = '1';
  public activeOptions: boolean = false;
  public selectionTypeCupon: string = '0';
  public validacion: string = '';


/* Validaciones Campos */
  public showCuponesGenerar: boolean = false;
  public showCantidadMaximaUso: boolean = false;
  public showCodigo: boolean = false;
  public showMontoPagar: boolean = false;
  public showNecesitaMontoMinimo: boolean = false;
  public showMontoMinimo: boolean = false;
  public showCanales: boolean = true;
  public showExento: boolean = true;
  public showTableProducts: boolean = false;
  public showProductsWeb: boolean = false;
  public showProductsCall: boolean = false;
  public showProductsSalon: boolean = false;
  public showProductsBot: boolean = false;
  public shoPorcentajeDescuento: boolean = false;
  public showMaximoDescuento: boolean = false;
  public showVacio: boolean = false; 
  public showVacio2: boolean = false; 
  public showVacio3: boolean = false; 
  public showDelivery: boolean = false; 
  public showMontoDescuento: boolean = false; 

  public type: string = 'V';
  public campana: string;
  public displayModal: boolean;

  public nameProductSelect: string;

  public productosCartaWeb: ProductoCarta[] = [];
  public productosCartaCallCenter: ProductoCarta[] = [];
  public productosCartaSalon: ProductoCarta[] = [];
  public productosCartaConsolidado: ProductoCarta[] = [];
  public CartaFinal: CartaConsolidada[] = [];
  public CartaFinaltipos: CartaConsolidada[] = [];
  public CartaDetalleVista: CartaDetalleVista[] = [];

  public CartaWebSelectedSelected!: ProductoCarta;
  public CartaCallSelectedSelected!: ProductoCarta;
  public CartaSalonSelectedSelected!: ProductoCarta;
  public CartaConsolidadoSelectedSelected!: ProductoCarta;  
  public DetalleSelected!: detalle;
  public maxCantidadProductos: number = 0;
  
  public canalDetalle: CanalDetalle[] = [];

  private ref!: DynamicDialogRef;

  public searchWeb: string='';
  public searchCall: string='';
  public searchSalon: string='';
  public Cantidad: number;

  public productosCartaWebTemp: ProductoCarta[] = [];
  public productosCartaCallCenterTemp: ProductoCarta[] = [];
  public productosCartaSalonTemp: ProductoCarta[] = [];

  public selectionProduct: ProductoCarta = { carta: '', nombre: '', codigo: '', detalle: '', menu: '', producto: ''};

  public feInicio!: Date;
  public feFin!: Date;
  public montoMinimo: number ;
  public cantidadActivo: boolean = false;

  public tipos: TipoCuponOmnicanal[] = [{ nombre: 'Seleccionar tipo', estado: true, codigo: 0 },
  { nombre: 'Cupón Precio Fijo a un producto', estado: false, codigo: 1 },
  { nombre: 'Cupón descuento % a un producto', estado: false, codigo: 2 },
  { nombre: 'Cupón descuento % a varios producto', estado: false, codigo: 3 },
  { nombre: 'Cupón descuento Recargo de Delivery', estado: false, codigo: 4 },
  { nombre: 'Cupón descuento monto fijo al  total', estado: false, codigo: 5 },
  { nombre: 'Cupón descuento % al monto total', estado: false, codigo: 6 }]

  
  public getProductSelect: ProductoCarta[] = [];

  Bucket: String;
  cartaOmnicanal : CartaOmnicanal[] = [];

  public cuponOmni: CuponOmnicanal = new CuponOmnicanal();
  public cuponOmniD: CuponOmnicanalC[] = [];
  public detalles: detalle[] = [];
  public cuponOmni2: {};
  public cuponOmni4: {};
  public cuponOmni3: {};
  private urlEndPointOmnicanal: string;
  private urlLista: string;

  constructor(private router: Router, 
              private dialogService: DialogService, 
              private cartaService: ProductoCartaService,
              private empresaService: EmpresaService,
              private dataCupones: CuponesOmnicanalService,
              private authService: AuthService,
              private spinner: NgxSpinnerService) {
                this.urlEndPointOmnicanal = environment.urlOmnicanalA;    
                this.urlLista = environment.urlCarta;

               /*  this.searchWeb='';
                this.searchCall='';
                this.searchSalon=''; */
               }

  ngOnInit(): void {
    this.clearCuponData();
    this.tipoOperacion();
    this.showMontoMinimo = false;
    this.getProductSelect = this.cartaService.getDataProductSelect();

    this.productosCartaConsolidado.splice(0, 1);  
  }

  filtroWeb(){
    if(this.searchWeb.length > 0){
      this.productosCartaWeb =  this.productosCartaWebTemp.filter((item) => {
        if (item.producto.toLowerCase().indexOf(this.searchWeb.toLowerCase()) > 0) {
          return true;
        }
        if (item.codigo.toString().toLowerCase().indexOf(this.searchWeb.toLowerCase( )) >= 0) {
          return true;
        }
        if (item.menu.toLowerCase().indexOf(this.searchWeb.toLowerCase( )) >= 0) {
          return true;
        }
        return false;
      })
    } else{
      this.productosCartaWeb =  this.productosCartaWebTemp;
    }
 }

 filtroCall(){
  if(this.searchCall.length > 0){
      this.productosCartaCallCenter =  this.productosCartaCallCenterTemp.filter((item) => {
        if (item.producto.toLowerCase().indexOf(this.searchCall.toLowerCase()) > 0) {
          return true;
        }
        if (item.codigo.toString().toLowerCase().indexOf(this.searchCall.toLowerCase( )) >= 0) {
          return true;
        }
        if (item.menu.toLowerCase().indexOf(this.searchCall.toLowerCase( )) >= 0) {
          return true;
        }
        return false;
      })
    } else{
      this.productosCartaCallCenter =  this.productosCartaCallCenterTemp;
    }
  }

  filtroSalon(){
    if(this.searchSalon.length > 0){
        this.productosCartaSalon =  this.productosCartaSalonTemp.filter((item) => {
          if (item.producto.toLowerCase().indexOf(this.searchSalon.toLowerCase()) > 0) {
            return true;
          }
          if (item.codigo.toString().toLowerCase().indexOf(this.searchSalon.toLowerCase( )) >= 0) {
            return true;
          }
          if (item.menu.toLowerCase().indexOf(this.searchSalon.toLowerCase( )) >= 0) {
            return true;
          }
          return false;
        })
      } else{
        this.productosCartaSalon =  this.productosCartaSalonTemp;
      }
    }
  
  minDate = new Date();
  delivery = 100;

  private tipoOperacion(): void {
    if (sessionStorage.getItem('tipoOperacion')) {
      this.type = sessionStorage.getItem('tipoOperacion')!;
      if (this.type !== "N") {
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
    this.cuponOmni.activoCompraMin= 0;
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
    if(this.cuponOmni.codigo){
      if(
        this.cuponOmni.codigo.length > 4 
        && this.cuponOmni.codigo.length < 11 
        && this.cuponOmni.codigo.toUpperCase().search('Ñ') < 0
        && this.cuponOmni.codigo.toUpperCase().search('O') < 0
        && this.cuponOmni.codigo.toUpperCase().search(' ') < 0
        ){ 
        this.formatoCodigo = true; } else { this.formatoCodigo = false; }
    }

    //console.log("this.formatoCodigo", this.formatoCodigo);
    
  }

  private getUsuario(): string {
    return this.authService.usuario.user.shortName;
  }

  showModalDialog() {
    if( 
      (this.selectionProduct.carta.length>0) && 
      (this.selectionProduct.codigo.length>0) && 
      (this.selectionProduct.nombre.length>0)
    ){
      if(
        this.selectionTypeCupon == '1'
        || this.selectionTypeCupon == '2'
        ){
        if(this.cuponOmni.canaldetalle.length < 1){
          this.displayModal = true;
        } else {
          Swal.fire('Producto.', 'Tipo de cupón solo para 1 producto.' , 'error');
        }
      } else { 
        this.displayModal = true;
      } 
    }else{
      console.error("Error en detalle del producto", this.selectionProduct);
    }    

  }

  

  showModalDialogCartaWeb(){    
    let tipo = parseInt(this.selectionTypeCupon);

    if(tipo == 1 && this.CartaFinal.filter(x=> x.canal == 2).length > 0){
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'No se puede añadir más de un producto',
        showConfirmButton: false,
        timer: 1500
      })
      return;
    }
    this.productosCartaConsolidado.push(this.CartaWebSelectedSelected);
    console.log("this.CartaWebSelectedSelected",this.CartaWebSelectedSelected);
    this.CartaFinal.push({canal:2, producto : this.CartaWebSelectedSelected.codigo.toString(),cantidad: this.cuponOmni.nroCuponAGenerar});
    this.CartaDetalleVista.push({canal:2, producto : this.CartaWebSelectedSelected.codigo.toString(),nombre: this.CartaWebSelectedSelected.producto.toString()});
    console.log(this.CartaDetalleVista);
  }

  showModalDialogCartaCall(){
    let tipo = parseInt(this.selectionTypeCupon);
    
    if(tipo == 1 && this.CartaFinal.filter(x=> x.canal == 1).length > 0){
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'No se puede añadir más de un producto',
        showConfirmButton: false,
        timer: 1500
      })
      return;
    }
    this.productosCartaConsolidado.push(this.CartaCallSelectedSelected);
    this.CartaFinal.push({canal:1, producto : this.CartaCallSelectedSelected.codigo.toString(),cantidad: this.cuponOmni.nroCuponAGenerar});
    this.CartaDetalleVista.push({canal:1, producto : this.CartaCallSelectedSelected.codigo.toString(),nombre: this.CartaCallSelectedSelected.producto.toString()});
    console.log(this.CartaDetalleVista);
  }

  showModalDialogCartaSalon(){
    let tipo = parseInt(this.selectionTypeCupon);
    
    if(tipo == 1 && this.CartaFinal.filter(x=> x.canal == 0).length > 0){
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'No se puede añadir más de un producto',
        showConfirmButton: false,
        timer: 1500
      })
      return;
    }
    this.productosCartaConsolidado.push(this.CartaSalonSelectedSelected);
    this.CartaFinal.push({canal:0, producto : this.CartaSalonSelectedSelected.codigo.toString(),cantidad: this.cuponOmni.nroCuponAGenerar});
    this.CartaDetalleVista.push({canal:0, producto : this.CartaSalonSelectedSelected.codigo.toString(),nombre: this.CartaSalonSelectedSelected.producto.toString()});
    console.log(this.CartaDetalleVista);
  }

  QuitarProducto(){
    if(this.CartaConsolidadoSelectedSelected){
      this.productosCartaConsolidado = this.productosCartaConsolidado.filter(x => x.codigo != this.CartaConsolidadoSelectedSelected.codigo);
      this.CartaFinal = this.CartaFinal.filter(x => x.producto != this.CartaConsolidadoSelectedSelected.codigo);
      this.CartaDetalleVista = this.CartaDetalleVista.filter(x => x.producto != this.CartaConsolidadoSelectedSelected.codigo);
    }

    console.table(this.productosCartaConsolidado);
    console.table(this.CartaFinal);
  }

  cancelarModal() {
    this.displayModal = false;
  }

  Exento: string = '';  // Boolean flag
  webVal: string = '';
  callVal: string = '';
  salonVal: string = '';

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

    else if (this.selectionTypeCupon == '1' && tipo == 2) {
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

    else if (this.selectionTypeCupon == '2' && tipo == 1) {
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
    }

    else if (this.selectionTypeCupon == '2' && tipo == 2) { 
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
    }

    else if (this.selectionTypeCupon == '3' && tipo == 1) {
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
    }

    else if (this.selectionTypeCupon == '3' && tipo == 2) {
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
    }

    else if (this.selectionTypeCupon == '4' && tipo == 1) {
      this.showCuponesGenerar = true;
      this.showCantidadMaximaUso = false;
      this.showCodigo = false;
      this.showMontoPagar = false;
      this.showNecesitaMontoMinimo = true;
      this.showMontoMinimo = false;
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
    }

    else if (this.selectionTypeCupon == '4' && tipo == 2) {      
      this.showCuponesGenerar = true;
      this.cuponOmni.nroCuponAGenerar = 1;
      this.showCantidadMaximaUso = true;
      this.showCodigo = true;
      this.showMontoPagar = false;
      this.showNecesitaMontoMinimo = true;
      this.showMontoMinimo = false;
      this.showCanales = true;
      this.showTableProducts = true;
      this.showMaximoDescuento = false;
      this.shoPorcentajeDescuento = false;
      this.showVacio = true;
      this.showDelivery = true;
      this.cuponOmni.percentdsct = 100;
      this.showMontoDescuento = false;
      this.showExento = true;
    }

    else if (this.selectionTypeCupon == '5' && tipo == 1) {
      this.showCuponesGenerar = true;
      this.showCantidadMaximaUso = false;
      this.showCodigo = false;
      this.showMontoPagar = false;
      this.showNecesitaMontoMinimo = true;
      this.showMontoMinimo = false;
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
    }

    else if (this.selectionTypeCupon == '5' && tipo == 2) {
      this.showCuponesGenerar = true;
      this.showCantidadMaximaUso = true;
      this.cuponOmni.nroCuponAGenerar = 1;
      this.showCodigo = true;
      this.showMontoPagar = false;
      this.showNecesitaMontoMinimo = true;
      this.showMontoMinimo = false;
      this.showCanales = false;
      this.showTableProducts = false;
      this.showMaximoDescuento = false;
      this.shoPorcentajeDescuento = false;
      this.showVacio = true;
      this.showDelivery = false;
      this.showMontoDescuento = true;
      this.showExento = true;
    }

    else if (this.selectionTypeCupon == '6' && tipo == 1) {
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
    }

    else if (this.selectionTypeCupon == '6' && tipo == 2) {
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
    }
  }

  // Agregar Codigo Carta Web
  public obtenerCartaWeb(): string {
    //Modificar según especificación de POS
    let idEmpresa = this.empresaService.getEmpresaSeleccionada().idEmpresa;
    let codMarca = '';
    let codCodigo = '';
    switch (idEmpresa){
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
    switch (idEmpresa){
      case 2:
        codMarca = '22089';
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
    switch (idEmpresa){
      case 2:
        codMarca = '22102';
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
    if(this.selectionTypeCupon == '4' && idEmpresa == 2){
      codCodigo = 'Bembos-Delivery';
    } else if(this.selectionTypeCupon != '4' && idEmpresa == 2){
      codCodigo = 'Bembos';
    }
    else if(this.selectionTypeCupon == '4' && idEmpresa == 5){
      codCodigo = 'Chinawok-Delivery';
    } else if(this.selectionTypeCupon != '4' && idEmpresa == 5){
      codCodigo = 'Chinawok';
    }
    else if(this.selectionTypeCupon == '4' && idEmpresa == 3){
      codCodigo = 'Belisario Delivery';
    } else if(this.selectionTypeCupon != '4' && idEmpresa == 3){
      codCodigo = 'Don Belisario';
    }
    else if(this.selectionTypeCupon == '4' && idEmpresa == 4){
      codCodigo = 'Popeyes-Delivery';
    } else if(this.selectionTypeCupon != '4' && idEmpresa == 4){
      codCodigo = 'Popeyes';
    }
    else if(this.selectionTypeCupon == '4' && idEmpresa == 7){
      codCodigo = 'Papa Johns-Delivery';
    } else if(this.selectionTypeCupon != '4' && idEmpresa == 7){
      codCodigo = 'Papa Johns';
    }
    else if(this.selectionTypeCupon == '4' && idEmpresa == 8){
      codCodigo = 'Dunkin Delivery';
    } else if(this.selectionTypeCupon != '4' && idEmpresa == 8){
      codCodigo = 'Dunkin Donuts';
    }
    return codCodigo;    
  }


  showTableWeb(event) {
    this.showProductsWeb = event.checked;
    this.getCartaxTipo(this.obtenerCartaWeb(),this.nombreMarca()); //Modificar según especificación de POS
    console.log(this.webVal);    
  }
  showTableCall(event) {
    this.showProductsCall = event.checked;
    this.getCartaxTipoCall(this.obtenerCartaCall(),this.nombreMarca()); //Modificar según especificación de POS
    console.log(this.callVal);
    console.log(this.Exento);
  }
  showTableSalon(event) {
    this.showProductsSalon = event.checked;
    this.getCartaxTipoSalon(this.obtenerCartaSalon(),this.nombreMarca()); //Modificar según especificación de POS
    console.log(this.salonVal);
  }



  valueRadio(event) {
    this.cuponOmni.nroUso = parseInt(this.selectCountTimes);
    //console.log(this.selectCountTimes);
    if (this.selectCountTimes == "2") {
      this.activeOptions = true;
      this.cantidadActivo = false;
    }
    else {
      this.activeOptions = true;
      this.cantidadActivo = true;
    }

  }


  public cancelar(): void {
    this.router.navigateByUrl('/home/cupon/lista-cupon-omnicanal');
  }


  public getDetailsSelectCupon() {
    const id = Number(sessionStorage.getItem('cupon-omnicanal')!)
    
    this.cartaService.getCampana(id).subscribe(      
      cuponOmni => {
        this.cuponOmniD = cuponOmni;
        
        this.cuponOmni.fecInicio = new Date(this.cuponOmniD[0].fecInicio);
        this.cuponOmni.fecFin = new Date(this.cuponOmniD[0].fecFin);
        this.cuponOmni.nombreCampanha = this.cuponOmniD[0].nombreCampanha;
        this.cuponOmni.alianza = this.cuponOmniD[0].alianza;
        this.selectCountTimes = this.cuponOmniD[0].tipo.toString();
        // this.selectionTypeCupon = this.cuponOmniD[0].tipoCupon.toString();
        


        this.tipos = this.tipos.filter(r => {          
          return r.codigo == this.cuponOmniD[0].tipoCupon;
        });

        if (this.cuponOmniD[0].tipoCupon) {
          this.tipos.forEach(r => {            
            if (r.codigo.toString() === this.cuponOmniD[0].tipoCupon.toString()) {
              this.selectionTypeCupon = r.codigo.toString();              
              console.log(this.selectionTypeCupon);
              $("#TiposC").val(r.nombre);

            }
          })
        }

        if (this.cuponOmniD[0].tipoCupon == 1 && this.cuponOmniD[0].tipo == 1) {
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
        }
    
        else if (this.cuponOmniD[0].tipoCupon == 1 && this.cuponOmniD[0].tipo == 2) {
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
    
        else if (this.cuponOmniD[0].tipoCupon == 2 && this.cuponOmniD[0].tipo == 1) {
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
        }
    
        else if (this.cuponOmniD[0].tipoCupon == 2 && this.cuponOmniD[0].tipo == 2) { 
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
        }
    
        else if (this.cuponOmniD[0].tipoCupon == 3 && this.cuponOmniD[0].tipo == 1) {
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
        }
    
        else if (this.cuponOmniD[0].tipoCupon == 3 && this.cuponOmniD[0].tipo == 2) {
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
        }
    
        else if (this.cuponOmniD[0].tipoCupon == 4 && this.cuponOmniD[0].tipo == 1) {
          this.showCuponesGenerar = true;
          this.showCantidadMaximaUso = false;
          this.showCodigo = false;
          this.showMontoPagar = false;
          this.showNecesitaMontoMinimo = true;
          this.showMontoMinimo = false;
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
        }
    
        else if (this.cuponOmniD[0].tipoCupon == 4 && this.cuponOmniD[0].tipo == 2) {      
          this.showCuponesGenerar = true;
          this.cuponOmni.nroCuponAGenerar = 1;
          this.showCantidadMaximaUso = true;
          this.showCodigo = true;
          this.showMontoPagar = false;
          this.showNecesitaMontoMinimo = true;
          this.showMontoMinimo = false;
          this.showCanales = true;
          this.showTableProducts = true;
          this.showMaximoDescuento = false;
          this.shoPorcentajeDescuento = false;
          this.showVacio = true;
          this.showDelivery = true;
          this.cuponOmni.percentdsct = 100;
          this.showMontoDescuento = false;
          this.showExento = true;
        }
    
        else if (this.cuponOmniD[0].tipoCupon == 5 && this.cuponOmniD[0].tipo == 1) {
          this.showCuponesGenerar = true;
          this.showCantidadMaximaUso = false;
          this.showCodigo = false;
          this.showMontoPagar = false;
          this.showNecesitaMontoMinimo = true;
          this.showMontoMinimo = false;
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
        }
    
        else if (this.cuponOmniD[0].tipoCupon == 5 && this.cuponOmniD[0].tipo == 2) {
          this.showCuponesGenerar = true;
          this.showCantidadMaximaUso = true;
          this.cuponOmni.nroCuponAGenerar = 1;
          this.showCodigo = true;
          this.showMontoPagar = false;
          this.showNecesitaMontoMinimo = true;
          this.showMontoMinimo = false;
          this.showCanales = false;
          this.showTableProducts = false;
          this.showMaximoDescuento = false;
          this.shoPorcentajeDescuento = false;
          this.showVacio = true;
          this.showDelivery = false;
          this.showMontoDescuento = true;
          this.showExento = true;
        }
    
        else if (this.cuponOmniD[0].tipoCupon == 6 && this.cuponOmniD[0].tipo == 1) {
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
        }
    
        else if (this.cuponOmniD[0].tipoCupon == 6 && this.cuponOmniD[0].tipo == 2) {
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
          this.cuponOmni.nroCuponAGenerar = this.cuponOmniD[0].nroCuponAGenerar;
          this.cuponOmni.monto = this.cuponOmniD[0].monto;
          this.cuponOmni.activoCompraMin = this.cuponOmniD[0].activoCompraMin;
          this.cuponOmni.compraMin = this.cuponOmniD[0].compraMin;          
        }
    
        else if (this.cuponOmniD[0].tipoCupon == 1 && this.cuponOmniD[0].tipo == 2) {
          this.cuponOmni.nroCuponAGenerar = this.cuponOmniD[0].nroCuponAGenerar;
          this.cuponOmni.monto = this.cuponOmniD[0].monto;
          this.cuponOmni.activoCompraMin = this.cuponOmniD[0].activoCompraMin;
          this.cuponOmni.compraMin = this.cuponOmniD[0].compraMin;
          this.cuponOmni.nroUso = this.cuponOmniD[0].maximouso;
          this.cuponOmni.codigo = this.cuponOmniD[0].codigo;
        }
    
        else if (this.cuponOmniD[0].tipoCupon == 2 && this.cuponOmniD[0].tipo == 1) {
          this.cuponOmni.nroCuponAGenerar = this.cuponOmniD[0].nroCuponAGenerar;
          this.cuponOmni.activoCompraMin = this.cuponOmniD[0].activoCompraMin;
          this.cuponOmni.compraMin = this.cuponOmniD[0].compraMin;
          this.cuponOmni.montoMax = this.cuponOmniD[0].montoMax;
          this.cuponOmni.percentdsct = this.cuponOmniD[0].percentdsct;          
        }
    
        else if (this.cuponOmniD[0].tipoCupon == 2 && this.cuponOmniD[0].tipo == 2) { 
          this.cuponOmni.nroCuponAGenerar = this.cuponOmniD[0].nroCuponAGenerar;
          this.cuponOmni.activoCompraMin = this.cuponOmniD[0].activoCompraMin;
          this.cuponOmni.compraMin = this.cuponOmniD[0].compraMin;
          this.cuponOmni.nroUso = this.cuponOmniD[0].maximouso;
          this.cuponOmni.codigo = this.cuponOmniD[0].codigo;
          this.cuponOmni.montoMax = this.cuponOmniD[0].montoMax;
          this.cuponOmni.percentdsct = this.cuponOmniD[0].percentdsct;          
        }
    
        else if (this.cuponOmniD[0].tipoCupon == 3 && this.cuponOmniD[0].tipo == 1) {
          this.cuponOmni.nroCuponAGenerar = this.cuponOmniD[0].nroCuponAGenerar;
          this.cuponOmni.activoCompraMin = this.cuponOmniD[0].activoCompraMin;
          this.cuponOmni.compraMin = this.cuponOmniD[0].compraMin;
          this.cuponOmni.montoMax = this.cuponOmniD[0].montoMax;
          this.cuponOmni.percentdsct = this.cuponOmniD[0].percentdsct;
        }
    
        else if (this.cuponOmniD[0].tipoCupon == 3 && this.cuponOmniD[0].tipo == 2) {
          this.cuponOmni.nroCuponAGenerar = this.cuponOmniD[0].nroCuponAGenerar;
          this.cuponOmni.activoCompraMin = this.cuponOmniD[0].activoCompraMin;
          this.cuponOmni.compraMin = this.cuponOmniD[0].compraMin;
          this.cuponOmni.nroUso = this.cuponOmniD[0].maximouso;
          this.cuponOmni.codigo = this.cuponOmniD[0].codigo;
          this.cuponOmni.montoMax = this.cuponOmniD[0].montoMax;
          this.cuponOmni.percentdsct = this.cuponOmniD[0].percentdsct;   
        }
    
        else if (this.cuponOmniD[0].tipoCupon == 4 && this.cuponOmniD[0].tipo == 1) {
          this.cuponOmni.nroCuponAGenerar = this.cuponOmniD[0].nroCuponAGenerar;
          this.cuponOmni.activoCompraMin = this.cuponOmniD[0].activoCompraMin;
          this.cuponOmni.compraMin = this.cuponOmniD[0].compraMin;
          this.cuponOmni.percentdsct = this.cuponOmniD[0].percentdsct;
        }
    
        else if (this.cuponOmniD[0].tipoCupon == 4 && this.cuponOmniD[0].tipo == 2) {  
          this.cuponOmni.nroCuponAGenerar = this.cuponOmniD[0].nroCuponAGenerar;
          this.cuponOmni.activoCompraMin = this.cuponOmniD[0].activoCompraMin;
          this.cuponOmni.compraMin = this.cuponOmniD[0].compraMin;
          this.cuponOmni.percentdsct = this.cuponOmniD[0].percentdsct;
          this.cuponOmni.nroUso = this.cuponOmniD[0].maximouso;
          this.cuponOmni.codigo = this.cuponOmniD[0].codigo;          
        }
    
        else if (this.cuponOmniD[0].tipoCupon == 5 && this.cuponOmniD[0].tipo == 1) {
          this.cuponOmni.nroCuponAGenerar = this.cuponOmniD[0].nroCuponAGenerar;
          this.cuponOmni.activoCompraMin = this.cuponOmniD[0].activoCompraMin;
          this.cuponOmni.compraMin = this.cuponOmniD[0].compraMin;
          this.cuponOmni.percentdsct = this.cuponOmniD[0].montodescuento;
        }
    
        else if (this.cuponOmniD[0].tipoCupon == 5 && this.cuponOmniD[0].tipo == 2) {
          this.cuponOmni.nroCuponAGenerar = this.cuponOmniD[0].nroCuponAGenerar;
          this.cuponOmni.activoCompraMin = this.cuponOmniD[0].activoCompraMin;
          this.cuponOmni.compraMin = this.cuponOmniD[0].compraMin;
          this.cuponOmni.percentdsct = this.cuponOmniD[0].montodescuento;
          this.cuponOmni.nroUso = this.cuponOmniD[0].maximouso;
          this.cuponOmni.codigo = this.cuponOmniD[0].codigo;  
        }
    
        else if (this.cuponOmniD[0].tipoCupon == 6 && this.cuponOmniD[0].tipo == 1) {
          this.cuponOmni.nroCuponAGenerar = this.cuponOmniD[0].nroCuponAGenerar;
          this.cuponOmni.compraMin = this.cuponOmniD[0].compraMin;
          this.cuponOmni.montoMax = this.cuponOmniD[0].montoMax;
          this.cuponOmni.percentdsct = this.cuponOmniD[0].percentdsct;
        }
    
        else if (this.cuponOmniD[0].tipoCupon == 6 && this.cuponOmniD[0].tipo == 2) {
          this.cuponOmni.nroCuponAGenerar = this.cuponOmniD[0].nroCuponAGenerar;
          this.cuponOmni.compraMin = this.cuponOmniD[0].compraMin;
          this.cuponOmni.montoMax = this.cuponOmniD[0].montoMax;
          this.cuponOmni.percentdsct = this.cuponOmniD[0].percentdsct;
          this.cuponOmni.nroUso = this.cuponOmniD[0].maximouso;
          this.cuponOmni.codigo = this.cuponOmniD[0].codigo;  
        }
        
        this.cartaService.getDetalleVales(id).subscribe(
          detalles => {
            this.spinner.hide();
            this.detalles = detalles;

            
            
          }, 
          err => {
            this.spinner.hide();
            swal.fire('Error', err.error.mensaje === undefined ? err.error.message : err.error.mensaje, 'error');
            this.type = 'V';
          }
        );
      }, 
      err => {
        this.spinner.hide();
        swal.fire('Error', err.error.mensaje === undefined ? err.error.message : err.error.mensaje, 'error');
        this.type = 'V';
      }
    );

  }
  
  public getCartaxTipo(menuIndex: string, marca:string){
    this.spinner.show();
    
    let dto = new OmnicanalDto();
    dto.carta = menuIndex;
    dto.marca = marca;

    this.cartaService.getDataCartaxTipo(dto).subscribe(
      carta => {
        console.log("cartaService.getDataCartaxTipo",carta);
        this.productosCartaWebTemp = carta;
        this.productosCartaWeb=this.productosCartaWebTemp;
        this.spinner.hide();
      },
      err =>{
        this.spinner.hide();
        swal.fire('Error','Error al cargar la carta.','error');
      }
    )
  }

  public getCartaxTipoCall(menuIndex: string, marca:string){
    this.spinner.show();
    
    let dto = new OmnicanalDto();
    dto.carta = menuIndex;
    dto.marca = marca;

    this.cartaService.getDataCartaxTipo(dto).subscribe(
      carta => {
        this.productosCartaCallCenterTemp = carta;
        this.productosCartaCallCenter=this.productosCartaCallCenterTemp;
        this.spinner.hide();
      },
      err =>{
        this.spinner.hide();
        swal.fire('Error','Error al cargar la carta.','error');
      }
    )
  }

  public getCartaxTipoSalon(menuIndex: string, marca:string){
    this.spinner.show();
    
    let dto = new OmnicanalDto();
    dto.carta = menuIndex;
    dto.marca = marca;

    this.cartaService.getDataCartaxTipo(dto).subscribe(
      carta => {
        this.productosCartaSalonTemp = carta;
        this.productosCartaSalon=this.productosCartaSalonTemp;
        this.spinner.hide();
      },
      err =>{
        this.spinner.hide();
        swal.fire('Error','Error al cargar la carta.','error');
      }
    )
  }

  public onRowSelectProduct(event) {
    this.selectionProduct = event.data;
    console.log(event);
    //console.log("this.selectionProduct", this.selectionProduct);
  }

  public onRowSelectUnselectProduct() {
    this.selectionProduct = { carta: '', nombre: '', codigo: '', detalle:'', menu: '', producto: ''};
  }

  public addProductwithAcount(cantidad: HTMLInputElement) {
    
    // console.log("this.selectionProduct", this.selectionProduct);

    let cant = parseInt(cantidad.value);
    if(cant > 0){
      if(this.selectionTypeCupon == '1'){
        if(cant == 1){ this.addProduct(cantidad);} else { Swal.fire('Producto.', 'Cupón solo adminte cantidad 1.' , 'error');}
      }else {
        this.addProduct(cantidad);
      }
      
    }else{
      Swal.fire('Producto.', 'La Cantidad debe ser mayor a 0.' , 'error');
    }

    

  }

  private addProduct(cantidad: any): void {
    let canalDetalle_temp: CanalDetalle= new CanalDetalle();

      switch(this.selectionProduct.carta){
        case "Web" : canalDetalle_temp.canal = 1; break;
        case "Call Center" : canalDetalle_temp.canal = 2; break;
        case "Carta Salon" : canalDetalle_temp.canal = 3; break;
        default : canalDetalle_temp.canal = 0; 
      }

      
      canalDetalle_temp.producto = this.selectionProduct.codigo;
      canalDetalle_temp.cantidad = parseInt(cantidad.value);

      let push:boolean = false;
      this.cuponOmni.canaldetalle.forEach( cup => {
        if( (cup.canal == canalDetalle_temp.canal) && (cup.producto === this.selectionProduct.codigo) ){
          cup.cantidad = canalDetalle_temp.cantidad;
          this.cartaService.updateProductTableSelect({
            carta: this.selectionProduct.carta,
            nombre: this.selectionProduct.nombre,
            codigo: this.selectionProduct.codigo,
            cantidad: cantidad.value
          }
        );
          push = true;
        }
      });

      if(!push){ 
        this.cuponOmni.canaldetalle.push(canalDetalle_temp); 
        this.cartaService.addProductTableSelect({
            carta: this.selectionProduct.carta,
            nombre: this.selectionProduct.nombre,
            codigo: this.selectionProduct.codigo,
            cantidad: cantidad.value
          }
        );
      }

      //console.log("cuponOmni", this.cuponOmni);

      this.displayModal = false;
      cantidad.value = '0';
      this.selectionProduct = { carta: '', nombre: '', codigo: '',detalle: '', menu: '', producto: ''};
  }

  public obtenerMarcaSeleccionada(): string {
    //Modificar según especificación de POS
    let idEmpresa = this.empresaService.getEmpresaSeleccionada().idEmpresa;
    let sMarca = '';
    switch (idEmpresa){
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


  public valueMinimo($event) {

    if(this.selectionTypeCupon == '2' || this.selectionTypeCupon == '3'){
      if($event.checked){
        this.showVacio = false;
        this.showVacio2 = true;
        this.showVacio3 = true;
      }else {
        this.showVacio = true;
        this.showVacio2 = true;
        this.showVacio3 = true;
      }
    } else if(this.selectionTypeCupon == '4' || this.selectionTypeCupon == '5' || this.selectionTypeCupon == '6'){
      if($event.checked){
        this.showVacio = true;
        this.showVacio2 = false;
        this.showVacio3 = false;
      }else {
        this.showVacio = true;
        this.showVacio2 = true;
        this.showVacio3 = false;
      }
    }

    if ($event.checked) {
      this.cuponOmni.activoCompraMin = 1;
      this.showMontoMinimo = true;

    } else {
      this.cuponOmni.activoCompraMin = 2;
      this.showMontoMinimo = false;
    }
    //console.log(this.cuponOmni.activoCompraMin);
  }

  public guardarCupon() {    
    console.log(sessionStorage.getItem('token_genesys'));
    sessionStorage.removeItem('token_genesys');
    console.log(sessionStorage.getItem('token_genesys'));
    this.isAuthenticated();
  }



  private isAuthenticated(): void {    
    this.spinner.show();
    if (this.dataCupones.isAuthenticated()) {      
      this.spinner.show();
      this.validarDataCupon();
    } else {      
      this.spinner.show();
      this.TokenClient();
    }

  }

  private TokenClient(): void {
    this.spinner.show();
    this.dataCupones.TokenClient().subscribe( resp => {
      setTimeout(() => {}, 3000);
      this.validarDataCupon();      
    }, e => {
      
      console.error(e);
    })
  }

  private validarDataCupon(): void {
    this.spinner.show();
    let validation: boolean = true;
    if(this.cuponOmni.alianza == ''){ console.log('Agregar nombre de la alianza'); validation = false;}
    if(this.cuponOmni.nombreCampanha == ''){ console.log('Agregar nombre de la campaña'); validation = false;}
    if(this.cuponOmni.tipoCupon == 0){ console.log('Seleccionar el tipo de Cupón'); validation = false;}
    if(!this.cuponOmni.fecInicio){ console.log('Seleccionar la fecha de Inicio'); validation = false;}
    if(!this.cuponOmni.fecFin){ console.log('Seleccionar la fecha de Fin'); validation = false;}
    if(this.cuponOmni.nroCuponAGenerar == 0 ){ console.log('Ingresar el numero de Cupon a Generar'); validation = false;} 
    
    if (this.cuponOmni.tipoCupon == 1 && this.selectCountTimes == '1') {
      console.log("this.cuponOmni.tipoCupon", this.cuponOmni.tipoCupon);    
      console.log("this.cuponOmni.tipoCupon", this.selectCountTimes);
      if(this.cuponOmni.monto == 0 ){ console.log('Ingresar el Monto a Pagar'); validation = false;}
      if(this.cuponOmni.compraMin == 0 && this.cuponOmni.activoCompraMin == 1){ console.log('Ingresar el monto minimo'); validation = false;}
      if(this.CartaFinal.length == 0 ){ console.log('Debe ingresar productos a la carta');  validation = false;}
      let minimo:number =  Number(this.cuponOmni.compraMin);
      let monto:number= Number(this.cuponOmni.monto);      
      if(minimo > monto && this.cuponOmni.activoCompraMin == 1){ console.log('Compra Minima debe ser menor a Monto'); validation = false;} 
      else {console.log("valores: ", minimo + ">" + monto)}
    }

    else if (this.cuponOmni.tipoCupon == 1 && this.selectCountTimes == '2') {
      if(this.cuponOmni.nroCuponAGenerar == 0){ console.log('Ingresar el numero de Cupon a Generar Mayor a 1'); validation = false;}
      if(this.cuponOmni.nroUso <= 1 ){ console.log('Ingresar el numero de Cupon a Generar Mayor a 1'); validation = false;}
      if(this.cuponOmni.codigo == "" ){ console.log('Ingresar el numero de Cupon a Generar Mayor a 1'); validation = false;}
      if(this.cuponOmni.monto == 0 ){ console.log('Ingresar el numero de Cupon a Generar Mayor a 1'); validation = false;}
      if(this.cuponOmni.compraMin == 0 && this.cuponOmni.activoCompraMin == 1 ){ console.log('Ingresar el numero de Cupon a Generar Mayor a 1'); validation = false;}
      if(this.CartaFinal.length == 0 ){ console.log('Debe ingresar productos a la carta'); validation = false;}
      let minimo:number =  Number(this.cuponOmni.compraMin);
      let monto:number= Number(this.cuponOmni.monto);      
      if(minimo > monto && this.cuponOmni.activoCompraMin == 1){ console.log('Compra Minima debe ser menor a Monto'); validation = false;}
    }

    else if (this.cuponOmni.tipoCupon == 2 && this.selectCountTimes == '1') {
      if(!this.cuponOmni.nroCuponAGenerar && this.cuponOmni.nroCuponAGenerar > 1 ){ console.error('Ingresar el numero de Cupon a Generar Mayor a 1'); validation = false;}
      if(!this.cuponOmni.compraMin && this.cuponOmni.compraMin == 0  && this.cuponOmni.activoCompraMin == 1){ console.error('Ingresar el numero de Cupon a Generar Mayor a 1'); validation = false;}
      if(this.CartaFinal.length == 0 ){ console.error('Debe ingresar productos a la carta'); validation = false;}
      if(!this.cuponOmni.montoMax && this.cuponOmni.montoMax == 0 ){ console.error('Ingresar el numero de Cupon a Generar Mayor a 1'); validation = false;}
      if(!this.cuponOmni.percentdsct && this.cuponOmni.percentdsct == 0 ){ console.error('Ingresar el numero de Cupon a Generar Mayor a 1'); validation = false;}
      if(this.cuponOmni.percentdsct > 100){ console.error('Monto debe ser menor a 100'); validation = false;}
    }

    else if (this.cuponOmni.tipoCupon == 2 && this.selectCountTimes == '2') { 
      if(!this.cuponOmni.nroCuponAGenerar && this.cuponOmni.nroCuponAGenerar == 0){ console.error('Ingresar el numero de Cupon a Generar Mayor a 1'); validation = false;}
      if(!this.cuponOmni.nroUso && this.cuponOmni.nroUso <= 0 ){ console.error('Ingresar el numero de Cupon a Generar Mayor a 1'); validation = false;}
      if(!this.cuponOmni.codigo && this.cuponOmni.codigo == "" ){ console.error('Ingresar el numero de Cupon a Generar Mayor a 1'); validation = false;}
      if(!this.cuponOmni.compraMin && this.cuponOmni.compraMin == 0  && this.cuponOmni.activoCompraMin == 1){ console.error('Ingresar el numero de Cupon a Generar Mayor a 1'); validation = false;}
      if(this.CartaFinal.length == 0 ){ console.error('Debe ingresar productos a la carta'); validation = false;}
      if(!this.cuponOmni.montoMax && this.cuponOmni.montoMax == 0 ){ console.error('Ingresar el numero de Cupon a Generar Mayor a 1'); validation = false;}
      if(!this.cuponOmni.percentdsct && this.cuponOmni.percentdsct == 0 ){ console.error('Ingresar el numero de Cupon a Generar Mayor a 1'); validation = false;}
      if(this.cuponOmni.percentdsct > 100){ console.error('Monto debe ser menor a 100'); validation = false;}
    }

    else if (this.cuponOmni.tipoCupon == 3 && this.selectCountTimes == '1') {
      if(!this.cuponOmni.nroCuponAGenerar && this.cuponOmni.nroCuponAGenerar > 1 ){ console.error('Ingresar el numero de Cupon a Generar Mayor a 1'); validation = false;}
      if(!this.cuponOmni.compraMin && this.cuponOmni.compraMin == 0  && this.cuponOmni.activoCompraMin == 1){ console.error('Ingresar el numero de Cupon a Generar Mayor a 1'); validation = false;}
      if(this.CartaFinal.length == 0 ){ console.error('Debe ingresar productos a la carta'); validation = false;}
      if(!this.cuponOmni.montoMax && this.cuponOmni.montoMax == 0 ){ console.error('Ingresar el numero de Cupon a Generar Mayor a 1'); validation = false;}
      if(!this.cuponOmni.percentdsct && this.cuponOmni.percentdsct == 0 ){ console.error('Ingresar el numero de Cupon a Generar Mayor a 1'); validation = false;}
      if(this.cuponOmni.percentdsct > 100){ console.error('Monto debe ser menor a 100'); validation = false;}
    }

    else if (this.cuponOmni.tipoCupon == 3 && this.selectCountTimes == '2') {
      if(!this.cuponOmni.nroCuponAGenerar && this.cuponOmni.nroCuponAGenerar == 0){ console.error('Ingresar el numero de Cupon a Generar Mayor a 1'); validation = false;}
      if(!this.cuponOmni.nroUso && this.cuponOmni.nroUso <= 0 ){ console.error('Ingresar el numero de Cupon a Generar Mayor a 1'); validation = false;}
      if(!this.cuponOmni.codigo && this.cuponOmni.codigo == "" ){ console.error('Ingresar el numero de Cupon a Generar Mayor a 1'); validation = false;}
      if(!this.cuponOmni.compraMin && this.cuponOmni.compraMin == 0 && this.cuponOmni.activoCompraMin == 1){ console.error('Ingresar el numero de Cupon a Generar Mayor a 1'); validation = false;}
      if(this.CartaFinal.length == 0 ){ console.error('Debe ingresar productos a la carta'); validation = false;}
      if(!this.cuponOmni.montoMax && this.cuponOmni.montoMax == 0 ){ console.error('Ingresar el numero de Cupon a Generar Mayor a 1'); validation = false;}
      if(!this.cuponOmni.percentdsct && this.cuponOmni.percentdsct == 0 ){ console.error('Ingresar el numero de Cupon a Generar Mayor a 1'); validation = false;}
      if(this.cuponOmni.percentdsct > 100){ console.error('Monto debe ser menor a 100'); validation = false;}
    }

    else if (this.cuponOmni.tipoCupon == 4 && this.selectCountTimes == '1') {
      if(!this.cuponOmni.nroCuponAGenerar && this.cuponOmni.nroCuponAGenerar > 1 ){ console.error('Ingresar el numero de Cupon a Generar Mayor a 1'); validation = false;}
      if(!this.cuponOmni.compraMin && this.cuponOmni.compraMin == 0  && this.cuponOmni.activoCompraMin == 1){ console.error('Ingresar el numero de Cupon a Generar Mayor a 1'); validation = false;}
      if(this.CartaFinal.length == 0 ){ console.error('Debe ingresar productos a la carta'); validation = false;}
      if(!this.cuponOmni.percentdsct && this.cuponOmni.percentdsct == 0 ){ console.error('Ingresar el numero de Cupon a Generar Mayor a 1'); validation = false;}    
    }

    else if (this.cuponOmni.tipoCupon == 4 && this.selectCountTimes == '2') {      
      if(!this.cuponOmni.nroCuponAGenerar && this.cuponOmni.nroCuponAGenerar == 0){ console.error('Ingresar el numero de Cupon a Generar Mayor a 1'); validation = false;}
      if(!this.cuponOmni.nroUso && this.cuponOmni.nroUso <= 0 ){ console.error('Ingresar el numero de Cupon a Generar Mayor a 1'); validation = false;}
      if(!this.cuponOmni.codigo && this.cuponOmni.codigo == "" ){ console.error('Ingresar el numero de Cupon a Generar Mayor a 1'); validation = false;}
      if(!this.cuponOmni.compraMin && this.cuponOmni.compraMin == 0  && this.cuponOmni.activoCompraMin == 1){ console.error('Ingresar el numero de Cupon a Generar Mayor a 1'); validation = false;}
      if(this.CartaFinal.length == 0 ){ console.error('Debe ingresar productos a la carta'); validation = false;}
      if(!this.cuponOmni.percentdsct && this.cuponOmni.percentdsct == 0 ){ console.error('Ingresar el numero de Cupon a Generar Mayor a 1'); validation = false;}      
    }

    else if (this.cuponOmni.tipoCupon == 5 && this.selectCountTimes == '1') {
      if(!this.cuponOmni.nroCuponAGenerar && this.cuponOmni.nroCuponAGenerar > 1 ){ console.error('Ingresar el numero de Cupon a Generar Mayor a 1'); validation = false;}
      if(!this.cuponOmni.compraMin && this.cuponOmni.compraMin == 0 && this.cuponOmni.activoCompraMin == 1){ console.error('Ingresar el numero de Cupon a Generar Mayor a 1'); validation = false;}
      if(!this.cuponOmni.percentdsct && this.cuponOmni.percentdsct == 0 ){ console.error('Ingresar el numero de Cupon a Generar Mayor a 1'); validation = false;}
      if(this.cuponOmni.compraMin<this.cuponOmni.percentdsct && this.cuponOmni.activoCompraMin == 1){ console.error('Compra Minima debe ser mayor a Monto de descuento'); validation = false;}
    }

    else if (this.cuponOmni.tipoCupon == 5 && this.selectCountTimes == '2') {
      if(!this.cuponOmni.nroCuponAGenerar && this.cuponOmni.nroCuponAGenerar == 0){ console.error('Ingresar el numero de Cupon a Generar Mayor a 1'); validation = false;}
      if(!this.cuponOmni.nroUso && this.cuponOmni.nroUso <= 0 ){ console.error('Ingresar el numero de Cupon a Generar Mayor a 1'); validation = false;}
      if(!this.cuponOmni.codigo && this.cuponOmni.codigo == "" ){ console.error('Ingresar el numero de Cupon a Generar Mayor a 1'); validation = false;}
      if(!this.cuponOmni.compraMin && this.cuponOmni.compraMin == 0 && this.cuponOmni.activoCompraMin == 1){ console.error('Ingresar el numero de Cupon a Generar Mayor a 1'); validation = false;}
      if(!this.cuponOmni.percentdsct && this.cuponOmni.percentdsct == 0 ){ console.error('Ingresar el numero de Cupon a Generar Mayor a 1'); validation = false;}
      if(this.cuponOmni.compraMin<this.cuponOmni.percentdsct && this.cuponOmni.activoCompraMin == 1){ console.error('Compra Minima debe ser mayor a Monto de descuento'); validation = false;}
    }

    else if (this.cuponOmni.tipoCupon == 6 && this.selectCountTimes == '1') {
      if(!this.cuponOmni.nroCuponAGenerar && this.cuponOmni.nroCuponAGenerar > 1 ){ console.error('Ingresar el numero de Cupon a Generar Mayor a 1'); validation = false;}
      if(!this.cuponOmni.compraMin && this.cuponOmni.compraMin == 0 && this.cuponOmni.activoCompraMin == 1){ console.error('Ingresar el numero de Cupon a Generar Mayor a 1'); validation = false;}
      if(!this.cuponOmni.montoMax && this.cuponOmni.montoMax == 0 ){ console.error('Ingresar el numero de Cupon a Generar Mayor a 1'); validation = false;}
      if(!this.cuponOmni.percentdsct && this.cuponOmni.percentdsct == 0 ){ console.error('Ingresar el numero de Cupon a Generar Mayor a 1'); validation = false;}  
      if(this.cuponOmni.percentdsct > 100){ console.error('Monto debe ser menor a 100'); validation = false;}
    }

    else if (this.cuponOmni.tipoCupon == 6 && this.selectCountTimes == '2') {
      if(!this.cuponOmni.nroCuponAGenerar && this.cuponOmni.nroCuponAGenerar == 0){ console.error('Ingresar el numero de Cupon a Generar Mayor a 1'); validation = false;}
      if(!this.cuponOmni.nroUso && this.cuponOmni.nroUso <= 0 ){ console.error('Ingresar el numero de Cupon a Generar Mayor a 1'); validation = false;}
      if(!this.cuponOmni.codigo && this.cuponOmni.codigo == "" ){ console.error('Ingresar el numero de Cupon a Generar Mayor a 1'); validation = false;}
      if(!this.cuponOmni.compraMin && this.cuponOmni.compraMin == 0 && this.cuponOmni.activoCompraMin == 1){ console.error('Ingresar el numero de Cupon a Generar Mayor a 1'); validation = false;}
      
      if(!this.cuponOmni.montoMax && this.cuponOmni.montoMax == 0 ){ console.error('Ingresar el numero de Cupon a Generar Mayor a 1'); validation = false;}
      if(!this.cuponOmni.percentdsct && this.cuponOmni.percentdsct == 0 ){ console.error('Ingresar el numero de Cupon a Generar Mayor a 1'); validation = false;}      
      if(this.cuponOmni.percentdsct > 100){ console.error('Monto debe ser menor a 100'); validation = false;}
    }       

    var ruta = `${this.urlLista}/ValidaCupones?Nombre=`+this.cuponOmni.nombreCampanha
    this.ajaxQueryPostSQL1(ruta)

    if(this.Cantidad > 0){ 
      console.log("Ya existe una campaña con este nombre"); 
      validation = false;
    }
    
    if(validation){      
      var tipo = parseInt(this.selectCountTimes);
      var EXternoV: number;
      if (this.Exento == 'Exento') {
        EXternoV = 1;
      } else {
        EXternoV = 0;
      }
      this.spinner.hide();
      var fecinicio, fecfin, fecRegistro;
      var fecactual = new Date;
        fecinicio = this.cuponOmni.fecInicio.getFullYear() + "-" + (this.cuponOmni.fecInicio.getMonth()+1).toString().padStart(2, '0') + "-" + (this.cuponOmni.fecInicio.getDate()).toString().padStart(2, '0') + " " + this.cuponOmni.fecInicio.getHours().toString().padStart(2, '0') + ":" + this.cuponOmni.fecInicio.getMinutes().toString().padStart(2, '0') + ":" + this.cuponOmni.fecInicio.getSeconds().toString().padStart(2, '0');
        fecfin = this.cuponOmni.fecFin.getFullYear() + "-" + (this.cuponOmni.fecFin.getMonth()+1).toString().padStart(2, '0') + "-" + (this.cuponOmni.fecFin.getDate()).toString().padStart(2, '0') + " " + this.cuponOmni.fecFin.getHours().toString().padStart(2, '0') + ":" + this.cuponOmni.fecFin.getMinutes().toString().padStart(2, '0') + ":" + this.cuponOmni.fecFin.getSeconds().toString().padStart(2, '0');
        fecRegistro = fecactual.getFullYear() + "-" + (fecactual.getMonth()+1).toString().padStart(2, '0') + "-" + (fecactual.getDate()).toString().padStart(2, '0') + " " + fecactual.getHours().toString().padStart(2, '0') + ":" + fecactual.getMinutes().toString().padStart(2, '0') + ":" + fecactual.getSeconds().toString().padStart(2, '0');
      
      if (this.callVal == 'carta-call') {
        this.CartaFinaltipos.push({canal:1,producto:"",cantidad:1});
      }
      if (this.webVal == 'carta-web') {
        this.CartaFinaltipos.push({canal:2,producto:"",cantidad:1});
      }
      if (this.salonVal == 'carta-salon') {
        this.CartaFinaltipos.push({canal:0,producto:"",cantidad:1});
      }
      
      if (this.selectionTypeCupon == '1' && tipo == 1) {
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
          canalDetalle:this.CartaFinal
        }
      }
  
      else if (this.selectionTypeCupon == '1' && tipo == 2) {
        
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
          canalDetalle:this.CartaFinal
        }
      }
  
      else if (this.selectionTypeCupon == '2' && tipo == 1) {
        console.log(this.productosCartaConsolidado);
        this.cuponOmni2 = {
          nombreCampanha: this.cuponOmni.nombreCampanha.toUpperCase(),          
          activoCompraMin: 1,
          codMarca:  this.empresaService.getEmpresaSeleccionada().idEmpresa.toString(),
          monto: this.cuponOmni.percentdsct,
          idTipoCupon:this.cuponOmni.tipoCupon,
          usuarioReg:this.getUsuario(),
          fecInicio:fecinicio,
          fecFin: fecfin,
          nroUso: 1,
          nroCuponAGenerar: this.cuponOmni.nroCuponAGenerar,
          montoMax:this.cuponOmni.montoMax,
          anulado:0,
          compraMin:this.cuponOmni.compraMin,
          estado:0,
          cantidadProductUso:1,
          validaDelivery:EXternoV,
          fecReg:fecRegistro,
          fecActualizacion:'',
          usuarioActualizacion:'',
          cantidadRedimido:0,
          alianza: this.cuponOmni.alianza.toUpperCase(),
          canalDetalle:this.CartaFinal
        }
      }
  
      else if (this.selectionTypeCupon == '2' && tipo == 2) { 
        this.cuponOmni2 = {
          nombreCampanha: this.cuponOmni.nombreCampanha.toUpperCase(),
          nombreCupon:this.cuponOmni.codigo.toUpperCase(),
          activoCompraMin: 1,
          codMarca:  this.empresaService.getEmpresaSeleccionada().idEmpresa.toString(),
          monto: this.cuponOmni.percentdsct,
          idTipoCupon:this.cuponOmni.tipoCupon,
          usuarioReg:this.getUsuario(),
          fecInicio:fecinicio,
          fecFin: fecfin,
          nroUso: this.cuponOmni.nroUso,
          montoMax:this.cuponOmni.montoMax,
          anulado:0,
          compraMin:this.cuponOmni.compraMin,
          estado:0,
          cantidadProductUso:1,
          validaDelivery:EXternoV,
          fecReg:fecRegistro,
          fecActualizacion:'',
          usuarioActualizacion:'',
          cantidadRedimido:0,
          alianza: this.cuponOmni.alianza.toUpperCase(),
          canalDetalle:this.CartaFinal
        }
      }
  
      else if (this.selectionTypeCupon == '3' && tipo == 1) {
        this.cuponOmni2 = {
          nombreCampanha: this.cuponOmni.nombreCampanha.toUpperCase(),
          activoCompraMin: 1,
          codMarca:  this.empresaService.getEmpresaSeleccionada().idEmpresa.toString(),
          monto: this.cuponOmni.percentdsct,
          idTipoCupon:this.cuponOmni.tipoCupon,
          usuarioReg:this.getUsuario(),
          fecInicio:fecinicio,
          fecFin: fecfin,
          nroUso: 1,
          nroCuponAGenerar: this.cuponOmni.nroCuponAGenerar,
          montoMax:this.cuponOmni.montoMax,
          anulado:0,
          compraMin:this.cuponOmni.compraMin,
          estado:0,
          cantidadProductUso:1,
          validaDelivery:0,
          fecReg:fecRegistro,
          fecActualizacion:'',
          usuarioActualizacion:'',
          cantidadRedimido:0,
          alianza: this.cuponOmni.alianza.toUpperCase(),
          canalDetalle:this.CartaFinal
        }
      }
  
      else if (this.selectionTypeCupon == '3' && tipo == 2) {
        this.cuponOmni2 = {
          nombreCampanha: this.cuponOmni.nombreCampanha.toUpperCase(),
          nombreCupon:this.cuponOmni.codigo.toUpperCase(),
          activoCompraMin: 1,
          codMarca:  this.empresaService.getEmpresaSeleccionada().idEmpresa.toString(),
          monto: this.cuponOmni.percentdsct,
          idTipoCupon:this.cuponOmni.tipoCupon,
          usuarioReg:this.getUsuario(),
          fecInicio:fecinicio,
          fecFin: fecfin,
          nroUso: this.cuponOmni.nroUso,
          montoMax:this.cuponOmni.montoMax,
          anulado:0,
          compraMin:this.cuponOmni.compraMin,
          estado:0,
          cantidadProductUso:1,
          validaDelivery:0,
          fecReg:fecRegistro,
          fecActualizacion:'',
          usuarioActualizacion:'',
          cantidadRedimido:0,
          alianza: this.cuponOmni.alianza.toUpperCase(),
          canalDetalle:this.CartaFinal
        }
      }
  
      else if (this.selectionTypeCupon == '4' && tipo == 1) {
        this.cuponOmni2 = {
          nombreCampanha: this.cuponOmni.nombreCampanha.toUpperCase(),
          activoCompraMin: 1,
          codMarca:  this.empresaService.getEmpresaSeleccionada().idEmpresa.toString(),
          monto: this.cuponOmni.percentdsct,
          idTipoCupon:this.cuponOmni.tipoCupon,
          usuarioReg:this.getUsuario(),
          fecInicio:fecinicio,
          fecFin: fecfin,
          nroUso: 1,
          nroCuponAGenerar: this.cuponOmni.nroCuponAGenerar,
          montoMax:this.cuponOmni.montoMax,
          anulado:0,
          compraMin:this.cuponOmni.compraMin,
          estado:0,
          cantidadProductUso:1,
          validaDelivery:0,
          fecReg:fecRegistro,
          fecActualizacion:'',
          usuarioActualizacion:'',
          cantidadRedimido:0,
          alianza: this.cuponOmni.alianza.toUpperCase(),
          canalDetalle:this.CartaFinal
        }
      }
  
      else if (this.selectionTypeCupon == '4' && tipo == 2) {
        this.cuponOmni2 = {
          nombreCampanha: this.cuponOmni.nombreCampanha.toUpperCase(),
          nombreCupon:this.cuponOmni.codigo.toUpperCase(),
          activoCompraMin: 1,
          codMarca:  this.empresaService.getEmpresaSeleccionada().idEmpresa.toString(),
          monto: this.cuponOmni.percentdsct,
          idTipoCupon:this.cuponOmni.tipoCupon,
          usuarioReg:this.getUsuario(),
          fecInicio:fecinicio,
          fecFin: fecfin,
          nroUso: this.cuponOmni.nroUso,
          montoMax:this.cuponOmni.montoMax,
          anulado:0,
          compraMin:this.cuponOmni.compraMin,
          estado:0,
          cantidadProductUso:1,
          validaDelivery:0,
          fecReg:fecRegistro,
          fecActualizacion:'',
          usuarioActualizacion:'',
          cantidadRedimido:0,
          alianza: this.cuponOmni.alianza.toUpperCase(),
          canalDetalle:this.CartaFinal
        }
      }
  
      else if (this.selectionTypeCupon == '5' && tipo == 1) {
        this.cuponOmni2 = {
          nombreCampanha: this.cuponOmni.nombreCampanha.toUpperCase(),
          activoCompraMin: 1,
          codMarca:  this.empresaService.getEmpresaSeleccionada().idEmpresa.toString(),
          monto: this.cuponOmni.percentdsct,
          idTipoCupon:this.cuponOmni.tipoCupon,
          usuarioReg:this.getUsuario(),
          fecInicio:fecinicio,
          fecFin: fecfin,
          nroUso: 1,
          nroCuponAGenerar: this.cuponOmni.nroCuponAGenerar,
          anulado:0,
          montoMax:this.cuponOmni.montoMax,
          compraMin:this.cuponOmni.percentdsct,
          estado:0,
          cantidadProductUso:1,
          validaDelivery:0,
          fecReg:fecRegistro,
          fecActualizacion:'',
          usuarioActualizacion:'',
          cantidadRedimido:0,
          alianza: this.cuponOmni.alianza.toUpperCase(),
          canalDetalle:this.CartaFinaltipos
        }
      }
  
      else if (this.selectionTypeCupon == '5' && tipo == 2) {
        this.cuponOmni2 = {
          nombreCampanha: this.cuponOmni.nombreCampanha.toUpperCase(),
          nombreCupon:this.cuponOmni.codigo.toUpperCase(),
          activoCompraMin: 1,
          codMarca:  this.empresaService.getEmpresaSeleccionada().idEmpresa.toString(),
          monto: this.cuponOmni.percentdsct,
          idTipoCupon:this.cuponOmni.tipoCupon,
          usuarioReg:this.getUsuario(),
          fecInicio:fecinicio,
          fecFin: fecfin,
          nroUso: this.cuponOmni.nroUso,
          anulado:0,
          montoMax:this.cuponOmni.montoMax,
          compraMin:this.cuponOmni.percentdsct,
          estado:0,
          cantidadProductUso:1,
          validaDelivery:0,
          fecReg:fecRegistro,
          fecActualizacion:'',
          usuarioActualizacion:'',
          cantidadRedimido:0,
          alianza: this.cuponOmni.alianza.toUpperCase(),
          canalDetalle:this.CartaFinaltipos
        }
      }
  
      else if (this.selectionTypeCupon == '6' && tipo == 1) {
        this.cuponOmni2 = {
          nombreCampanha: this.cuponOmni.nombreCampanha.toUpperCase(),
          activoCompraMin: 1,
          codMarca:  this.empresaService.getEmpresaSeleccionada().idEmpresa.toString(),
          monto: this.cuponOmni.percentdsct,
          idTipoCupon:this.cuponOmni.tipoCupon,
          usuarioReg:this.getUsuario(),
          fecInicio:fecinicio,
          fecFin: fecfin,
          nroUso: 1,
          nroCuponAGenerar: this.cuponOmni.nroCuponAGenerar,
          montoMax:this.cuponOmni.montoMax,
          anulado:0,
          compraMin:this.cuponOmni.compraMin,
          estado:0,
          cantidadProductUso:1,
          validaDelivery:EXternoV,
          fecReg:fecRegistro,
          fecActualizacion:'',
          usuarioActualizacion:'',
          cantidadRedimido:0,
          alianza: this.cuponOmni.alianza.toUpperCase(),
          canalDetalle:this.CartaFinaltipos
        }
      }
  
      else if (this.selectionTypeCupon == '6' && tipo == 2) {
        this.cuponOmni2 = {
          nombreCampanha: this.cuponOmni.nombreCampanha.toUpperCase(),
          nombreCupon:this.cuponOmni.codigo.toUpperCase(),
          activoCompraMin: 1,
          codMarca:  this.empresaService.getEmpresaSeleccionada().idEmpresa.toString(),
          monto: this.cuponOmni.percentdsct,
          idTipoCupon:this.cuponOmni.tipoCupon,
          usuarioReg:this.getUsuario(),
          fecInicio:fecinicio,
          fecFin: fecfin,
          nroUso: this.cuponOmni.nroUso,
          montoMax:this.cuponOmni.montoMax,
          anulado:0,
          compraMin:this.cuponOmni.compraMin,
          estado:0,
          cantidadProductUso:1,
          validaDelivery:EXternoV,
          fecReg:fecRegistro,
          fecActualizacion:'',
          usuarioActualizacion:'',
          cantidadRedimido:0,
          alianza: this.cuponOmni.alianza.toUpperCase(),
          canalDetalle:this.CartaFinaltipos
        }
      }
      this.cuponOmni3 = {
        "codMarca": this.empresaService.getEmpresaSeleccionada().idEmpresa.toString(),
        "nombreCampanha":this.cuponOmni.nombreCampanha
      }
          
      this.ajaxQueryPost(`${this.urlEndPointOmnicanal}/generarcupon`, this.dataCupones.token, this.cuponOmni2);     
      
      this.cuponOmni4 = this.cuponOmni2;
      console.log(this.validacion);
      if (this.validacion == 'Cupon creado' || this.validacion == 'Cupon en proceso') {
        // this.ajaxQueryPostCSV(`${this.urlEndPointOmnicanal}/generatecsv`, this.dataCupones.token, this.cuponOmni3);
        var cantidad: number;
        var cantidadn: number;

        if(this.CartaFinal.length == 0){
          cantidadn = 1;
        } else {
          cantidadn = this.CartaFinal.length
        }
        
        cantidad = cantidadn * this.cuponOmni.nroCuponAGenerar;
        

        var fecinicio, fecfin;
        var web,call,salon;

        if(this.showProductsSalon == true){
          salon = 1;
        } else {
          salon = 0;
        }

        if(this.showProductsCall == true){
          call = 1;
        } else {
          call = 0;
        }

        if(this.showProductsWeb == true){
          web = 1;
        } else {
          web = 0;
        }
        
        fecinicio = this.cuponOmni.fecInicio.getFullYear() + "-" + (this.cuponOmni.fecInicio.getMonth()+1).toString().padStart(2, '0') + "-" + (this.cuponOmni.fecInicio.getDate()).toString().padStart(2, '0') + " " + this.cuponOmni.fecInicio.getHours() + ":" + this.cuponOmni.fecInicio.getMinutes() + ":" + this.cuponOmni.fecInicio.getSeconds();
        fecfin = this.cuponOmni.fecFin.getFullYear() + "-" + (this.cuponOmni.fecFin.getMonth()+1).toString().padStart(2, '0') + "-" + (this.cuponOmni.fecFin.getDate()).toString().padStart(2, '0') + " " + this.cuponOmni.fecFin.getHours() + ":" + this.cuponOmni.fecFin.getMinutes() + ":" + this.cuponOmni.fecFin.getSeconds();
        var tipo = parseInt(this.selectCountTimes);
        // cdtipo, cdcuponesgenerar, cdmaximouso, cdcodigo, cdnuevoprecio, fgMinimoCompra, cdmontoMinimo, cdmontoMaximoDescuento, cdPorcentajeDescuento, cdDescuentoDelivery, cdMontoDescuento
        var cuponesagenerar, maximouso, codigo, nuevoprecio, fgminimocompra, montominimo, montomaximodescuento, porcentajedescuento, descuentodelivery, montodescuento;
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
        }
    
        else if (this.cuponOmni.tipoCupon == 1 && tipo == 2) {
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
    
        else if (this.cuponOmni.tipoCupon == 2 && tipo == 1) {
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
        }
    
        else if (this.cuponOmni.tipoCupon == 2 && tipo == 2) { 
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
        }
    
        else if (this.cuponOmni.tipoCupon == 3 && tipo == 1) {
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
        }
    
        else if (this.cuponOmni.tipoCupon == 3 && tipo == 2) {
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
        }
    
        else if (this.cuponOmni.tipoCupon == 4 && tipo == 1) {
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
        }
    
        else if (this.cuponOmni.tipoCupon == 4 && tipo == 2) {  
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
        }
    
        else if (this.cuponOmni.tipoCupon == 5 && tipo == 1) {
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
        }
    
        else if (this.cuponOmni.tipoCupon == 5 && tipo == 2) {
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
        }
    
        else if (this.cuponOmni.tipoCupon == 6 && tipo == 1) {
          cuponesagenerar = '=' + this.cuponOmni.nroCuponAGenerar;
          nuevoprecio = '';
          fgminimocompra = '';
          montominimo = '=' + this.cuponOmni.compraMin;
          maximouso = '';
          codigo = '';
          montomaximodescuento = '=' + this.cuponOmni.montoMax;
          porcentajedescuento = '=' + this.cuponOmni.percentdsct;
          descuentodelivery = '';
          montodescuento = '';
        }
    
        else if (this.cuponOmni.tipoCupon == 6 && tipo == 2) {
          cuponesagenerar = '=' + this.cuponOmni.nroCuponAGenerar;
          nuevoprecio = '';
          fgminimocompra = '';
          montominimo = '=' + this.cuponOmni.compraMin;
          maximouso = '=' + this.cuponOmni.nroUso;
          codigo = '=' + this.cuponOmni.codigo.toUpperCase();
          montomaximodescuento = '=' + this.cuponOmni.montoMax;
          porcentajedescuento = '=' + this.cuponOmni.percentdsct;
          descuentodelivery = '';
          montodescuento = '';
        }

        var ruta = `${this.urlLista}/CrearCampanha?cdNombreCampanha=`+this.cuponOmni.nombreCampanha.toUpperCase()+`&idTipoCupon=`+this.cuponOmni.tipoCupon+`&dtFecInicio=`+fecinicio+`&dtFecFin=`+fecfin+`&cdAlianza=`+this.cuponOmni.alianza.toUpperCase()+`&cdCantidad=`+cantidad+`&idMarca=` + this.empresaService.getEmpresaSeleccionada().idEmpresa.toString()+`&Bucket`+`&Web=`+web+`&Salon=`+salon+`&Call=`+call+`&cdtipo=`+tipo +`&cdcuponesgenerar`+cuponesagenerar +`&cdmaximouso`+ maximouso +`&cdcodigo`+ codigo +`&cdnuevoprecio`+ nuevoprecio +`&fgMinimoCompra`+ fgminimocompra +`&cdmontoMinimo`+ montominimo +`&cdmontoMaximoDescuento`+ montomaximodescuento +`&cdPorcentajeDescuento`+ porcentajedescuento +`&cdDescuentoDelivery`+ descuentodelivery +`&cdMontoDescuento`+montodescuento;

        this.ajaxQueryPostsql(ruta, this.dataCupones.token);

        console.log('Cantidad detalle vista: ' + this.CartaDetalleVista.length);

          if (this.CartaDetalleVista.length > 0) {
            for (let index of this.CartaDetalleVista){
              console.log(index);
              let  carta  = index.canal;
              let  codigo  = index.producto;
              let  producto  = index.nombre;
              
              console.log(carta, codigo, producto);
  
              var rutaDetalleVista = `${this.urlLista}/CrearDetalleVista?cdNombreCampanha=`+this.cuponOmni.nombreCampanha.toUpperCase() + `&idMarca=`+ this.empresaService.getEmpresaSeleccionada().idEmpresa+ `&Carta=`+ carta+ `&nombre=`+ producto+ `&Codigo=`+ codigo
              this.ajaxQueryPostSQLDetalleVista(rutaDetalleVista);
            }  
          }
      } else {
        Swal.fire('Validar Información.', 'Sesion caducada, vuelva a iniciar sesion' , 'error');
      }
    }else{
      this.spinner.hide();
      if(this.Cantidad > 0){
        Swal.fire('Validar Información.', 'El nombre de campaña ya ha sido registrado' , 'error');
      } else {
        Swal.fire('Validar Información.', 'Error al guardar la información, validar los datos del cupón.' , 'error');
      }
    };

  }

  private formatDate(date: any): string{
    
    let date_temp = new Date(date);
    let date_final: string = '';

    if(date !== null){
      if(date.length > 0){

        let hora = date_temp.getHours();
        /* hours = hours % 12;
        hours = hours ? hours :12; */

        let minutos: any = date_temp.getMinutes();
        minutos = minutos < 10 ? '0'+ minutos : minutos;

        let segundos: any = date_temp.getSeconds();
        segundos = segundos < 10 ? '0'+ segundos : segundos;

        let strTime = hora + ":" + minutos + ":" + segundos;
        //(date_temp.getMonth()+1) + "/" + date_temp.getDate() + "/" + date_temp.getFullYear()

        let mes: any = date_temp.getMonth()+1;
        mes = mes < 10 ? '0'+ mes : mes;

        let dia : any = date_temp.getDate();
        dia = dia < 10 ? '0'+ dia : dia;

        date_final =  date_temp.getFullYear() + "-" + mes + "-" + dia + " " + strTime;
        
      }
      
    }
    
    
    return date_final;
  }

  private ajaxQueryPost(urlEndPoint: string, token: string, data: any): any {
    console.log("Entro aquiiiiiiiii");
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
         'Authorization': 'Bearer ' + token
      },
      success: (result) => {        
        this.validacion = result;
       },
      error: (error) => {
        this.validacion = error.responseText;
        this.spinner.hide();
      }
    });
  }

  private ajaxQueryPostCSV(urlEndPoint: string, token: string, data: any): any {
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
         'Authorization': 'Bearer ' + token
      },
      success: (result) => {  
        
        this.Bucket = result;
        console.log(this.Bucket);
      },
      error: (error) => {
        
        console.log(error);
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
        this.Cantidad = result
      },
      error: (error) => {        
        console.log(error);
        this.spinner.hide();
      }
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
        
      },
      error: (error) => {        
        console.log(error);
        this.spinner.hide();
      }
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
        var tipocupon: String;
        var tipoN; String;
        var tipo = parseInt(this.selectCountTimes);
        var tipocuponn = this.selectionTypeCupon;

        if (tipo == 1){
          tipoN = 'Autogenerado';
        } else{
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
          tipocupon = "Cupón descuento % al monto total";
        }
        var fecinicio, fecfin;
        fecinicio = this.cuponOmni.fecInicio.getFullYear() + "-" + (this.cuponOmni.fecInicio.getMonth()+1).toString().padStart(2, '0') + "-" + (this.cuponOmni.fecInicio.getDate()).toString().padStart(2, '0') + " " + this.cuponOmni.fecInicio.getHours() + ":" + this.cuponOmni.fecInicio.getMinutes() + ":" + this.cuponOmni.fecInicio.getSeconds();
        fecfin = this.cuponOmni.fecFin.getFullYear() + "-" + (this.cuponOmni.fecFin.getMonth()+1).toString().padStart(2, '0') + "-" + (this.cuponOmni.fecFin.getDate()).toString().padStart(2, '0') + " " + this.cuponOmni.fecFin.getHours() + ":" + this.cuponOmni.fecFin.getMinutes() + ":" + this.cuponOmni.fecFin.getSeconds();

        this.spinner.hide();
        var canales = "";
        var minimo = "";
        if(this.showProductsWeb) {
          canales += " Web "
        }

        if(this.showProductsCall) {
          canales += " Call Center "
        }

        if(this.showProductsSalon) {
          canales += " Salon "
        }

        if(this.cuponOmni.compraMin == 0 || this.cuponOmni.compraMin == undefined){
          minimo = 'No Aplica';
        } else {
          console.log(this.cuponOmni.compraMin);
          console.log(this.cuponOmni.compraMin.toString());
          minimo = this.cuponOmni.compraMin.toString();          
        }

        if (this.selectionTypeCupon == '1' && tipo == 1) {

          var sthtml ='<label style="color:cornflowerblue;">Nombre de Campaña: </label>'+ this.cuponOmni.nombreCampanha + '</br>' +
          '<label style="color:cornflowerblue;">Tipo Cupon: </label>'+ tipocupon + '</br>' +
          '<label style="color:cornflowerblue;">Fecha Inicio: </label>'+ fecinicio + '</br>' +
          '<label style="color:cornflowerblue;">Fecha Fin: </label>'+ fecfin + '</br>' +
          '<label style="color:cornflowerblue;">Tipo: </label>'+ tipoN + '</br>' +
          '<label style="color:cornflowerblue;">Cantidad de Cupones a generar: </label>'+ this.cuponOmni.nroCuponAGenerar + '</br>' +
          '<label style="color:cornflowerblue;">Nuevo precio del producto: </label>'+ this.cuponOmni.monto + '</br>' +
          '<label style="color:cornflowerblue;">Mínimo de compra: </label>'+ minimo + '</br>' +
          '<label style="color:cornflowerblue;">Canales: </label>'+canales+'</br>' +
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
        else if (this.selectionTypeCupon == '1' && tipo == 2) {

          var sthtml ='<label style="color:cornflowerblue;">Nombre de Campaña: </label>'+ this.cuponOmni.nombreCampanha + '</br>' +
          '<label style="color:cornflowerblue;">Tipo Cupon: </label>'+ tipocupon + '</br>' +
          '<label style="color:cornflowerblue;">Fecha Inicio: </label>'+ fecinicio + '</br>' +
          '<label style="color:cornflowerblue;">Fecha Fin: </label>'+ fecfin + '</br>' +
          '<label style="color:cornflowerblue;">Tipo: </label>'+ tipoN + '</br>' +
          '<label style="color:cornflowerblue;">Cantidad de Cupones a generar: </label>'+ this.cuponOmni.nroCuponAGenerar + '</br>' +
          '<label style="color:cornflowerblue;">Cantidad máxima de uso: </label>'+ this.cuponOmni.nroUso + '</br>' +
          '<label style="color:cornflowerblue;">Código de cupón: </label>'+ this.cuponOmni.codigo + '</br>' +
          '<label style="color:cornflowerblue;">Monto a pagar: </label>'+ this.cuponOmni.monto + '</br>' +
          '<label style="color:cornflowerblue;">Mínimo de compra: </label>'+ minimo + '</br>' +
          '<label style="color:cornflowerblue;">Canales: </label>'+canales+'</br>' +
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
        else if (this.selectionTypeCupon == '2' && tipo == 1) {
          var sthtml ='<label style="color:cornflowerblue;">Nombre de Campaña: </label>'+ this.cuponOmni.nombreCampanha + '</br>' +
          '<label style="color:cornflowerblue;">Tipo Cupon: </label>'+ tipocupon + '</br>' +
          '<label style="color:cornflowerblue;">Fecha Inicio: </label>'+ fecinicio + '</br>' +
          '<label style="color:cornflowerblue;">Fecha Fin: </label>'+ fecfin + '</br>' +
          '<label style="color:cornflowerblue;">Tipo: </label>'+ tipoN + '</br>' +
          '<label style="color:cornflowerblue;">Cantidad de Cupones a generar: </label>'+ this.cuponOmni.nroCuponAGenerar + '</br>' +
          '<label style="color:cornflowerblue;">Nuevo precio del producto: </label>'+ this.cuponOmni.monto + '</br>' +
          '<label style="color:cornflowerblue;">Mínimo de compra: </label>'+ minimo + '</br>' +
          '<label style="color:cornflowerblue;">Canales: </label>'+canales+'</br>' +
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
        else if (this.selectionTypeCupon == '2' && tipo == 2) { 

          var sthtml ='<label style="color:cornflowerblue;">Nombre de Campaña: </label>'+ this.cuponOmni.nombreCampanha + '</br>' +
          '<label style="color:cornflowerblue;">Tipo Cupon: </label>'+ tipocupon + '</br>' +
          '<label style="color:cornflowerblue;">Fecha Inicio: </label>'+ fecinicio + '</br>' +
          '<label style="color:cornflowerblue;">Fecha Fin: </label>'+ fecfin + '</br>' +
          '<label style="color:cornflowerblue;">Tipo: </label>'+ tipoN + '</br>' +
          '<label style="color:cornflowerblue;">Cantidad de Cupones a generar: </label>'+ this.cuponOmni.nroCuponAGenerar + '</br>' +
          '<label style="color:cornflowerblue;">Cantidad máxima de uso: </label>'+ this.cuponOmni.nroUso + '</br>' +
          '<label style="color:cornflowerblue;">Código de cupón: </label>'+ this.cuponOmni.codigo + '</br>' +
          '<label style="color:cornflowerblue;">Monto a pagar: </label>'+ this.cuponOmni.monto + '</br>' +
          '<label style="color:cornflowerblue;">Mínimo de compra: </label>'+ minimo + '</br>' +
          '<label style="color:cornflowerblue;">Canales: </label>'+canales+'</br>' +
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
        else if (this.selectionTypeCupon == '3' && tipo == 1) {
          var sthtml ='<label style="color:cornflowerblue;">Nombre de Campaña: </label>'+ this.cuponOmni.nombreCampanha + '</br>' +
          '<label style="color:cornflowerblue;">Tipo Cupon: </label>'+ tipocupon + '</br>' +
          '<label style="color:cornflowerblue;">Fecha Inicio: </label>'+ fecinicio + '</br>' +
          '<label style="color:cornflowerblue;">Fecha Fin: </label>'+ fecfin + '</br>' +
          '<label style="color:cornflowerblue;">Tipo: </label>'+ tipoN + '</br>' +
          '<label style="color:cornflowerblue;">Cantidad de Cupones a generar: </label>'+ this.cuponOmni.nroCuponAGenerar + '</br>' +
          '<label style="color:cornflowerblue;">Nuevo precio del producto: </label>'+ this.cuponOmni.monto + '</br>' +
          '<label style="color:cornflowerblue;">Mínimo de compra: </label>'+ minimo + '</br>' +
          '<label style="color:cornflowerblue;">Canales: </label>'+canales+'</br>' +
          '<label style="color:cornflowerblue;">Productos: </label></br>';
          for (let index = 0; index < this.productosCartaConsolidado.length; index++) {
            sthtml += this.productosCartaConsolidado[index].producto  + ' - ' + this.productosCartaConsolidado[index].codigo + '</br>'
          }

          Swal.fire({
            title: '<strong style="color:lightgreen;">Registro Exitoso</strong>',
            icon: 'success',
            html: sthtml,
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
        else if (this.selectionTypeCupon == '3' && tipo == 2) {
          var sthtml ='<label style="color:cornflowerblue;">Nombre de Campaña: </label>'+ this.cuponOmni.nombreCampanha + '</br>' +
          '<label style="color:cornflowerblue;">Tipo Cupon: </label>'+ tipocupon + '</br>' +
          '<label style="color:cornflowerblue;">Fecha Inicio: </label>'+ fecinicio + '</br>' +
          '<label style="color:cornflowerblue;">Fecha Fin: </label>'+ fecfin + '</br>' +
          '<label style="color:cornflowerblue;">Tipo: </label>'+ tipoN + '</br>' +
          '<label style="color:cornflowerblue;">Cantidad de Cupones a generar: </label>'+ this.cuponOmni.nroCuponAGenerar + '</br>' +
          '<label style="color:cornflowerblue;">Cantidad máxima de uso: </label>'+ this.cuponOmni.nroUso + '</br>' +
          '<label style="color:cornflowerblue;">Código de cupón: </label>'+ this.cuponOmni.codigo + '</br>' +
          '<label style="color:cornflowerblue;">Monto a pagar: </label>'+ this.cuponOmni.monto + '</br>' +
          '<label style="color:cornflowerblue;">Mínimo de compra: </label>'+ minimo + '</br>' +
          '<label style="color:cornflowerblue;">Canales: </label>'+canales+'</br>' +
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
        else if (this.selectionTypeCupon == '4' && tipo == 1) {
          var sthtml ='<label style="color:cornflowerblue;">Nombre de Campaña: </label>'+ this.cuponOmni.nombreCampanha + '</br>' +
          '<label style="color:cornflowerblue;">Tipo Cupon: </label>'+ tipocupon + '</br>' +
          '<label style="color:cornflowerblue;">Fecha Inicio: </label>'+ fecinicio + '</br>' +
          '<label style="color:cornflowerblue;">Fecha Fin: </label>'+ fecfin + '</br>' +
          '<label style="color:cornflowerblue;">Tipo: </label>'+ tipoN + '</br>' +
          '<label style="color:cornflowerblue;">Cantidad de Cupones a generar: </label>'+ this.cuponOmni.nroCuponAGenerar + '</br>' +
          '<label style="color:cornflowerblue;">Nuevo precio del producto: </label>'+ this.cuponOmni.monto + '</br>' +
          '<label style="color:cornflowerblue;">Mínimo de compra: </label>'+ minimo + '</br>' +
          '<label style="color:cornflowerblue;">Canales: </label>'+canales+'</br>' +
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
        else if (this.selectionTypeCupon == '4' && tipo == 2) {
          var sthtml ='<label style="color:cornflowerblue;">Nombre de Campaña: </label>'+ this.cuponOmni.nombreCampanha + '</br>' +
          '<label style="color:cornflowerblue;">Tipo Cupon: </label>'+ tipocupon + '</br>' +
          '<label style="color:cornflowerblue;">Fecha Inicio: </label>'+ fecinicio + '</br>' +
          '<label style="color:cornflowerblue;">Fecha Fin: </label>'+ fecfin + '</br>' +
          '<label style="color:cornflowerblue;">Tipo: </label>'+ tipoN + '</br>' +
          '<label style="color:cornflowerblue;">Cantidad de Cupones a generar: </label>'+ this.cuponOmni.nroCuponAGenerar + '</br>' +
          '<label style="color:cornflowerblue;">Cantidad máxima de uso: </label>'+ this.cuponOmni.nroUso + '</br>' +
          '<label style="color:cornflowerblue;">Código de cupón: </label>'+ this.cuponOmni.codigo + '</br>' +
          '<label style="color:cornflowerblue;">Monto a pagar: </label>'+ this.cuponOmni.monto + '</br>' +
          '<label style="color:cornflowerblue;">Mínimo de compra: </label>'+ minimo + '</br>' +
          '<label style="color:cornflowerblue;">Canales: </label>'+canales+'</br>' +
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
        else if (this.selectionTypeCupon == '5' && tipo == 1) {
          var sthtml ='<label style="color:cornflowerblue;">Nombre de Campaña: </label>'+ this.cuponOmni.nombreCampanha + '</br>' +
          '<label style="color:cornflowerblue;">Tipo Cupon: </label>'+ tipocupon + '</br>' +
          '<label style="color:cornflowerblue;">Fecha Inicio: </label>'+ fecinicio + '</br>' +
          '<label style="color:cornflowerblue;">Fecha Fin: </label>'+ fecfin + '</br>' +
          '<label style="color:cornflowerblue;">Tipo: </label>'+ tipoN + '</br>' +
          '<label style="color:cornflowerblue;">Cantidad de Cupones a generar: </label>'+ this.cuponOmni.nroCuponAGenerar + '</br>' +
          '<label style="color:cornflowerblue;">Nuevo precio del producto: </label>'+ this.cuponOmni.monto + '</br>' +
          '<label style="color:cornflowerblue;">Mínimo de compra: </label>'+ minimo + '</br>' +
          '<label style="color:cornflowerblue;">Canales: </label>'+canales+'</br>' +
          '<label style="color:cornflowerblue;">Productos: </label></br>';

          Swal.fire({
            title: '<strong style="color:lightgreen;">Registro Exitoso</strong>',
            icon: 'success',
            html: sthtml,
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
        else if (this.selectionTypeCupon == '5' && tipo == 2) {
          var sthtml ='<label style="color:cornflowerblue;">Nombre de Campaña: </label>'+ this.cuponOmni.nombreCampanha + '</br>' +
          '<label style="color:cornflowerblue;">Tipo Cupon: </label>'+ tipocupon + '</br>' +
          '<label style="color:cornflowerblue;">Fecha Inicio: </label>'+ fecinicio + '</br>' +
          '<label style="color:cornflowerblue;">Fecha Fin: </label>'+ fecfin + '</br>' +
          '<label style="color:cornflowerblue;">Tipo: </label>'+ tipoN + '</br>' +
          '<label style="color:cornflowerblue;">Cantidad de Cupones a generar: </label>'+ this.cuponOmni.nroCuponAGenerar + '</br>' +
          '<label style="color:cornflowerblue;">Cantidad máxima de uso: </label>'+ this.cuponOmni.nroUso + '</br>' +
          '<label style="color:cornflowerblue;">Código de cupón: </label>'+ this.cuponOmni.codigo + '</br>' +
          '<label style="color:cornflowerblue;">Monto a pagar: </label>'+ this.cuponOmni.monto + '</br>' +
          '<label style="color:cornflowerblue;">Mínimo de compra: </label>'+ minimo + '</br>' +
          '<label style="color:cornflowerblue;">Canales: </label>'+canales+'</br>' +
          '<label style="color:cornflowerblue;">Productos: </label></br>';
          
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
        else if (this.selectionTypeCupon == '6' && tipo == 1) {
          var sthtml ='<label style="color:cornflowerblue;">Nombre de Campaña: </label>'+ this.cuponOmni.nombreCampanha + '</br>' +
          '<label style="color:cornflowerblue;">Tipo Cupon: </label>'+ tipocupon + '</br>' +
          '<label style="color:cornflowerblue;">Fecha Inicio: </label>'+ fecinicio + '</br>' +
          '<label style="color:cornflowerblue;">Fecha Fin: </label>'+ fecfin + '</br>' +
          '<label style="color:cornflowerblue;">Tipo: </label>'+ tipoN + '</br>' +
          '<label style="color:cornflowerblue;">Cantidad de Cupones a generar: </label>'+ this.cuponOmni.nroCuponAGenerar + '</br>' +
          '<label style="color:cornflowerblue;">Nuevo precio del producto: </label>'+ this.cuponOmni.monto + '</br>' +
          '<label style="color:cornflowerblue;">Mínimo de compra: </label>'+ minimo + '</br>' +
          '<label style="color:cornflowerblue;">Canales: </label>'+canales+'</br>' +
          '<label style="color:cornflowerblue;">Productos: </label></br>';

          Swal.fire({
            title: '<strong style="color:lightgreen;">Registro Exitoso</strong>',
            icon: 'success',
            html: sthtml,
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
        else if (this.selectionTypeCupon == '6' && tipo == 2) {
          var sthtml ='<label style="color:cornflowerblue;">Nombre de Campaña: </label>'+ this.cuponOmni.nombreCampanha + '</br>' +
          '<label style="color:cornflowerblue;">Tipo Cupon: </label>'+ tipocupon + '</br>' +
          '<label style="color:cornflowerblue;">Fecha Inicio: </label>'+ fecinicio + '</br>' +
          '<label style="color:cornflowerblue;">Fecha Fin: </label>'+ fecfin + '</br>' +
          '<label style="color:cornflowerblue;">Tipo: </label>'+ tipoN + '</br>' +
          '<label style="color:cornflowerblue;">Cantidad de Cupones a generar: </label>'+ this.cuponOmni.nroCuponAGenerar + '</br>' +
          '<label style="color:cornflowerblue;">Cantidad máxima de uso: </label>'+ this.cuponOmni.nroUso + '</br>' +
          '<label style="color:cornflowerblue;">Código de cupón: </label>'+ this.cuponOmni.codigo + '</br>' +
          '<label style="color:cornflowerblue;">Monto a pagar: </label>'+ this.cuponOmni.monto + '</br>' +
          '<label style="color:cornflowerblue;">Mínimo de compra: </label>'+ minimo + '</br>' +
          '<label style="color:cornflowerblue;">Canales: </label>'+canales+'</br>' +
          '<label style="color:cornflowerblue;">Productos: </label></br>';                  
          
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
        Swal.fire(
          'Ocurrio un accidente',
          'Comunicate con sistemas: ' + error,
          'info'
        )
        console.log(error);
        this.spinner.hide();
      }
    });
  }

  public parseTwoDecimal(monto, nameAtribute){
    let newMonto = monto.toFixed(2);
    this.cuponOmni[nameAtribute] = newMonto;
  }
}
