import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarAperturaTiendaComponent } from './editar-apertura-tienda.component';

describe('EditarAperturaTiendaComponent', () => {
  let component: EditarAperturaTiendaComponent;
  let fixture: ComponentFixture<EditarAperturaTiendaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarAperturaTiendaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarAperturaTiendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
