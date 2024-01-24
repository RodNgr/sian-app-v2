import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnularPedidosHubComponent } from './anular-pedidos-hub.component';

describe('AnularPedidosHubComponent', () => {
  let component: AnularPedidosHubComponent;
  let fixture: ComponentFixture<AnularPedidosHubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnularPedidosHubComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnularPedidosHubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
