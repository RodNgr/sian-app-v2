import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuadraturaAgregadorDidiComponent } from './cuadratura-agregador-didi.component';

describe('CuadraturaAgregadorDidiComponent', () => {
  let component: CuadraturaAgregadorDidiComponent;
  let fixture: ComponentFixture<CuadraturaAgregadorDidiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CuadraturaAgregadorDidiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CuadraturaAgregadorDidiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
