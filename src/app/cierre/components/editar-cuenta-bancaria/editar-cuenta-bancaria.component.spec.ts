import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarCuentaBancariaComponent } from './editar-cuenta-bancaria.component';

describe('EditarCuentaBancariaComponent', () => {
  let component: EditarCuentaBancariaComponent;
  let fixture: ComponentFixture<EditarCuentaBancariaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarCuentaBancariaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarCuentaBancariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
