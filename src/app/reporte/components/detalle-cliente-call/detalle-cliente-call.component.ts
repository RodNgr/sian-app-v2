import { Component, Input, OnInit } from '@angular/core';
import { ClientCall } from '../../entity/client-call';

@Component({
  selector: 'app-detalle-cliente-call',
  templateUrl: './detalle-cliente-call.component.html',
  styleUrls: ['./detalle-cliente-call.component.css']
})
export class DetalleClienteCallComponent implements OnInit {

  @Input() cliente!: ClientCall;

  constructor() { }

  ngOnInit(): void {
    
  }

}
