import { CommonModule } from '@angular/common';
import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2'; // ✅ Alertas elegantes
import { VentasAdd } from '../ventas-add/ventas-add';
import { VentasEdit } from '../ventas-edit/ventas-edit';
import { ProductsService } from '../../../services/products-service';
import { VentasService } from '../../../services/ventas-service';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, FormsModule, VentasAdd, VentasEdit],
  templateUrl: './ventas.html',
  styleUrl: './ventas.css',
})
export class Ventas implements OnInit, AfterViewInit {
  @ViewChild(VentasAdd) modalComponent!: VentasAdd;
  @ViewChild(VentasEdit) editModalComponent!: VentasEdit;

  searchTerm: string = '';
  ventas: any[] = [];
  selectedVentas: any;
  productMap: { [id: string]: string } = {};

  constructor(
    private ventasService: VentasService,
    private productService: ProductsService
  ) {}

  // ==============================================================
  // 🟢 Inicialización del componente
  // ==============================================================
  ngOnInit() {
    this.loadVentasAndProducts();
  }

  ngAfterViewInit() {
    console.log('Modal agregar:', this.modalComponent);
    console.log('Modal editar:', this.editModalComponent);
  }

  // ==============================================================
  // 🔵 Cargar ventas y productos
  // ==============================================================
  loadVentasAndProducts() {
    this.productService.getProducts1().subscribe({
      next: (products) => {
        // Crear mapa productoId → nombre
        this.productMap = {};
        products.forEach((p) => {
          if (p.id !== undefined) {
            this.productMap[p.id] = p.name || 'Sin nombre';
          }
        });

        // Obtener ventas
        this.ventasService.getVentas().subscribe({
          next: (ventas) => {
            this.ventas = ventas.map((v) => {
              const pid = v.productId ? String(v.productId) : '';
              return {
                ...v,
                productName: pid
                  ? this.productMap[pid] || 'Producto no disponible'
                  : 'Producto no disponible',
              };
            });
          },
          error: (err) => {
            console.error('❌ Error al cargar ventas:', err);
          },
        });
      },
      error: (err) => {
        console.error('❌ Error al cargar productos:', err);
      },
    });
  }

  // ==============================================================
  // 🔍 Filtrar ventas por fecha
  // ==============================================================
  filteredVentas() {
    const term = this.searchTerm.toLowerCase();
    return this.ventas.filter((venta) =>
      venta.date ? venta.date.toLowerCase().includes(term) : false
    );
  }

  // ==============================================================
  // ✏️ Editar venta (abre el modal de edición)
  // ==============================================================
  editProduct(venta: any) {
    this.selectedVentas = venta;

    if (this.editModalComponent) {
      this.editModalComponent.selectedVentas = this.selectedVentas;
      this.editModalComponent.open();

      // Sobrescribimos el método close del modal para refrescar al cerrar
      const originalClose = this.editModalComponent.close.bind(this.editModalComponent);
      this.editModalComponent.close = () => {
        this.loadVentasAndProducts(); // recarga la tabla
        originalClose();
      };
    } else {
      console.error('⚠️ editModalComponent no está definido');
    }
  }

  // ==============================================================
  // 🗑️ Eliminar venta con confirmación y restaurar stock
  // ==============================================================
  async deleteProduct(ventaId: string, productId: string, quantity: number) {
    const result = await Swal.fire({
      title: '¿Eliminar venta?',
      text: 'Esta acción restaurará el stock del producto.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      try {
        const product: any = await this.productService.getProductById(productId);

        if (product && product.stockQuantity !== undefined) {
          const newStock = (product.stockQuantity ?? 0) + quantity;

          // Actualizar stock y eliminar venta
          await this.productService.updateProductStock(productId, newStock);
          await this.ventasService.deleteVentas(ventaId);

          await Swal.fire(
            'Eliminada',
            'La venta ha sido eliminada y el stock restaurado.',
            'success'
          );

          this.loadVentasAndProducts();
        } else {
          await Swal.fire('Error', 'No se encontró el producto asociado.', 'error');
        }
      } catch (error) {
        console.error('❌ Error al eliminar venta:', error);
        await Swal.fire('Error', 'No se pudo eliminar la venta.', 'error');
      }
    }
  }

  // ==============================================================
  // ➕ Abrir modal de agregar venta
  // ==============================================================
  openAddVentaModal() {
    if (this.modalComponent) {
      this.modalComponent.open();
    } else {
      console.error('⚠️ modalComponent no está definido');
    }
  }

  // ==============================================================
  // ✏️ Abrir modal de edición directamente (opcional)
  // ==============================================================
  openEditVentaModal() {
    if (this.editModalComponent) {
      this.editModalComponent.open();
    } else {
      console.error('⚠️ editModalComponent no está definido');
    }
  }
}
