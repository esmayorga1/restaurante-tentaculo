import { Routes } from '@angular/router';
import { SignUp } from './components/auth/sign-up/sign-up';
import { SignIn } from './components/auth/sign-in/sign-in';
import { Dashboard } from './components/admin/dashboard/dashboard';
import { ForgotPassword } from './components/auth/forgot-password/forgot-password';
import { Products } from './components/admin/products/products';
import { Ventas } from './components/admin/ventas/ventas';
import { Header } from './components/layaout/header/header';
import { Reportes } from './components/admin/reportes/reportes';



export const routes: Routes = [
    { path: 'iniciar-sesion', component: SignIn, pathMatch: 'full' },
    { path: 'registrarme', component: SignUp, pathMatch: 'full' },
    { path: 'recuperar-password', component: ForgotPassword, pathMatch: 'full' },
    { path: 'admin', component: Dashboard},
    { path: 'a', component: Products},
    {path: 'as', component: Ventas},
    {path: 'a', component: Dashboard},
    {path: '', component: Header},
    {path: '', component: Reportes}
    // "recuperar-password"
];
