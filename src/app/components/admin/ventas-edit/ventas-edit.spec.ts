import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentasEdit } from './ventas-edit';

describe('VentasEdit', () => {
  let component: VentasEdit;
  let fixture: ComponentFixture<VentasEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VentasEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VentasEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
