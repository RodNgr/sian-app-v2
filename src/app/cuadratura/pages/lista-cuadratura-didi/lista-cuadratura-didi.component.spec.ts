import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaCuadraturaDidiComponent } from './lista-cuadratura-didi.component';

describe('ListaCuadraturaDidiComponent', () => {
  let component: ListaCuadraturaDidiComponent;
  let fixture: ComponentFixture<ListaCuadraturaDidiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaCuadraturaDidiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaCuadraturaDidiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
