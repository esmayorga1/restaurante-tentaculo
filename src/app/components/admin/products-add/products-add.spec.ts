import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsAdd } from './products-add';

describe('ProductsAdd', () => {
  let component: ProductsAdd;
  let fixture: ComponentFixture<ProductsAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsAdd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsAdd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
