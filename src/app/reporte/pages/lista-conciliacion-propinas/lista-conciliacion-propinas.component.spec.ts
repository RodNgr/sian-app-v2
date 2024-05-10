import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaConciliacionPropinasComponent } from './lista-conciliacion-propinas.component';

describe('ListaConciliacionPropinasComponent', () => {
  let component: ListaConciliacionPropinasComponent;
  let fixture: ComponentFixture<ListaConciliacionPropinasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaConciliacionPropinasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaConciliacionPropinasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
