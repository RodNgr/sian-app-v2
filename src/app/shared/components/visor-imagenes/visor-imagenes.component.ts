import { Component, OnInit } from '@angular/core';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-visor-imagenes',
  templateUrl: './visor-imagenes.component.html',
  styleUrls: ['./visor-imagenes.component.css']
})
export class VisorImagenesComponent implements OnInit {

  public url!: string;

  constructor(public ref: DynamicDialogRef, 
              public config: DynamicDialogConfig) { }

  ngOnInit(): void {
    this.url = this.config.data;
  }

}
