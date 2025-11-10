import { Component, Input, OnInit } from '@angular/core';
import { ProductsService } from '../../../services/products-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { VentasService } from '../../../services/ventas-service';

@Component({
  selector: 'app-ventas-edit',
  imports: [CommonModule, FormsModule],
  templateUrl: './ventas-edit.html',
  styleUrl: './ventas-edit.css',
})
export class VentasEdit implements OnInit {

  ventas = {
    id: '',
    date: '',           // Fecha de venta
    productId: '',      // ID del producto
    quantity: 0,        // Cantidad vendida
    total: 0            // Total de la venta
  };

  @Input() selectedVentas: any;
  categories: any[] = []; // Lista de productos
  isOpen = false;

  constructor(
    private ventasService: VentasService,
    private productService: ProductsService
  ) {}

  ngOnInit() {
    // Cargar productos disponibles
    this.productService.getProducts1().subscribe(products => {
      this.categories = products.map(product => ({
        id: product.id,
        name: product['data']?.name || product.name || 'Sin nombre'
      }));
    });
  }

  // ===========================
  // 🚀 Función principal de edición (versión async/await)
  // ===========================
  async editProduct() {
    if (this.ventas && this.ventas.id) {
      try {
        // 🔹 Obtener el producto actual desde Firestore
        const product: any = await this.productService.getProductById(this.ventas.productId);

        if (product && product.stockQuantity !== undefined) {
          const stockActual = product.stockQuantity;
          const cantidadVendidaNueva = this.ventas.quantity;
          const cantidadVendidaOriginal = this.selectedVentas.quantity;

          console.log('📦 Stock actual:', stockActual);
          console.log('Cantidad original:', cantidadVendidaOriginal);
          console.log('Cantidad nueva:', cantidadVendidaNueva);

          // 🔹 Calcular nuevo stock
          const diferencia = cantidadVendidaNueva - cantidadVendidaOriginal;
          const nuevoStock = stockActual - diferencia;

          console.log('Diferencia:', diferencia);
          console.log('Nuevo stock:', nuevoStock);

          // 🔹 Actualizar el stock del producto
          await this.productService.updateProductStock(this.ventas.productId, nuevoStock);
          console.log('✅ Stock actualizado correctamente');

          // 🔹 Actualizar la venta
          await this.ventasService.updateVentas(this.ventas.id, this.ventas);
          console.log('✅ Venta actualizada correctamente');

          // 🔹 Cerrar el modal
          this.close();

        } else {
          console.error('❌ No se pudo recuperar el stock del producto');
        }

      } catch (error) {
        console.error('❌ Error al editar la venta:', error);
      }
    }
  }

  // ===========================
  // 🪟 Abrir el modal y cargar los datos
  // ===========================
  open() {
    this.isOpen = true;
    if (this.selectedVentas) {
      this.ventas = { ...this.selectedVentas };
    }
  }

  // ===========================
  // ❌ Cerrar el modal y limpiar formulario
  // ===========================
  close() {
    this.isOpen = false;
    this.ventas = {
      id: '',
      date: '',
      productId: '',
      quantity: 0,
      total: 0
    };
  }
}
