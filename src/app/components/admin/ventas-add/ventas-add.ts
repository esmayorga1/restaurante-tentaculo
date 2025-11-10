import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { ProductsService } from '../../../services/products-service';
import { VentasService } from '../../../services/ventas-service';

@Component({
  selector: 'app-ventas-add',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ventas-add.html',
  styleUrls: ['./ventas-add.css'],
})
export class VentasAdd {
  @Output() close = new EventEmitter<void>();

  isOpen: boolean = false;
  products: any[] = [];

  venta = {
    productId: '',
    quantity: 0,
    total: 0,
    date: '',
  };

  constructor(
    private ventasService: VentasService,
    private productService: ProductsService
  ) {}

  // ===================== Abrir / Cerrar modal =====================
  open() {
    this.isOpen = true;
    this.loadProducts();
    this.resetForm();
  }

  closeModal() {
    this.isOpen = false;
    this.close.emit();
  }

  // ===================== Cargar productos =====================
  loadProducts() {
    this.productService.getProducts1().subscribe((products) => {
      this.products = products;
    });
  }

  // ===================== Calcular total dinámico =====================
  updateTotal() {
    const product = this.products.find((p) => p.id === this.venta.productId);
    if (product) {
      this.venta.total = product.salePrice * this.venta.quantity;
    } else {
      this.venta.total = 0;
    }
  }

  // ===================== Registrar venta (sin confirmación) =====================
  addVenta() {
    if (!this.venta.productId || this.venta.quantity <= 0) {
      Swal.fire('Error', 'Por favor selecciona un producto y una cantidad válida.', 'error');
      return;
    }

    const product = this.products.find((p) => p.id === this.venta.productId);
    if (!product) {
      Swal.fire('Error', 'No se encontró el producto seleccionado.', 'error');
      return;
    }

    if (product.stockQuantity < this.venta.quantity) {
      Swal.fire('Stock insuficiente', 'No hay suficiente inventario para esta venta.', 'warning');
      return;
    }

    const newStock = product.stockQuantity - this.venta.quantity;
    const ventaData = {
      productId: this.venta.productId,
      quantity: this.venta.quantity,
      total: this.venta.total,
      date: new Date().toISOString().split('T')[0],
    };

    this.productService
      .updateProduct(this.venta.productId, { stockQuantity: newStock })
      .then(() => this.ventasService.addVenta(ventaData))
      .then(() => {
        Swal.fire('Venta registrada', 'La venta ha sido registrada exitosamente.', 'success');
        this.closeModal();
      })
      .catch((error) => {
        console.error('Error al registrar la venta:', error);
        Swal.fire('Error', 'No se pudo registrar la venta.', 'error');
      });
  }

  resetForm() {
    this.venta = {
      productId: '',
      quantity: 0,
      total: 0,
      date: '',
    };
  }
}
