import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../../../services/products-service';
import Swal from 'sweetalert2'; // ✅ Importar Swal

@Component({
  selector: 'app-products-add',
  imports: [CommonModule, FormsModule],
  templateUrl: './products-add.html',
  styleUrl: './products-add.css',
})
export class ProductsAdd {
  product = {
    id: '',
    name: '',
    purchasePrice: 0,
    salePrice: 0,
    stockQuantity: 0,
    category: '',
    brand: '',
    supplier: '',
    description: '',
    imageUrl: '',
  };

  categories: any;
  isOpen = false;

  constructor(private productService: ProductsService) {}

  // =============Añadir Producto======================
  addProduct() {
    // Verificar que todos los campos requeridos estén completos
    if (
      this.product.name &&
      this.product.purchasePrice &&
      this.product.salePrice &&
      this.product.brand &&
      this.product.supplier &&
      this.product.stockQuantity &&
      this.product.category
    ) {
      // Llamar al servicio para agregar el producto
      this.productService
        .addProduct(this.product)
        .then(() => {
          // ✅ Mostrar SweetAlert
          Swal.fire({
            icon: 'success',
            title: 'Producto agregado',
            text: 'El producto se ha agregado correctamente',
            confirmButtonText: 'OK'
          });

          // Limpiar el formulario
          this.resetForm();
        })
        .catch((error: any) => {
          console.error('Error al agregar el producto:', error);
          // Opcional: mostrar alerta de error
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo agregar el producto',
            confirmButtonText: 'OK'
          });
        });
    } else {
      console.log('Por favor, complete todos los campos');
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor, complete todos los campos obligatorios',
        confirmButtonText: 'OK'
      });
    }
  }

  // =============Restablecer el formulario======================
  resetForm() {
    this.product = {
      id: '',
      name: '',
      purchasePrice: 0,
      salePrice: 0,
      stockQuantity: 0,
      category: '',
      brand: '',
      supplier: '',
      description: '',
      imageUrl: '',
    };
  }

  // =============Abrir modal======================
  open() {
    this.isOpen = true;
  }

  // =============Cerrar modal======================
  close() {
    this.isOpen = false;
  }
}
