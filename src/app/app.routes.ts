import { Routes } from '@angular/router';
import { SignUp } from './components/auth/sign-up/sign-up';
import { SignIn } from './components/auth/sign-in/sign-in';
import { Dashboard } from './components/admin/dashboard/dashboard';
import { ForgotPassword } from './components/auth/forgot-password/forgot-password';
import { Products } from './components/admin/products/products';
import { Ventas } from './components/admin/ventas/ventas';
import { Header } from './components/layaout/header/header';
import { Reportes } from './components/admin/reportes/reportes';
import { LoginGuard } from './guard/login-guard';




export const routes: Routes = [
    { path: '', component: SignIn, pathMatch: 'full' },
    { path: 'iniciar-sesion', component: SignIn, pathMatch: 'full' },
    { path: 'recuperar-password', component: ForgotPassword, pathMatch: 'full' },
    { path: 'admin', component: Header, canActivate: [LoginGuard]}    
    
    // { path: 'a', component: Products},
    // {path: 'ventas', component: Ventas},
    // {path: '', component: Dashboard},
    // {path: 'a', component: Header},
    // {path: 'a', component: Reportes},
    // { path: 'as', component: SignIn, pathMatch: 'full' },
  
];
