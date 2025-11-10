import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../../services/products-service';
import { VentasService } from '../../../services/ventas-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  totalProducts: number = 0;
  lowStockProducts: number = 0;
  lowStockProductsList: any[] = [];  // Productos con bajo stock
  top5Products: any[] = [];          // Más vendidos
  bottom5Products: any[] = [];       // Menos vendidos
  totalVentas: number = 0;

  constructor(
    private productService: ProductsService,
    private ventasService: VentasService
  ) {}

  ngOnInit(): void {
    this.loadProductData();
  }

  // ==============================================================
  // 📦 Cargar datos de productos
  // ==============================================================
  loadProductData(): void {
    this.productService.getProducts1().subscribe({
      next: (products) => {
        // Total de productos registrados
        this.totalProducts = products.length;

        // Filtrar productos con stock bajo (<10 unidades)
        this.lowStockProductsList = products.filter(
          (p) => (p.stockQuantity ?? 0) < 10
        );
        this.lowStockProducts = this.lowStockProductsList.length;

        // Luego cargar las métricas de ventas
        this.loadVentasData(products);
      },
      error: (err) => console.error('❌ Error al cargar productos:', err),
    });
  }

  // ==============================================================
  // 💰 Cargar datos de ventas
  // ==============================================================
  loadVentasData(products: any[]): void {
    this.ventasService.getVentas().subscribe({
      next: (ventas) => {
        // Total de ventas
        this.loadTotalVentas();

        // Calcular top 5 y bottom 5
        this.loadTop5AndBottom5Products(products, ventas);
      },
      error: (err) => console.error('❌ Error al cargar ventas:', err),
    });
  }

  // ==============================================================
  // 📊 Contar total de ventas registradas
  // ==============================================================
  loadTotalVentas(): void {
    this.ventasService.getTotalVentas().subscribe({
      next: (total) => (this.totalVentas = total),
      error: (err) => console.error('❌ Error al obtener total de ventas:', err),
    });
  }

  // ==============================================================
  // 🥇 Calcular Top 5 y Bottom 5 productos según ventas
  // ==============================================================
  loadTop5AndBottom5Products(products: any[], ventas: any[]): void {
    const salesMap: { [productId: string]: number } = {};

    // Sumar cantidad vendida por cada producto
    ventas.forEach((venta) => {
      const productId = venta.productId;
      const quantity = venta.quantity ?? 0;

      if (productId) {
        salesMap[productId] = (salesMap[productId] ?? 0) + quantity;
      }
    });

    // Transformar el mapa en un arreglo [{ productId, sales }]
    const productSales = Object.entries(salesMap).map(([productId, sales]) => ({
      productId,
      sales,
    }));

    // Ordenar por ventas
    const sortedSales = [...productSales].sort((a, b) => b.sales - a.sales);

    // Extraer Top 5 y Bottom 5
    const topProducts = sortedSales.slice(0, 5);
    const bottomProducts = sortedSales.slice(-5).reverse();

    // Mapear con nombre de producto
    this.top5Products = topProducts.map((item) => {
      const found = products.find((p) => p.id === item.productId);
      return {
        name: found?.name || 'Producto desconocido',
        sales: item.sales,
      };
    });

    this.bottom5Products = bottomProducts.map((item) => {
      const found = products.find((p) => p.id === item.productId);
      return {
        name: found?.name || 'Producto desconocido',
        sales: item.sales,
      };
    });
  }
}
