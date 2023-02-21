import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaCuadraturaVisaComponent } from './lista-cuadratura-visa.component';

describe('ListaCuadraturaVisaComponent', () => {
  let component: ListaCuadraturaVisaComponent;
  let fixture: ComponentFixture<ListaCuadraturaVisaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaCuadraturaVisaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaCuadraturaVisaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
