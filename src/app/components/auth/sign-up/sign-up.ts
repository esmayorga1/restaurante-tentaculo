import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sign-up',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUp {
  // Formulario reactivo para el registro de usuario
  registerForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email
      
    ]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(public authService: AuthService, private router: Router) { }

  // Alternar visibilidad de contraseña
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // Alternar visibilidad de confirmación
  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  // Enviar formulario
  async onSubmit() {
    if (this.passwordMatch()) {
      this.register();
    }
  }

  // Verificar si las contraseñas coinciden
  passwordMatch(): boolean {
    const password = this.registerForm.get('password')?.value;
    const confirmPassword = this.registerForm.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Las contraseñas no coinciden',
      });
      return false;
    }
    return true;
  }

  // Registrar usuario en Firebase
  async register() {
    console.log('Registrando usuario...');
    try {
      await this.authService.createUser(
        this.registerForm.value.email!,
        this.registerForm.value.password!
      );

      Swal.fire({
        icon: 'success',
        title: 'Usuario registrado',
        text: 'El usuario se registró correctamente',
        confirmButtonText: 'Aceptar'
      });

      // Limpiar formulario y redirigir
      this.clearForm();
      this.router.navigate(['/iniciar-sesion']);

    } catch (error) {
      console.error('Error al registrar usuario:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al registrar usuario',
        confirmButtonText: 'Aceptar'
      });
    }
  }

  // Limpiar formulario
  clearForm() {
    this.registerForm.reset();
  }
}
