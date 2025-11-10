import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentasAdd } from './ventas-add';

describe('VentasAdd', () => {
  let component: VentasAdd;
  let fixture: ComponentFixture<VentasAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VentasAdd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VentasAdd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
