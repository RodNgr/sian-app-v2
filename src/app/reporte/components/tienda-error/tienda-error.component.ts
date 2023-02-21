import { Component, Input, OnInit } from '@angular/core';
import { TiendaDto } from '../../dto/tienda-dto';

@Component({
  selector: 'app-tienda-error',
  templateUrl: './tienda-error.component.html',
  styleUrls: ['./tienda-error.component.css']
})
export class TiendaErrorComponent implements OnInit {

  @Input() tiendaErrorList: TiendaDto[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
