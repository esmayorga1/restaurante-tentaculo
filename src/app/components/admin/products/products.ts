import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { ProductsAdd } from '../products-add/products-add';
import { ProductsEdit } from '../products-edit/products-edit';
import { ProductsService } from '../../../services/products-service';

@Component({
  selector: 'app-products',
  imports: [CommonModule, FormsModule, ProductsAdd, ProductsEdit],
  templateUrl: './products.html',
  styleUrls: ['./products.css']
})
export class Products implements AfterViewInit {
  @ViewChild(ProductsAdd) modalComponent!: ProductsAdd;
  @ViewChild(ProductsEdit) editModalComponent!: ProductsEdit;

  searchTerm: string = '';
  selectedCategory: string = '';
  products: any[] = [];
  categories: string[] = [];
  selectedProduct: any;

  constructor(private productService: ProductsService) {}

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
  }

  ngAfterViewInit() {
    console.log(this.modalComponent, this.editModalComponent);
  }

  loadProducts() {
    this.productService.getProducts1().subscribe(products => {
      this.products = products; // ya vienen con id y demás campos
    });
  }

  loadCategories() {
    this.productService.getCategories().subscribe((products) => {
      const allCategories = products.map((p: any) => p.category);
      this.categories = [...new Set(allCategories)];
    });
  }

  filteredProducts() {
    return this.products.filter((product) => {
      const matchesSearch = product.name?.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCategory = this.selectedCategory ? product.category === this.selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
  }

  editProduct(product: any) {
    this.selectedProduct = product;
    this.editModalComponent.product = { ...product };
    this.editModalComponent.open();

    this.editModalComponent.close = () => {
      this.loadProducts();
      this.editModalComponent.isOpen = false;
    };
  }

  deleteProduct(productId: string) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.deleteProduct(productId)
          .then(() => {
            this.loadProducts();
            Swal.fire('Eliminado', 'El producto ha sido eliminado.', 'success');
          })
          .catch(error => {
            console.error(error);
            Swal.fire('Error', 'No se pudo eliminar el producto.', 'error');
          });
      }
    });
  }

  openAddProductModal() {
    this.modalComponent?.open();
  }

  openEditProductModal() {
    this.editModalComponent?.open();
  }
}
