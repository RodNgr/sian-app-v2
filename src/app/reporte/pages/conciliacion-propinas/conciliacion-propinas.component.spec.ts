import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConciliacionPropinasComponent } from './conciliacion-propinas.component';

describe('ConciliacionPropinasComponent', () => {
  let component: ConciliacionPropinasComponent;
  let fixture: ComponentFixture<ConciliacionPropinasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConciliacionPropinasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConciliacionPropinasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
