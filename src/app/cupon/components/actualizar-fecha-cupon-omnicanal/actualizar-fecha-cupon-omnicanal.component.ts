import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-actualizar-fecha-cupon-omnicanal',
  templateUrl: './actualizar-fecha-cupon-omnicanal.component.html',
  styleUrls: ['./actualizar-fecha-cupon-omnicanal.component.css']
})
export class ActualizarFechaCuponOmnicanalComponent implements OnInit {

  constructor(public ref: DynamicDialogRef, 
    public config: DynamicDialogConfig) { }

  ngOnInit(): void {
  }

}
