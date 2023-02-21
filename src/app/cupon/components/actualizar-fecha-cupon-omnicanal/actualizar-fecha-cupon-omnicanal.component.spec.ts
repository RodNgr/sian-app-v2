import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizarFechaCuponOmnicanalComponent } from './actualizar-fecha-cupon-omnicanal.component';

describe('ActualizarFechaCuponOmnicanalComponent', () => {
  let component: ActualizarFechaCuponOmnicanalComponent;
  let fixture: ComponentFixture<ActualizarFechaCuponOmnicanalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActualizarFechaCuponOmnicanalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActualizarFechaCuponOmnicanalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
