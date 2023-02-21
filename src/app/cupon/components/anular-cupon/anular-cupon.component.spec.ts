import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnularCuponComponent } from './anular-cupon.component';

describe('AnularCuponComponent', () => {
  let component: AnularCuponComponent;
  let fixture: ComponentFixture<AnularCuponComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnularCuponComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnularCuponComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
