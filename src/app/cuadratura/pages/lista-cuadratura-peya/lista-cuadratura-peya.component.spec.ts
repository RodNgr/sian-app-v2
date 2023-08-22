import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaCuadraturaPeyaComponent } from './lista-cuadratura-peya.component';

describe('ListaCuadraturaPeyaComponent', () => {
  let component: ListaCuadraturaPeyaComponent;
  let fixture: ComponentFixture<ListaCuadraturaPeyaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaCuadraturaPeyaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaCuadraturaPeyaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
