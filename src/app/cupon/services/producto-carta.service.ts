import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { OmnicanalDto } from '../dto/omnicalanal-dto';
import { CartaOmnicanal } from '../entity/cartaOmnicanal';
import { environment } from 'src/environments/environment';
import { ProductoCarta } from '../entity/producto-carta';
interface ProductSelect {


  carta: string,
  nombre: string,
  codigo: string,
  detalle: string,
  cantidad: number

  menu: string;
  producto: string;

}

@Injectable({
  providedIn: 'root'
})
export class ProductoCartaService {
  newProductSelect: ProductSelect[] = [];
  urlWeb: string = "assets/datapruebaWeb.json";
  urlCallCenter: string = "assets/datapruebaCallCenter.json";
  urlCartaSalon: string = "assets/datapruebaCartaSalon.json";

  //url:string ="assets/dataprueba.json";
  private urlEndPoint: string;

  constructor(private http: HttpClient) { 
    this.urlEndPoint = environment.urlCarta;
  }

  getDataCartaxTipo(dto: OmnicanalDto): Observable<ProductoCarta[]> {
    return this.http.post<ProductoCarta[]>(`${this.urlEndPoint}/getDataCartaxTipo`, dto);
  }
  /*
  getDataCartaWeb() {
    //this.webservice(marca,canal)
    return this.http.get(this.urlWeb)
  }
  getDataCartaCallCenter() {
    return this.http.get(this.urlCallCenter)
  }
  getDataCartaSalon() {
    return this.http.get(this.urlCartaSalon)
  }
  */


  addProductTableSelect(product) {
    this.newProductSelect.push(product)
  }

  updateProductTableSelect(product){
    this.newProductSelect.forEach( cup => {
      if( (cup.carta === product.carta) && (cup.codigo === product.codigo) ){
        cup.cantidad = product.cantidad;
      }
    });
  }

  getDataProductSelect(){
    return this.newProductSelect
  }

}
