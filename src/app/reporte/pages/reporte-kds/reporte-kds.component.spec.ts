import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteKdsComponent } from './reporte-kds.component';

describe('ReporteKdsComponent', () => {
  let component: ReporteKdsComponent;
  let fixture: ComponentFixture<ReporteKdsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteKdsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteKdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
