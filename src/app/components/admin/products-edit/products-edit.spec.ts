import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsEdit } from './products-edit';

describe('ProductsEdit', () => {
  let component: ProductsEdit;
  let fixture: ComponentFixture<ProductsEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
