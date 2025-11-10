import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../../services/products-service';
import { VentasService } from '../../../services/ventas-service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  // ======================== MÉTRICAS PRINCIPALES ========================
  totalProducts: number = 0;
  lowStockProducts: number = 0;
  lowStockProductsList: any[] = [];
  top5Products: any[] = [];
  bottom5Products: any[] = [];
  totalVentas: number = 0;
  isLoading: boolean = true;

  constructor(
    private productService: ProductsService,
    private ventasService: VentasService
  ) {}

  // ======================== INICIO ========================
  ngOnInit(): void {
    this.loadDashboardData();
  }

  // ======================== CARGA PRINCIPAL ========================
  async loadDashboardData(): Promise<void> {
    try {
      const products = await this.loadProducts();
      await this.loadVentasData(products);
      this.isLoading = false;
    } catch (error) {
      console.error('❌ Error cargando el dashboard:', error);
      this.isLoading = false;
    }
  }

  // ======================== PRODUCTOS ========================
  private loadProducts(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.productService.getProducts1().subscribe({
        next: (products) => {
          this.totalProducts = products.length;

          this.lowStockProductsList = products.filter(
            (p) => (p.stockQuantity ?? 0) < 10
          );
          this.lowStockProducts = this.lowStockProductsList.length;

          resolve(products);
        },
        error: (err) => {
          console.error('❌ Error al cargar productos:', err);
          reject(err);
        },
      });
    });
  }

  // ======================== VENTAS ========================
  private async loadVentasData(products: any[]): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ventasService.getVentas().subscribe({
        next: (ventas) => {
          this.loadTotalVentas();
          this.calculateTopAndBottomProducts(products, ventas);
          resolve();
        },
        error: (err) => {
          console.error('❌ Error al cargar ventas:', err);
          reject(err);
        },
      });
    });
  }

  // ======================== TOTAL VENTAS ========================
  private loadTotalVentas(): void {
    this.ventasService.getTotalVentas().subscribe({
      next: (total) => (this.totalVentas = total),
      error: (err) => console.error('❌ Error al obtener total de ventas:', err),
    });
  }

  // ======================== TOP / BOTTOM 5 ========================
  private calculateTopAndBottomProducts(products: any[], ventas: any[]): void {
    const salesMap: Record<string, number> = {};

    // Acumular ventas por producto
    for (const venta of ventas) {
      const id = venta.productId;
      const qty = venta.quantity ?? 0;
      if (id) {
        salesMap[id] = (salesMap[id] ?? 0) + qty;
      }
    }

    // Convertir el mapa en arreglo [{ productId, sales }]
    const productSales = Object.entries(salesMap).map(([productId, sales]) => ({
      productId,
      sales,
    }));

    // Ordenar descendente
    const sortedSales = [...productSales].sort((a, b) => b.sales - a.sales);

    // Top y Bottom 5
    const top5 = sortedSales.slice(0, 5);
    const bottom5 = sortedSales.slice(-5).reverse();

    // Mapear con nombres seguros
    this.top5Products = top5
      .map((item) => {
        const found = products.find((p) => p.id === item.productId);
        return found
          ? { name: found.name, sales: item.sales }
          : { name: 'Producto desconocido', sales: item.sales };
      })
      .filter((p) => p.name !== undefined);

    this.bottom5Products = bottom5
      .map((item) => {
        const found = products.find((p) => p.id === item.productId);
        return found
          ? { name: found.name, sales: item.sales }
          : { name: 'Producto desconocido', sales: item.sales };
      })
      .filter((p) => p.name !== undefined);
  }
}
