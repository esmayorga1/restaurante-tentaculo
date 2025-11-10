import { Component, OnInit } from '@angular/core';
import { VentasService } from '../../../services/ventas-service';
import { ProductsService } from '../../../services/products-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reportes.html',
  styleUrl: './reportes.css',
})
export class Reportes implements OnInit {
  noVentas = false;
  ventas: any[] = [];
  startDate: string = '';
  endDate: string = '';
  selectedDate: string = '';
  gananciasTotales: number = 0;
  resumenVentas: any[] = [];
  processedProducts: Set<string> = new Set(); // Evita duplicados en el resumen

  constructor(
    private ventasService: VentasService,
    private productService: ProductsService
  ) {}

  ngOnInit(): void {}

  // ==============================================================
  // 📅 Obtener ventas por rango de fechas
  // ==============================================================
  obtenerVentasPorRango(): void {
    if (this.startDate && this.endDate) {
      this.ventasService.getVentasByDateRange(this.startDate, this.endDate).subscribe({
        next: (ventas) => {
          this.ventas = ventas;
          this.noVentas = this.ventas.length === 0;
          this.generarResumenVentas();
        },
        error: (err) => {
          console.error('❌ Error al obtener ventas por rango:', err);
          this.noVentas = true;
        },
      });
    } else {
      this.noVentas = true;
    }
  }

  // ==============================================================
  // 📆 Obtener ventas por día específico
  // ==============================================================
  obtenerVentasPorDia(): void {
    if (this.selectedDate) {
      this.ventasService.getVentasByDay(this.selectedDate).subscribe({
        next: (ventas) => {
          this.ventas = ventas;
          this.noVentas = this.ventas.length === 0;
          this.generarResumenVentas();
        },
        error: (err) => {
          console.error('❌ Error al obtener ventas por día:', err);
          this.noVentas = true;
        },
      });
    } else {
      this.noVentas = true;
    }
  }

  // ==============================================================
  // 💰 Generar resumen de ventas y calcular ganancias
  // ==============================================================
  async generarResumenVentas(): Promise<void> {
    this.resumenVentas = [];
    this.gananciasTotales = 0;
    this.processedProducts.clear();

    for (const venta of this.ventas) {
      // Firestore ya devuelve los datos planos (no dentro de venta.data)
      const { productId, quantity, total, date } = venta;

      if (!productId || this.processedProducts.has(productId)) continue;

      try {
        const product = await this.productService.getProductById(productId);

        const productName = product.name || 'Sin nombre';
        const purchasePrice = product.purchasePrice ?? 0;
        const salePrice = product.salePrice ?? 0;

        // Calcular ganancia por producto
        const ganancia = (salePrice - purchasePrice) * (quantity ?? 0);

        // Agregar al resumen
        this.resumenVentas.push({
          date,
          productName,
          purchasePrice,
          salePrice,
          totalCantidad: quantity,
          totalGanancia: ganancia,
        });

        // Sumar al total general
        this.gananciasTotales += ganancia;

        // Marcar como procesado
        this.processedProducts.add(productId);
      } catch (error) {
        console.error(`❌ Error obteniendo producto ${productId}:`, error);
      }
    }

    // Si no hay resultados
    if (this.resumenVentas.length === 0) {
      this.noVentas = true;
    }
  }

  // ==============================================================
  // 🧮 Obtener la ganancia total
  // ==============================================================
  totalGanancia(): number {
    return this.gananciasTotales;
  }
}
