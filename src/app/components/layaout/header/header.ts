import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

// Servicios
import { AuthService } from '../../../services/auth';

// Componentes hijos
import { Products } from '../../admin/products/products';
import { Ventas } from '../../admin/ventas/ventas';
import { Dashboard } from '../../admin/dashboard/dashboard';
import { Reportes } from '../../admin/reportes/reportes';
import { SignUp } from '../../auth/sign-up/sign-up';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, Products, Ventas, Dashboard, Reportes, SignUp],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  // =================== Estados de navegación ===================
  isSidebarOpen: boolean = false;
  isMenuDropdownOpen: boolean = false;
  isventas: boolean = false;
  isReportes: boolean = false;
  isDasboard: boolean = true;
  isRegister: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  // =================== Sidebar ===================
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    document.body.classList.toggle('sidebar-hidden', !this.isSidebarOpen);
  }

  // =================== Menús ===================
  toggleMenuDropdown() {
    this.resetViews();
    this.isMenuDropdownOpen = true;
  }

  toggleMenuDropdownVentas() {
    this.resetViews();
    this.isventas = true;
  }

  toggleMenuDropdownReportes() {
    this.resetViews();
    this.isReportes = true;
  }

  toggleMenuDropdownDasboard() {
    this.resetViews();
    this.isDasboard = true;
  }

  toggleMenuDropdownRegister() {
    this.resetViews();
    this.isRegister = true;
  }

  // =================== Cerrar Sesión ===================
  async logout() {
    console.log('🧩 logout() ejecutado');
    try {
      const result = await Swal.fire({
        title: '¿Cerrar sesión?',
        text: 'Tu sesión actual se cerrará.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, cerrar sesión',
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        // 🔹 Cierra sesión en Firebase
        await this.authService.logout();

        // 🔹 Mensaje de confirmación
        await Swal.fire({
          icon: 'success',
          title: 'Sesión cerrada',
          text: 'Has cerrado sesión correctamente.',
          timer: 1500,
          showConfirmButton: false,
        });

        // 🔹 Limpia estados y sidebar
        this.resetViews();
        this.isSidebarOpen = false;

        // 🔹 Redirige al login
        this.router.navigate(['/']);
      }
    } catch (error) {
      console.error('❌ Error al cerrar sesión:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al cerrar la sesión.',
      });
    }
  }

  // =================== Reset de vistas ===================
  private resetViews() {
    this.isMenuDropdownOpen = false;
    this.isventas = false;
    this.isReportes = false;
    this.isDasboard = false;
    this.isRegister = false;
  }
}
