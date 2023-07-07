import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CambioCuentaComponent } from './cambio-cuenta.component';

describe('CambioCuentaComponent', () => {
  let component: CambioCuentaComponent;
  let fixture: ComponentFixture<CambioCuentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CambioCuentaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CambioCuentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
