import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuadraturaAgregadorPeyaComponent } from './cuadratura-agregador-peya.component';

describe('CuadraturaAgregadorPeyaComponent', () => {
  let component: CuadraturaAgregadorPeyaComponent;
  let fixture: ComponentFixture<CuadraturaAgregadorPeyaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CuadraturaAgregadorPeyaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CuadraturaAgregadorPeyaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
