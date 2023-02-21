import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Router } from '@angular/router';

interface ProductoPrueba {

  carta: string;
  codigo: string;
  nombre: string;
  detalle: string;


}

@Component({
  selector: 'app-registra-cantidad-prod',
  templateUrl: './registra-cantidad-prod.component.html',
  styleUrls: ['./registra-cantidad-prod.component.css']
})
export class RegistraCantidadProdComponent implements OnInit {

  public nameProduct: string = '';

  public listProductSelect: ProductoPrueba[] = [];

  constructor(private router: Router,public ref: DynamicDialogRef,
    public config: DynamicDialogConfig) { }

  ngOnInit(): void {
    this.nameProduct = this.config.data.nombre;
    const listProduct = JSON.parse(sessionStorage.getItem('listaProductosSeleccionados'))
    if(listProduct!=null){
      this.listProductSelect = listProduct;
    }else{
      sessionStorage.setItem("listaProductosSeleccionados", JSON.stringify(this.listProductSelect));
    }
    

  }

  addProductTablePreview() {
    const pro = this.config.data;
    this.listProductSelect.push(pro);
    // sessionStorage.setItem("listaProductosSeleccionados", JSON.stringify(this.listProductSelect))
    this.router.navigateByUrl('/home/cupon/cupon-omnicanal');
    this.ref.close(this.listProductSelect);
   
  }

  public cancelar(): void {
    this.ref.close();
    this.router.navigateByUrl('/home/cupon/cupon-omnicanal');
  }
  
}
