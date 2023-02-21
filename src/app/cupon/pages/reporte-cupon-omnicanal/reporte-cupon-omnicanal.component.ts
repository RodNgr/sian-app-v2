import { Component, OnInit } from '@angular/core';
import { CuponesOmnicanalService } from '../../services/cupones-omnicanal.service';
import { CuponOmnicanal } from '../../entity/cuponOmnicanal';




@Component({
  selector: 'app-reporte-cupon-omnicanal',
  templateUrl: './reporte-cupon-omnicanal.component.html',
  styleUrls: ['./reporte-cupon-omnicanal.component.css']
})
export class ReporteCuponOmnicanalComponent implements OnInit {

  public cuponesGenerados: CuponOmnicanal[] = [];


  constructor(private cuponesgenerados_service: CuponesOmnicanalService) { }

  ngOnInit(): void {
    this.getCuponesGenerados();
  }

  public getCuponesGenerados() {
    this.cuponesgenerados_service.getDataCupones().subscribe((data: any) => {
      this.cuponesGenerados = data;
     
    })
  }

}
