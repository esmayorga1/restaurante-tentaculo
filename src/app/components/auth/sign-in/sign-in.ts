import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService} from '../../../services/auth';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sign-in',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.css',
})
export class SignIn {

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });

  constructor(private authService: AuthService, private router: Router) {}

  async onSubmit() {
    console.log('hola');
    if (this.loginForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Formulario inválido',
        text: 'Por favor, completa todos los campos correctamente.',
      });
      return;
    }

    try {
      const { email, password } = this.loginForm.value;
      await this.authService.loginWithEmail(email!, password!);

      Swal.fire({
        icon: 'success',
        title: 'Inicio de sesión exitoso',
        text: 'Bienvenido a la plataforma',
        timer: 2000,
        showConfirmButton: false
      });

      // 🔹 Redirigir al componente admin
      this.router.navigate(['/admin']);

    } catch (error: any) {
      if (error.message === 'Debe verificar su correo electrónico antes de iniciar sesión.') {
        Swal.fire({
          icon: 'info',
          title: 'Correo no verificado',
          text: 'Por favor, verifica tu correo antes de iniciar sesión.',
          confirmButtonText: 'Aceptar'
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error al iniciar sesión',
          text: 'Verifica tus credenciales e inténtalo de nuevo.',
          confirmButtonText: 'Aceptar'
        });
      }
    }
  }

  showPassword: boolean = false;
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
