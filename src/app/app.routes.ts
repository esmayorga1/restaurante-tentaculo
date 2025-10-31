import { Routes } from '@angular/router';
import { SignUp } from './components/auth/sign-up/sign-up';
import { SignIn } from './components/auth/sign-in/sign-in';
import { Dashboard } from './components/admin/dashboard/dashboard';
import { ForgotPassword } from './components/auth/forgot-password/forgot-password';
import { Products } from './components/admin/products/products';



export const routes: Routes = [
    { path: 'iniciar-sesion', component: SignIn, pathMatch: 'full' },
    { path: 'registrarme', component: SignUp, pathMatch: 'full' },
   { path: 'recuperar-password', component: ForgotPassword, pathMatch: 'full' },
    { path: 'admin', component: Dashboard},
    { path: '', component: Products}
    // "recuperar-password"
];
