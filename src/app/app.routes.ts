import { Routes } from '@angular/router';
import { SignUp } from './components/auth/sign-up/sign-up';
import { SignIn } from './components/auth/sign-in/sign-in';
import { Dashboard } from './components/admin/dashboard/dashboard';
import { ForgotPassword } from './components/auth/forgot-password/forgot-password';



export const routes: Routes = [
    { path: 'iniciar-sesion', component: SignIn, pathMatch: 'full' },
    { path: 'registrarme', component: SignUp, pathMatch: 'full' },
   { path: '', component: ForgotPassword, pathMatch: 'full' },
    { path: 'admin', component: Dashboard}
    // "recuperar-password"
];
